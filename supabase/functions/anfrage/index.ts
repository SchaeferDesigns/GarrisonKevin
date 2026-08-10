/**
 * Nimmt die Anfragen aus dem Kontaktformular von kevin-garrison.de entgegen.
 *
 * Ablauf:
 *   1. Herkunft prüfen (CORS und erlaubte Domains)
 *   2. Spamfalle und Sendefrequenz prüfen
 *   3. Alle Angaben erneut prüfen – dieselben Regeln wie im Browser
 *   4. Anhänge in den privaten Bucket legen
 *   5. Anfrage in public.garrison_anfragen speichern
 *   6. Weiterleitung per E-Mail über Resend, sofern eingerichtet
 *
 * Die Funktion läuft ohne JWT-Prüfung: Sie ist der öffentliche Endpunkt eines
 * Kontaktformulars, es gibt keinen angemeldeten Nutzer. Der Schutz liegt in
 * Herkunftsprüfung, Spamfalle, Sendebegrenzung und vollständiger Validierung.
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  checkAmount,
  checkEmail,
  checkMessage,
  checkName,
  checkPhone,
  checkPlace,
  normalizePhone,
  tidy,
} from './rules.ts';

const BUCKET = 'garrison-anfragen';
const TABLE = 'garrison_anfragen';

const MAX_FILES = 6;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 30 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

/** Höchstens so viele Anfragen je Absender und Stunde. */
const RATE_PER_HOUR = 5;

const env = (key: string) => Deno.env.get(key) ?? '';

const allowedOrigins = env('ALLOWED_ORIGINS')
  .split(',')
  .map((value) => value.trim().replace(/\/$/, ''))
  .filter(Boolean);

function corsHeaders(origin: string): Record<string, string> {
  /* Ohne Konfiguration bleibt der Endpunkt offen – sonst wäre die Seite
     nach einem Domainwechsel still kaputt. Mit Liste wird streng geprüft. */
  const allow = allowedOrigins.length === 0 || allowedOrigins.includes(origin.replace(/\/$/, ''));
  return {
    'Access-Control-Allow-Origin': allow && origin ? origin : allowedOrigins[0] ?? '*',
    'Access-Control-Allow-Headers': 'content-type, accept, authorization, apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function reply(body: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/** IP nur gehasht ablegen: reicht zur Missbrauchserkennung, ist aber kein Klartext. */
async function hashIp(ip: string): Promise<string | null> {
  const salt = env('IP_SALT');
  if (!ip || !salt) return null;
  const day = new Date().toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(`${ip}|${day}|${salt}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Dateinamen entschärfen: keine Pfade, keine Sonderzeichen, begrenzte Länge. */
function safeFileName(name: string, index: number): string {
  const plain = name.split(/[\\/]/).pop() ?? `datei-${index}`;
  const cleaned = plain
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(-80);
  return `${String(index + 1).padStart(2, '0')}-${cleaned || `datei-${index}`}`;
}

function asNumber(value: string): number | null {
  const cleaned = tidy(value).replace(',', '.');
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') ?? '';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== 'POST') {
    return reply({ error: 'Nur POST wird angenommen.' }, 405, origin);
  }
  if (allowedOrigins.length > 0 && origin && !allowedOrigins.includes(origin.replace(/\/$/, ''))) {
    return reply({ error: 'Diese Herkunft ist nicht freigegeben.' }, 403, origin);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ error: 'Die Anfrage konnte nicht gelesen werden.' }, 400, origin);
  }

  const field = (key: string) => {
    const value = form.get(key);
    return typeof value === 'string' ? value : '';
  };

  /* --- Spamfalle: Menschen sehen dieses Feld nicht. Still bestätigen. --- */
  if (tidy(field('website'))) {
    return reply({ ok: true }, 200, origin);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(field('payload') || '{}');
  } catch {
    return reply({ error: 'Die Angaben konnten nicht gelesen werden.' }, 400, origin);
  }

  const contact = (payload.contact ?? {}) as Record<string, string>;
  const project = (payload.project ?? {}) as Record<string, unknown>;

  const services = Array.isArray(project.services) ? (project.services as string[]).map(String).slice(0, 10) : [];
  const values = {
    name: tidy(String(contact.name ?? '')),
    phone: tidy(String(contact.phone ?? '')),
    email: tidy(String(contact.email ?? '')).toLowerCase(),
    preference: tidy(String(contact.preferredChannel ?? '')),
    area: tidy(String(project.areaSqm ?? '')),
    skirting: tidy(String(project.skirtingMeters ?? '')),
    joints: tidy(String(project.jointMeters ?? '')),
    oldFloor: tidy(String(project.oldFloor ?? '')),
    material: tidy(String(project.material ?? '')),
    customerType: tidy(String(project.customerType ?? '')),
    place: tidy(String(project.place ?? '')),
    timeframe: tidy(String(project.timeframe ?? '')),
    notes: String(project.notes ?? '').trim(),
  };

  /* ------------------------------- Fachliche Prüfung, wie im Browser --- */

  const problems: Record<string, string> = {};
  const wantsMail = values.preference === 'E-Mail';

  const add = (key: string, problem: string | null) => {
    if (problem) problems[key] = problem;
  };

  if (services.length === 0) problems.services = 'Bitte wählen Sie mindestens eine Leistung aus.';
  add('name', checkName(values.name));
  add('phone', checkPhone(values.phone, !wantsMail));
  add('email', checkEmail(values.email, wantsMail));
  add('place', checkPlace(values.place));
  add('notes', checkMessage(values.notes));
  add('area', checkAmount(values.area, 'area'));
  add('skirting', checkAmount(values.skirting, 'skirting'));
  add('joints', checkAmount(values.joints, 'joints'));

  if (payload.consent !== true) problems.consent = 'Ohne Einwilligung kann die Anfrage nicht verarbeitet werden.';

  if (Object.keys(problems).length > 0) {
    return reply({ error: 'Einige Angaben sind nicht gültig.', fields: problems }, 422, origin);
  }

  /* ----------------------------------------------------- Anhänge prüfen */

  const files: File[] = [];
  let totalBytes = 0;
  for (let index = 0; index < MAX_FILES + 1; index += 1) {
    const entry = form.get(`file${index}`);
    if (!(entry instanceof File)) continue;
    if (files.length >= MAX_FILES) {
      return reply({ error: `Es sind höchstens ${MAX_FILES} Dateien möglich.` }, 422, origin);
    }
    if (entry.size > MAX_FILE_BYTES) {
      return reply({ error: `${entry.name} ist zu groß.` }, 422, origin);
    }
    if (entry.type && !ALLOWED_TYPES.includes(entry.type)) {
      return reply({ error: `${entry.name} hat ein nicht erlaubtes Format.` }, 422, origin);
    }
    totalBytes += entry.size;
    if (totalBytes > MAX_TOTAL_BYTES) {
      return reply({ error: 'Die Anhänge sind zusammen zu groß.' }, 422, origin);
    }
    files.push(entry);
  }

  /* ------------------------------------------------- Speichern und Mail */

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  });

  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  const ipHash = await hashIp(forwarded.split(',')[0].trim());

  if (ipHash) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from(TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since);

    if ((count ?? 0) >= RATE_PER_HOUR) {
      return reply(
        { error: 'Es wurden bereits mehrere Anfragen gesendet. Bitte später erneut versuchen oder direkt anrufen.' },
        429,
        origin,
      );
    }
  }

  const id = crypto.randomUUID();
  const attachments: { name: string; size: number; type: string; path: string }[] = [];

  for (const [index, file] of files.entries()) {
    const path = `${id}/${safeFileName(file.name, index)}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });

    if (error) {
      console.error('Upload fehlgeschlagen', path, error.message);
      return reply({ error: 'Ein Anhang konnte nicht gespeichert werden.' }, 500, origin);
    }
    attachments.push({ name: file.name, size: file.size, type: file.type, path });
  }

  const summary = String(payload.summary ?? field('summary') ?? '').slice(0, 8000);

  const { error: insertError } = await supabase.from(TABLE).insert({
    id,
    name: values.name,
    phone: values.phone ? normalizePhone(values.phone) : null,
    email: values.email || null,
    contact_preference: values.preference,
    services,
    area_sqm: asNumber(values.area),
    skirting_meters: asNumber(values.skirting),
    joint_meters: asNumber(values.joints),
    old_floor: values.oldFloor || null,
    material: values.material || null,
    customer_type: values.customerType || null,
    place: values.place,
    timeframe: values.timeframe || null,
    notes: values.notes || null,
    attachments,
    summary,
    consent: true,
    consent_at: new Date().toISOString(),
    origin: origin || null,
    user_agent: (request.headers.get('user-agent') ?? '').slice(0, 300) || null,
    ip_hash: ipHash,
    mail_status: env('RESEND_API_KEY') ? 'offen' : 'deaktiviert',
  });

  if (insertError) {
    console.error('Speichern fehlgeschlagen', insertError.message);
    /* Bereits hochgeladene Dateien nicht verwaisen lassen. */
    if (attachments.length) {
      await supabase.storage.from(BUCKET).remove(attachments.map((file) => file.path));
    }
    return reply({ error: 'Die Anfrage konnte nicht gespeichert werden.' }, 500, origin);
  }

  /* Ab hier ist die Anfrage sicher gespeichert. Scheitert die E-Mail,
     bleibt die Antwort trotzdem positiv – der Stand steht in mail_status. */
  await forwardByMail(supabase, { id, values, summary, attachments });

  return reply({ ok: true, id }, 200, origin);
});

type MailInput = {
  id: string;
  values: { name: string; phone: string; email: string; place: string; preference: string };
  summary: string;
  attachments: { name: string; path: string }[];
};

/** Weiterleitung an Kevin über Resend. Ohne Schlüssel passiert nichts. */
async function forwardByMail(
  supabase: ReturnType<typeof createClient>,
  { id, values, summary, attachments }: MailInput,
) {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return;

  const from = env('MAIL_FROM') || 'Website <onboarding@resend.dev>';
  const to = env('MAIL_TO') || 'kevingarrison@outlook.de';

  try {
    /* Fotos nicht anhängen, sondern als zeitlich begrenzte Links mitgeben –
       das hält die E-Mail klein und funktioniert auch bei 30 MB Anhang. */
    let links = '';
    if (attachments.length) {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(attachments.map((file) => file.path), 60 * 60 * 24 * 30);

      links =
        '\n\nAnhänge (Links 30 Tage gültig):\n' +
        attachments
          .map((file, index) => `- ${file.name}: ${data?.[index]?.signedUrl ?? 'Link nicht verfügbar'}`)
          .join('\n');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email || undefined,
        subject: `Anfrage über die Website – ${values.name}, ${values.place}`,
        text: `${summary}${links}\n\n--\nAnfrage-Nummer: ${id}`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      await supabase
        .from(TABLE)
        .update({ mail_status: 'fehler', mail_error: detail.slice(0, 500) })
        .eq('id', id);
      console.error('Resend antwortete mit', response.status, detail);
      return;
    }

    await supabase
      .from(TABLE)
      .update({ mail_status: 'gesendet', mail_sent_at: new Date().toISOString(), mail_error: null })
      .eq('id', id);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await supabase.from(TABLE).update({ mail_status: 'fehler', mail_error: message.slice(0, 500) }).eq('id', id);
    console.error('E-Mail-Weiterleitung fehlgeschlagen', message);
  }
}
