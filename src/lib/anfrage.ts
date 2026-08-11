/**
 * Datenmodell und Versand des mehrstufigen Anfrageformulars.
 *
 * Die Website wird als statische Seite ausgeliefert und hat keinen eigenen
 * Server. Die Anfrage geht direkt an Supabase – zwei Variablen genügen:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…
 *
 * Sind beide gesetzt, legt `sendAnfrage` die Fotos im Bucket `anfragen` ab und
 * schreibt eine Zeile in die Tabelle `anfragen`. Fehlt eine, bleibt das
 * Formular voll bedienbar und übergibt die fertige Nachricht am Ende an das
 * E-Mail-Programm oder an WhatsApp – dann wird nichts übertragen.
 *
 * Der anon key ist öffentlich, er steht nach dem Build im ausgelieferten
 * JavaScript. Die Absicherung liegt deshalb vollständig in der Datenbank:
 * RLS erlaubt nur INSERT und kein Lesen, CHECK-Constraints erzwingen echte
 * Werte, ein Trigger deckelt die Zahl der Anfragen pro Stunde. Siehe
 * supabase/migrations.
 */

import { normalizePhone, tidy } from './anfrageRules';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Tabelle und Bucket in Supabase. */
export const anfrageTable = 'anfragen';
export const anfrageBucket = 'anfragen';

/** true, sobald die Anbindung steht – steuert Texte und Absendeweg. */
export const hasBackend = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export type AnfrageData = {
  /** Gewählte Leistungen, Klartext wie im Formular angezeigt. */
  services: string[];
  /** Bodenfläche in m², als Freitext, weil oft geschätzt. */
  area: string;
  /** Sockelleisten in laufenden Metern. */
  skirting: string;
  /** Fugen in laufenden Metern. */
  joints: string;
  /** Muss ein alter Belag raus? Leer, wenn für die Auswahl ohne Belang. */
  oldFloor: string;
  /** Stand beim Material. */
  material: string;
  /** Privat oder Gewerbe. */
  customerType: string;
  /** Ort oder Postleitzahl der Baustelle. */
  place: string;
  /** Wunschzeitraum für die Ausführung. */
  timeframe: string;
  /** Freitext zur Baustelle. */
  message: string;
  name: string;
  phone: string;
  email: string;
  /** Bevorzugter Rückmeldeweg. */
  contactPreference: string;
  /** Einwilligung in die Verarbeitung der Anfrage. */
  consent: boolean;
  /** Spamfalle – muss leer bleiben, wird nicht angezeigt. */
  website: string;
};

export const timeframes = [
  'So schnell wie möglich',
  'Innerhalb der nächsten 4 Wochen',
  'In 1–3 Monaten',
  'Zeitlich flexibel',
];

export const oldFloorOptions = ['Nein, Untergrund ist frei', 'Ja, alter Belag muss raus', 'Weiß ich noch nicht'];

export const materialOptions = [
  'Material ist schon da',
  'Material ist ausgesucht, aber noch nicht gekauft',
  'Material noch offen – bitte gemeinsam aussuchen',
];

export const customerTypes = ['Privat', 'Gewerbe'];

export const contactPreferences = ['WhatsApp', 'Telefon', 'E-Mail'];

export const emptyAnfrage: AnfrageData = {
  services: [],
  area: '',
  skirting: '',
  joints: '',
  oldFloor: oldFloorOptions[0],
  material: materialOptions[0],
  customerType: customerTypes[0],
  place: '',
  timeframe: timeframes[1],
  message: '',
  name: '',
  phone: '',
  email: '',
  contactPreference: contactPreferences[0],
  consent: false,
  website: '',
};

/* ------------------------------------------------------------- Anhänge */

export const maxFiles = 6;
export const maxFileBytes = 10 * 1024 * 1024;
export const maxTotalBytes = 30 * 1024 * 1024;
export const acceptedFileTypes = 'image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf';

const acceptedList = acceptedFileTypes.split(',');

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  const mb = bytes / (1024 * 1024);
  /* Glatte Werte ohne Nachkommastelle: „10 MB“ statt „10,0 MB“. */
  return `${(Math.round(mb * 10) % 10 === 0 ? String(Math.round(mb)) : mb.toFixed(1).replace('.', ','))} MB`;
}

/**
 * Prüft neu gewählte Dateien gegen die bereits vorhandenen.
 * Gibt die übernehmbaren Dateien und eine Meldung für alles Abgelehnte zurück.
 */
export function acceptFiles(existing: File[], incoming: File[]): { files: File[]; error: string } {
  const files = [...existing];
  const rejected: string[] = [];
  let total = files.reduce((sum, file) => sum + file.size, 0);

  for (const file of incoming) {
    const duplicate = files.some((known) => known.name === file.name && known.size === file.size);
    if (duplicate) continue;

    if (files.length >= maxFiles) {
      rejected.push(`Mehr als ${maxFiles} Dateien sind nicht möglich.`);
      break;
    }
    /* HEIC-Fotos von iPhones melden je nach Browser gar keinen Typ. */
    if (file.type && !acceptedList.includes(file.type)) {
      rejected.push(`${file.name}: nur Fotos (JPG, PNG, WebP, HEIC) und PDF.`);
      continue;
    }
    if (file.size > maxFileBytes) {
      rejected.push(`${file.name} ist größer als ${formatBytes(maxFileBytes)}.`);
      continue;
    }
    if (total + file.size > maxTotalBytes) {
      rejected.push(`Zusammen mehr als ${formatBytes(maxTotalBytes)} sind nicht möglich.`);
      continue;
    }

    files.push(file);
    total += file.size;
  }

  return { files, error: [...new Set(rejected)].join(' ') };
}

/* -------------------------------------------------------------- Inhalte */

/** Für Menschen lesbare Zusammenfassung – Vorschau, E-Mail und WhatsApp. */
export function buildMessage(data: AnfrageData, files: { name: string; size: number }[] = []): string {
  const lines = [
    'Anfrage über die Website',
    '',
    `Leistungen: ${data.services.length ? data.services.join(', ') : 'noch offen'}`,
  ];

  if (data.area) lines.push(`Bodenfläche: ca. ${data.area} m²`);
  if (data.skirting) lines.push(`Sockelleisten: ca. ${data.skirting} lfm`);
  if (data.joints) lines.push(`Fugen: ca. ${data.joints} lfm`);
  if (data.oldFloor) lines.push(`Alter Belag: ${data.oldFloor}`);

  lines.push(
    `Material: ${data.material}`,
    `Auftrag: ${data.customerType}`,
    '',
    `Ort: ${data.place || '(offen)'}`,
    `Wunschzeitraum: ${data.timeframe}`,
  );

  if (data.message.trim()) {
    lines.push('', 'Beschreibung:', data.message.trim());
  }

  if (files.length) {
    lines.push('', `Anhänge (${files.length}):`, ...files.map((file) => `- ${file.name} (${formatBytes(file.size)})`));
  }

  lines.push('', 'Kontakt:', data.name || '(Name)');
  if (data.phone) lines.push(`Telefon: ${data.phone}`);
  if (data.email) lines.push(`E-Mail: ${data.email}`);
  lines.push(`Rückmeldung bitte per: ${data.contactPreference}`);

  return lines.join('\n');
}

/** Zeile, wie sie in der Tabelle `anfragen` landet. */
export function buildRow(id: string, data: AnfrageData, attachments: Attachment[]) {
  const zahl = (value: string) => {
    const cleaned = tidy(value).replace(',', '.');
    return cleaned ? Number(cleaned) : null;
  };

  return {
    id,
    name: tidy(data.name),
    phone: data.phone.trim() ? normalizePhone(tidy(data.phone)) : null,
    email: tidy(data.email).toLowerCase() || null,
    contact_preference: data.contactPreference,
    services: data.services,
    area_sqm: zahl(data.area),
    skirting_meters: zahl(data.skirting),
    joint_meters: zahl(data.joints),
    old_floor: data.oldFloor || null,
    material: data.material || null,
    customer_type: data.customerType || null,
    place: tidy(data.place),
    timeframe: data.timeframe || null,
    notes: data.message.trim() || null,
    attachments,
    summary: buildMessage(data, attachments),
    consent: data.consent,
  };
}

export type AnfrageRow = ReturnType<typeof buildRow>;

export type Attachment = { name: string; size: number; type: string; path: string };

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

/** Der Client wird erst beim Absenden geladen, damit er die Seite nicht belastet. */
async function connect() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-anfrage-quelle': 'website' } },
  });
}

/**
 * Legt die Fotos im Bucket ab und schreibt die Anfrage in die Tabelle.
 *
 * Die Kennung wird hier erzeugt, damit die Dateien schon vor dem Schreiben
 * einen Ordner haben: Die Tabelle erlaubt nur INSERT und kein Lesen, ein
 * `select()` nach dem Einfügen würde also scheitern.
 */
export async function sendAnfrage(data: AnfrageData, files: File[] = []): Promise<void> {
  if (!hasBackend) {
    throw new Error('Die Anbindung an die Datenbank ist noch nicht eingerichtet.');
  }

  const supabase = await connect();
  const id = crypto.randomUUID();
  const attachments: Attachment[] = [];

  for (const [index, file] of files.entries()) {
    const path = `${id}/${safeFileName(file.name, index)}`;
    const { error } = await supabase.storage
      .from(anfrageBucket)
      .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });

    if (error) {
      await supabase.storage.from(anfrageBucket).remove(attachments.map((entry) => entry.path));
      throw new Error(`${file.name} konnte nicht hochgeladen werden.`);
    }
    attachments.push({ name: file.name, size: file.size, type: file.type, path });
  }

  const { error } = await supabase.from(anfrageTable).insert(buildRow(id, data, attachments));

  if (error) {
    /* Nichts verwaisen lassen, wenn die Zeile nicht zustande kommt. */
    if (attachments.length) {
      await supabase.storage.from(anfrageBucket).remove(attachments.map((entry) => entry.path));
    }
    throw new Error(erklaerung(error.message));
  }
}

/**
 * Datenbankmeldungen in etwas übersetzen, das ein Kunde lesen kann.
 * Die Prüfungen laufen vorher schon im Browser – hier landet nur, wer sie
 * umgeht oder wem die Sendebremse dazwischenkommt.
 */
function erklaerung(message: string): string {
  const text = message.toLowerCase();
  if (text.includes('zu viele anfragen')) {
    return 'Es sind gerade ungewöhnlich viele Anfragen eingegangen.';
  }
  if (text.includes('row-level security') || text.includes('permission')) {
    return 'Die Anfrage wurde abgelehnt.';
  }
  if (text.includes('check constraint') || text.includes('violates')) {
    return 'Eine Angabe wurde nicht akzeptiert – bitte Name, Telefonnummer und E-Mail-Adresse prüfen.';
  }
  return 'Die Anfrage konnte nicht gespeichert werden.';
}
