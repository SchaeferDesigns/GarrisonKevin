/**
 * Datenmodell und Versand des mehrstufigen Anfrageformulars.
 *
 * Die Website wird als statische Seite ausgeliefert und hat deshalb keinen
 * eigenen Server. Der Versand geht an einen konfigurierbaren Endpunkt:
 *
 *   NEXT_PUBLIC_FORM_ENDPOINT=https://…
 *
 * Ist die Variable gesetzt, sendet das Formular die Anfrage samt angehängten
 * Fotos per POST dorthin (siehe `sendAnfrage`). Ist sie nicht gesetzt, bleibt
 * das Formular voll bedienbar und übergibt die fertige Nachricht am Ende an
 * das E-Mail-Programm oder an WhatsApp – es werden dann keine Daten
 * übertragen und keine Dateien angeboten.
 *
 * Zum Anbinden muss nur die Variable gesetzt werden. Aufbau des Requests
 * siehe `buildFormData`; der Endpunkt muss mit einem 2xx-Status antworten.
 */

export const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';

/** true, sobald ein Endpunkt hinterlegt ist – steuert Texte und Absendeweg. */
export const hasFormEndpoint = formEndpoint.length > 0;

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
export function buildMessage(data: AnfrageData, files: File[] = []): string {
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

/** Struktur, die als JSON mitgeschickt wird. Feldnamen bewusst stabil halten. */
export function buildPayload(data: AnfrageData, files: File[] = []) {
  return {
    form: 'anfrage',
    submittedAt: new Date().toISOString(),
    contact: {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      preferredChannel: data.contactPreference,
    },
    project: {
      services: data.services,
      areaSqm: data.area.trim(),
      skirtingMeters: data.skirting.trim(),
      jointMeters: data.joints.trim(),
      oldFloor: data.oldFloor,
      material: data.material,
      customerType: data.customerType,
      place: data.place.trim(),
      timeframe: data.timeframe,
      notes: data.message.trim(),
    },
    attachments: files.map((file) => ({ name: file.name, size: file.size, type: file.type })),
    consent: data.consent,
    /** Fertig formatierte Fassung, damit die Weiterleitung nichts bauen muss. */
    summary: buildMessage(data, files),
  };
}

export type AnfragePayload = ReturnType<typeof buildPayload>;

/**
 * Baut den Request-Body. Immer `multipart/form-data`, damit Fotos und PDF
 * ohne Umweg mitgehen:
 *
 * - `payload`  – die Struktur aus `buildPayload` als JSON-Text
 * - `summary`  – dieselbe Anfrage als Fließtext, direkt als E-Mail-Body nutzbar
 * - `name`, `phone`, `email`, `place` – flach, für einfache Weiterleitungen
 * - `website`  – Spamfalle, muss leer sein
 * - `file0` … `fileN` – die Anhänge, dazu `fileCount`
 */
export function buildFormData(data: AnfrageData, files: File[] = []): FormData {
  const payload = buildPayload(data, files);
  const body = new FormData();

  body.append('payload', JSON.stringify(payload));
  body.append('summary', payload.summary);
  body.append('name', payload.contact.name);
  body.append('phone', payload.contact.phone);
  body.append('email', payload.contact.email);
  body.append('place', payload.project.place);
  body.append('website', data.website);
  body.append('fileCount', String(files.length));

  files.forEach((file, index) => body.append(`file${index}`, file, file.name));

  return body;
}

/**
 * Sendet die Anfrage an den konfigurierten Endpunkt.
 * Wirft bei fehlender Konfiguration oder bei einer Fehlerantwort.
 */
export async function sendAnfrage(data: AnfrageData, files: File[] = []): Promise<void> {
  if (!hasFormEndpoint) {
    throw new Error('Es ist kein Endpunkt für den Versand hinterlegt.');
  }

  /* Content-Type bewusst nicht setzen – der Browser ergänzt die Multipart-Grenze. */
  const response = await fetch(formEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: buildFormData(data, files),
    signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(60000) : undefined,
  });

  if (response.ok) return;

  /* Der Endpunkt begründet Ablehnungen im Klartext – die Begründung ist für
     den Absender nützlicher als die Statusnummer. */
  let detail = '';
  try {
    const body = await response.json();
    if (body && typeof body.error === 'string') detail = body.error;
  } catch {
    /* Keine verwertbare Antwort – dann bleibt es bei der Statusnummer. */
  }

  throw new Error(detail || `Der Versand wurde mit Status ${response.status} abgelehnt.`);
}
