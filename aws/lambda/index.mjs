/**
 * Nimmt die Anfragen aus dem Kontaktformular entgegen und schickt sie per SES
 * an Kevin. Fotos hängen direkt an der E-Mail, damit sie nirgends sonst
 * gespeichert werden müssen.
 *
 * Ablauf:
 *   1. Herkunft prüfen
 *   2. Spamfalle und Sendefrequenz prüfen
 *   3. Alle Angaben erneut prüfen – dieselben Regeln wie im Browser
 *   4. E-Mail bauen und über SES verschicken
 *
 * Umgebungsvariablen (siehe aws/template.yaml):
 *   MAIL_VON       Absender, muss in SES verifiziert sein
 *   MAIL_AN        Empfänger, muss in SES verifiziert sein, solange das Konto
 *                  in der Sandbox ist
 *   ERLAUBTE_HERKUNFT  Komma-Liste erlaubter Domains, leer = alle
 */

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import {
  checkAmount,
  checkEmail,
  checkMessage,
  checkName,
  checkPhone,
  checkPlace,
  tidy,
} from './rules.mjs';

const ses = new SESv2Client({});

const MAX_DATEIEN = 6;
const MAX_GESAMT = 5_000_000;
const ERLAUBTE_TYPEN = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

/** Höchstens so viele Anfragen je Absender und Stunde. */
const PRO_STUNDE = 5;

/* Lambda hält den Container zwischen Aufrufen warm, deshalb überlebt diese
   Liste kurze Pausen. Sie ist keine Festung, aber sie bremst Skripte. */
const letzteAnfragen = new Map();

const erlaubteHerkunft = (process.env.ERLAUBTE_HERKUNFT ?? '')
  .split(',')
  .map((wert) => wert.trim().replace(/\/$/, ''))
  .filter(Boolean);

function kopfzeilen(herkunft) {
  const erlaubt = erlaubteHerkunft.length === 0 || erlaubteHerkunft.includes(herkunft.replace(/\/$/, ''));
  return {
    'Access-Control-Allow-Origin': erlaubt && herkunft ? herkunft : (erlaubteHerkunft[0] ?? '*'),
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

const antwort = (status, koerper, herkunft) => ({
  statusCode: status,
  headers: kopfzeilen(herkunft),
  body: JSON.stringify(koerper),
});

/** Zählt die Anfragen je Absender und räumt alte Einträge weg. */
function zuOft(kennung) {
  const jetzt = Date.now();
  const grenze = jetzt - 60 * 60 * 1000;

  for (const [schluessel, zeiten] of letzteAnfragen) {
    const frisch = zeiten.filter((zeit) => zeit > grenze);
    if (frisch.length) letzteAnfragen.set(schluessel, frisch);
    else letzteAnfragen.delete(schluessel);
  }

  const bisher = letzteAnfragen.get(kennung) ?? [];
  if (bisher.length >= PRO_STUNDE) return true;

  letzteAnfragen.set(kennung, [...bisher, jetzt]);
  return false;
}

/** Zeilenumbrüche und Sonderzeichen aus Kopfzeilen fernhalten. */
function kopfzeileSicher(wert) {
  return String(wert).replace(/[\r\n]+/g, ' ').slice(0, 200);
}

/** Nicht-ASCII in Betreff und Namen nach RFC 2047 kodieren. */
function kodiert(wert) {
  const sauber = kopfzeileSicher(wert);
  // eslint-disable-next-line no-control-regex
  if (/^[\x20-\x7E]*$/.test(sauber)) return sauber;
  return `=?UTF-8?B?${Buffer.from(sauber, 'utf8').toString('base64')}?=`;
}

/** Dateinamen entschärfen: keine Pfade, keine Sonderzeichen. */
function dateinameSicher(name, nummer) {
  const blank = String(name).split(/[\\/]/).pop() ?? `datei-${nummer}`;
  const sauber = blank.normalize('NFKD').replace(/[^\w.\- ]+/g, '_').slice(-80);
  return sauber || `datei-${nummer}`;
}

/** Base64 in 76er-Zeilen umbrechen, wie es MIME verlangt. */
function umbrochen(base64) {
  return base64.replace(/.{76}/g, '$&\r\n');
}

/** Vollständige MIME-Nachricht mit Anhängen bauen. */
function baueMail({ von, an, antwortAn, betreff, text, dateien }) {
  const grenze = `anfrage-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const zeilen = [
    `From: ${von}`,
    `To: ${an}`,
    antwortAn ? `Reply-To: ${antwortAn}` : null,
    `Subject: ${kodiert(betreff)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${grenze}"`,
    '',
    `--${grenze}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    umbrochen(Buffer.from(text, 'utf8').toString('base64')),
  ].filter((zeile) => zeile !== null);

  dateien.forEach((datei, nummer) => {
    const name = dateinameSicher(datei.name, nummer);
    zeilen.push(
      `--${grenze}`,
      `Content-Type: ${datei.typ || 'application/octet-stream'}; name="${name}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${name}"`,
      '',
      umbrochen(datei.inhalt),
    );
  });

  zeilen.push(`--${grenze}--`, '');
  return zeilen.join('\r\n');
}

export const handler = async (ereignis) => {
  const herkunft = ereignis.headers?.origin ?? ereignis.headers?.Origin ?? '';
  const methode = ereignis.requestContext?.http?.method ?? 'POST';

  if (methode === 'OPTIONS') {
    return { statusCode: 204, headers: kopfzeilen(herkunft) };
  }
  if (methode !== 'POST') {
    return antwort(405, { fehler: 'Nur POST wird angenommen.' }, herkunft);
  }
  if (erlaubteHerkunft.length > 0 && herkunft && !erlaubteHerkunft.includes(herkunft.replace(/\/$/, ''))) {
    return antwort(403, { fehler: 'Diese Herkunft ist nicht freigegeben.' }, herkunft);
  }

  let anfrage;
  try {
    const roh = ereignis.isBase64Encoded
      ? Buffer.from(ereignis.body, 'base64').toString('utf8')
      : ereignis.body;
    anfrage = JSON.parse(roh || '{}');
  } catch {
    return antwort(400, { fehler: 'Die Anfrage konnte nicht gelesen werden.' }, herkunft);
  }

  /* Spamfalle: Menschen sehen dieses Feld nicht. Still bestätigen. */
  if (tidy(String(anfrage.website ?? ''))) {
    return antwort(200, { ok: true }, herkunft);
  }

  const absender = ereignis.requestContext?.http?.sourceIp ?? 'unbekannt';
  if (zuOft(absender)) {
    return antwort(429, { fehler: 'Es sind gerade ungewöhnlich viele Anfragen eingegangen.' }, herkunft);
  }

  /* ------------------------------------------ Angaben prüfen wie im Browser */

  const kontakt = anfrage.kontakt ?? {};
  const vorhaben = anfrage.vorhaben ?? {};

  const werte = {
    name: tidy(String(kontakt.name ?? '')),
    telefon: tidy(String(kontakt.telefon ?? '')),
    email: tidy(String(kontakt.email ?? '')).toLowerCase(),
    rueckmeldung: tidy(String(kontakt.rueckmeldung ?? '')),
    ort: tidy(String(vorhaben.ort ?? '')),
    beschreibung: String(vorhaben.beschreibung ?? '').trim(),
  };

  const zahl = (wert) => (wert === null || wert === undefined ? '' : String(wert));
  const leistungen = Array.isArray(vorhaben.leistungen) ? vorhaben.leistungen.map(String).slice(0, 10) : [];
  const willMail = werte.rueckmeldung === 'E-Mail';

  const maengel = {};
  const pruefe = (feld, ergebnis) => {
    if (ergebnis) maengel[feld] = ergebnis;
  };

  if (leistungen.length === 0) maengel.leistungen = 'Bitte wählen Sie mindestens eine Leistung aus.';
  pruefe('name', checkName(werte.name));
  pruefe('telefon', checkPhone(werte.telefon, !willMail));
  pruefe('email', checkEmail(werte.email, willMail));
  pruefe('ort', checkPlace(werte.ort));
  pruefe('beschreibung', checkMessage(werte.beschreibung));
  pruefe('flaeche', checkAmount(zahl(vorhaben.flaecheQm), 'area'));
  pruefe('leisten', checkAmount(zahl(vorhaben.leistenMeter), 'skirting'));
  pruefe('fugen', checkAmount(zahl(vorhaben.fugenMeter), 'joints'));

  if (anfrage.einwilligung !== true) {
    maengel.einwilligung = 'Ohne Einwilligung kann die Anfrage nicht verarbeitet werden.';
  }

  if (Object.keys(maengel).length > 0) {
    return antwort(422, { fehler: 'Einige Angaben sind nicht gültig.', felder: maengel }, herkunft);
  }

  /* ------------------------------------------------------- Anhänge prüfen */

  const dateien = Array.isArray(anfrage.dateien) ? anfrage.dateien : [];
  if (dateien.length > MAX_DATEIEN) {
    return antwort(422, { fehler: `Es sind höchstens ${MAX_DATEIEN} Dateien möglich.` }, herkunft);
  }

  let gesamt = 0;
  for (const datei of dateien) {
    if (typeof datei?.inhalt !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(datei.inhalt)) {
      return antwort(422, { fehler: 'Ein Anhang konnte nicht gelesen werden.' }, herkunft);
    }
    if (datei.typ && !ERLAUBTE_TYPEN.includes(datei.typ)) {
      return antwort(422, { fehler: `${datei.name} hat ein nicht erlaubtes Format.` }, herkunft);
    }
    gesamt += datei.inhalt.length;
  }
  if (gesamt > MAX_GESAMT) {
    return antwort(422, { fehler: 'Die Anhänge sind zusammen zu groß.' }, herkunft);
  }

  /* ------------------------------------------------------------ Verschicken */

  const zusammenfassung = String(anfrage.zusammenfassung ?? '').slice(0, 8000);
  const von = process.env.MAIL_VON;
  const an = process.env.MAIL_AN;

  if (!von || !an) {
    console.error('MAIL_VON oder MAIL_AN fehlt');
    return antwort(500, { fehler: 'Der Versand ist nicht vollständig eingerichtet.' }, herkunft);
  }

  const roh = baueMail({
    von: `${kodiert('Anfrage über die Website')} <${von}>`,
    an,
    antwortAn: werte.email || undefined,
    betreff: `Anfrage – ${werte.name}, ${werte.ort}`,
    text: `${zusammenfassung}\n\n--\nGesendet über das Formular auf der Website.`,
    dateien,
  });

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: von,
        Destination: { ToAddresses: [an] },
        Content: { Raw: { Data: Buffer.from(roh, 'utf8') } },
        ReplyToAddresses: werte.email ? [werte.email] : undefined,
      }),
    );
  } catch (fehler) {
    console.error('SES-Versand fehlgeschlagen', fehler);
    return antwort(502, { fehler: 'Die Anfrage konnte nicht zugestellt werden.' }, herkunft);
  }

  return antwort(200, { ok: true }, herkunft);
};
