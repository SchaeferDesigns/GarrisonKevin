/**
 * Datenmodell und Versand des mehrstufigen Anfrageformulars.
 *
 * Die Website ist statisch und hat keinen eigenen Server. Die Anfrage geht an
 * eine AWS-Lambda-Funktion, die sie prüft und per SES an Kevin weiterleitet:
 *
 *   NEXT_PUBLIC_FORM_ENDPOINT=https://<id>.lambda-url.<region>.on.aws/
 *
 * Ist die Variable gesetzt, sendet `sendAnfrage` alle Angaben als JSON dorthin,
 * Fotos inklusive. Fehlt sie, bleibt das Formular voll bedienbar und übergibt
 * die fertige Nachricht am Ende an das E-Mail-Programm oder an WhatsApp – dann
 * wird nichts übertragen.
 *
 * Fotos werden vorher im Browser verkleinert (siehe `prepareFiles`). Ein
 * Handyfoto hat schnell acht Megabyte; für die Einschätzung eines Raums
 * genügen 1600 Pixel. Das hält die Anfrage klein genug für Lambda und die
 * E-Mail klein genug für jedes Postfach.
 *
 * Geprüft wird zweimal: im Browser für die Meldungen, in der Lambda-Funktion
 * verbindlich. Siehe aws/lambda und src/lib/anfrageRules.ts.
 */

import { normalizePhone, tidy } from './anfrageRules';

export const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';

/** true, sobald die Anbindung steht – steuert Texte und Absendeweg. */
export const hasBackend = formEndpoint.length > 0;

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
/* Großzügig, weil Fotos vor dem Senden ohnehin verkleinert werden. */
export const maxFileBytes = 25 * 1024 * 1024;
export const maxTotalBytes = 120 * 1024 * 1024;
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

/** Angaben, wie sie an die Lambda-Funktion gehen. Feldnamen stabil halten. */
export function buildPayload(data: AnfrageData, files: PreparedFile[]) {
  const zahl = (value: string) => {
    const cleaned = tidy(value).replace(',', '.');
    return cleaned ? Number(cleaned) : null;
  };

  return {
    gesendetAm: new Date().toISOString(),
    kontakt: {
      name: tidy(data.name),
      telefon: data.phone.trim() ? normalizePhone(tidy(data.phone)) : '',
      email: tidy(data.email).toLowerCase(),
      rueckmeldung: data.contactPreference,
    },
    vorhaben: {
      leistungen: data.services,
      flaecheQm: zahl(data.area),
      leistenMeter: zahl(data.skirting),
      fugenMeter: zahl(data.joints),
      alterBelag: data.oldFloor,
      material: data.material,
      auftragsart: data.customerType,
      ort: tidy(data.place),
      zeitraum: data.timeframe,
      beschreibung: data.message.trim(),
    },
    einwilligung: data.consent,
    /* Spamfalle: Menschen sehen das Feld nicht, Bots füllen es aus. */
    website: data.website,
    zusammenfassung: buildMessage(data, files),
    dateien: files.map((file) => ({
      name: file.name,
      typ: file.type,
      groesse: file.size,
      inhalt: file.base64,
    })),
  };
}

export type AnfragePayload = ReturnType<typeof buildPayload>;

/* ----------------------------------------------------- Fotos vorbereiten */

export type PreparedFile = { name: string; type: string; size: number; base64: string };

/** Längste Kante nach dem Verkleinern. Reicht, um einen Raum zu beurteilen. */
const maxKante = 1600;

/** Was nach dem Verkleinern insgesamt übrig bleiben darf. */
export const maxPayloadBytes = 4_500_000;

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  /* In Blöcken, sonst sprengt ein großes Bild den Aufrufstapel. */
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return btoa(binary);
}

/**
 * Verkleinert ein Bild auf `maxKante` und gibt JPEG zurück.
 * Klappt das nicht – etwa bei HEIC ohne Browserunterstützung –, wird die
 * Datei unverändert übernommen.
 */
async function shrink(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const faktor = Math.min(1, maxKante / Math.max(bitmap.width, bitmap.height));

    /* Schon klein genug und ohnehin JPEG: nichts zu tun. */
    if (faktor === 1 && file.type === 'image/jpeg') {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * faktor);
    canvas.height = Math.round(bitmap.height * faktor);

    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.82),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Alle Anhänge verkleinern und in Base64 umwandeln. */
export async function prepareFiles(files: File[]): Promise<PreparedFile[]> {
  const fertig: PreparedFile[] = [];
  let gesamt = 0;

  for (const file of files) {
    const blob = await shrink(file);
    const base64 = toBase64(await blob.arrayBuffer());

    gesamt += base64.length;
    if (gesamt > maxPayloadBytes) {
      throw new Error(
        'Die Anhänge sind zusammen zu groß. Bitte einen weniger anhängen oder die Fotos per WhatsApp nachreichen.',
      );
    }

    fertig.push({
      name: file.name.replace(/\.(png|webp|heic|heif)$/i, blob.type === 'image/jpeg' ? '.jpg' : '$&'),
      type: blob.type || file.type,
      size: blob.size,
      base64,
    });
  }

  return fertig;
}

/* -------------------------------------------------------------- Versand */

/**
 * Schickt die Anfrage an die Lambda-Funktion.
 * Wirft mit einer Meldung, die dem Absender angezeigt werden kann.
 */
export async function sendAnfrage(data: AnfrageData, files: File[] = []): Promise<void> {
  if (!hasBackend) {
    throw new Error('Die Anbindung ist noch nicht eingerichtet.');
  }

  const vorbereitet = await prepareFiles(files);

  const response = await fetch(formEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload(data, vorbereitet)),
    signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(60000) : undefined,
  });

  if (response.ok) return;

  let grund = '';
  try {
    const body = await response.json();
    if (body && typeof body.fehler === 'string') grund = body.fehler;
  } catch {
    /* Keine verwertbare Antwort – dann bleibt es bei der allgemeinen Meldung. */
  }

  if (response.status === 429) {
    throw new Error(grund || 'Es sind gerade ungewöhnlich viele Anfragen eingegangen.');
  }
  throw new Error(grund || 'Die Anfrage konnte nicht übermittelt werden.');
}
