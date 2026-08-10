/**
 * Prüfregeln für das Anfrageformular.
 *
 * Diese Datei ist bewusst frei von Imports und Framework-Bezügen: Sie läuft
 * unverändert im Browser (Next.js) und in der Supabase Edge Function (Deno).
 * Die Kopie unter supabase/functions/anfrage/rules.ts wird mit
 * `npm run supabase:sync` erzeugt – nie von Hand bearbeiten.
 *
 * Rückgabewert überall: null heißt in Ordnung, sonst der Meldungstext.
 */

/* ------------------------------------------------------------- Grenzwerte */

export const limits = {
  name: { min: 2, max: 70 },
  place: { max: 80 },
  message: { max: 2000 },
  /** Plausible Ober- und Untergrenzen für die Mengenangaben. */
  area: { min: 1, max: 2000, unit: 'm²' },
  skirting: { min: 1, max: 2000, unit: 'lfm' },
  joints: { min: 1, max: 500, unit: 'lfm' },
};

/** Adressen, die erkennbar nur zum Ausfüllen gedacht sind. */
const placeholderEmails = [
  'test@test.de',
  'test@test.com',
  'a@a.de',
  'a@a.com',
  'asd@asd.de',
  'abc@abc.de',
  'mail@mail.de',
  'x@x.de',
  'no@no.de',
  'keine@keine.de',
];

/** Eindeutige Vertipper bei häufigen Anbietern. */
const domainTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.de': 'outlook.de',
  'outloo.de': 'outlook.de',
  'outlok.com': 'outlook.com',
  't-onlin.de': 't-online.de',
  't-onlie.de': 't-online.de',
  'gmx.ed': 'gmx.de',
  'gmx.d': 'gmx.de',
  'web.d': 'web.de',
  'wb.de': 'web.de',
};

/* --------------------------------------------------------------- Helfer */

/** Mehrfache Leerzeichen zusammenziehen und Steuerzeichen entfernen. */
export function tidy(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ').trim();
}

/** Erkennt 111111, 123456789 und 987654321 – typische Fantasienummern. */
function isFakeDigits(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return true;
  const up = '01234567890';
  const down = '09876543210';
  return digits.length >= 6 && (up.includes(digits) || down.includes(digits));
}

/* ----------------------------------------------------------------- Name */

export function checkName(input: string): string | null {
  const value = tidy(input);
  if (!value) return 'Bitte tragen Sie Ihren Namen ein.';
  if (value.length < limits.name.min) return 'Bitte tragen Sie Ihren vollständigen Namen ein.';
  if (value.length > limits.name.max) return 'Der Name ist zu lang.';
  if (/\d/.test(value)) return 'Ein Name enthält keine Ziffern.';
  if (!/^[\p{L}][\p{L}\p{M}'’.\- ]*[\p{L}.]$/u.test(value)) {
    return 'Bitte nur Buchstaben, Bindestrich und Leerzeichen verwenden.';
  }
  if (!/\p{L}{2}/u.test(value)) return 'Bitte tragen Sie Ihren vollständigen Namen ein.';
  return null;
}

/* ------------------------------------------------------------- Telefon */

/** Entfernt Trennzeichen, behält führendes + und die Ziffern. */
export function normalizePhone(input: string): string {
  return input.replace(/[\s/().\-–—]/g, '').replace(/^00/, '+');
}

export function checkPhone(input: string, required: boolean): string | null {
  const value = tidy(input);
  if (!value) return required ? 'Bitte geben Sie eine Telefonnummer an.' : null;
  if (/[a-zA-Z]/.test(value)) return 'Eine Telefonnummer besteht nur aus Ziffern, zum Beispiel 0170 1234567.';

  const compact = normalizePhone(value);
  if (!/^(\+\d{8,17}|0\d{6,14})$/.test(compact)) {
    return 'Bitte eine gültige Telefonnummer angeben, zum Beispiel 0170 1234567 oder +49 170 1234567.';
  }
  const digits = compact.replace(/\D/g, '');
  if (isFakeDigits(digits)) return 'Diese Telefonnummer sieht nicht echt aus.';
  /* Deutsche Vorwahlen beginnen nach der 0 nie mit einer weiteren 0. */
  if (/^00/.test(compact.replace('+49', '0'))) return 'Nach der Vorwahl-Null folgt keine weitere Null.';
  return null;
}

/* -------------------------------------------------------------- E-Mail */

export function checkEmail(input: string, required: boolean): string | null {
  const value = tidy(input).toLowerCase();
  if (!value) return required ? 'Bitte geben Sie eine E-Mail-Adresse an.' : null;
  if (value.length > 120) return 'Diese E-Mail-Adresse ist zu lang.';

  if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}$/.test(value)) {
    return 'Diese E-Mail-Adresse sieht nicht vollständig aus.';
  }
  if (placeholderEmails.includes(value)) return 'Bitte tragen Sie Ihre richtige E-Mail-Adresse ein.';

  const domain = value.slice(value.indexOf('@') + 1);
  const corrected = domainTypos[domain];
  if (corrected) return `Meinten Sie ${value.slice(0, value.indexOf('@') + 1)}${corrected}?`;
  return null;
}

/* ------------------------------------------------------------ Ort / PLZ */

export function checkPlace(input: string): string | null {
  const value = tidy(input);
  if (!value) return 'Bitte geben Sie Ort oder Postleitzahl der Baustelle an.';
  if (value.length > limits.place.max) return 'Diese Angabe ist zu lang.';

  const postal = value.match(/\d+/g);
  if (postal) {
    const wrongLength = postal.find((group) => group.length !== 5);
    if (wrongLength) return 'Eine deutsche Postleitzahl hat fünf Ziffern.';
    const code = Number(postal[0]);
    if (code < 1001 || code > 99998) return 'Diese Postleitzahl gibt es nicht.';
  }

  const letters = value.replace(/\d/g, '').trim();
  if (!postal && letters.length < 3) return 'Bitte den Ort ausschreiben oder die Postleitzahl angeben.';
  if (letters && !/^[\p{L}][\p{L}\p{M}\s.'’\-/()]*$/u.test(letters)) {
    return 'Bitte nur Ortsname und Postleitzahl eintragen.';
  }
  return null;
}

/* ------------------------------------------------------------- Mengen */

export function checkAmount(input: string, key: 'area' | 'skirting' | 'joints'): string | null {
  const value = tidy(input);
  if (!value) return null;

  const normalized = value.replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return 'Bitte nur eine Zahl eintragen, zum Beispiel 32 oder 32,5.';

  const number = Number(normalized);
  const rule = limits[key];
  if (!(number >= rule.min)) return `Bitte mindestens ${rule.min} ${rule.unit} angeben oder das Feld leer lassen.`;
  if (number > rule.max) {
    return `Über ${rule.max} ${rule.unit} bitte kurz beschreiben statt eintragen – ich melde mich dazu.`;
  }
  return null;
}

/* ------------------------------------------------------- Freitextfelder */

export function checkMessage(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (value.length > limits.message.max) return 'Die Beschreibung ist zu lang – bitte kürzen.';
  if (!/\p{L}/u.test(value)) return 'Bitte beschreiben Sie kurz mit Worten, worum es geht.';
  return null;
}
