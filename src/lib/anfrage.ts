/**
 * Datenmodell und Versand des mehrstufigen Anfrageformulars.
 *
 * Die Website wird als statische Seite ausgeliefert und hat deshalb keinen
 * eigenen Server. Der Versand geht an einen konfigurierbaren Endpunkt:
 *
 *   NEXT_PUBLIC_FORM_ENDPOINT=https://…
 *
 * Ist die Variable gesetzt, sendet das Formular die Anfrage per POST als JSON
 * dorthin (siehe `sendAnfrage`). Ist sie nicht gesetzt, bleibt das Formular
 * voll bedienbar und übergibt die fertige Nachricht am Ende an das
 * E-Mail-Programm oder an WhatsApp – es werden dann keine Daten übertragen.
 *
 * Zum Anbinden muss nur die Variable gesetzt werden. Der Endpunkt bekommt
 * genau das Objekt aus `buildPayload` und muss mit einem 2xx-Status antworten.
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
  /** Muss ein alter Belag raus? */
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

/** Für Menschen lesbare Zusammenfassung – Vorschau, E-Mail und WhatsApp. */
export function buildMessage(data: AnfrageData): string {
  const lines = [
    'Anfrage über die Website',
    '',
    `Leistungen: ${data.services.length ? data.services.join(', ') : 'noch offen'}`,
  ];

  if (data.area) lines.push(`Bodenfläche: ca. ${data.area} m²`);
  if (data.skirting) lines.push(`Sockelleisten: ca. ${data.skirting} lfm`);
  if (data.joints) lines.push(`Fugen: ca. ${data.joints} lfm`);

  lines.push(
    `Alter Belag: ${data.oldFloor}`,
    `Material: ${data.material}`,
    `Auftrag: ${data.customerType}`,
    '',
    `Ort: ${data.place || '(offen)'}`,
    `Wunschzeitraum: ${data.timeframe}`,
  );

  if (data.message.trim()) {
    lines.push('', 'Beschreibung:', data.message.trim());
  }

  lines.push('', 'Kontakt:', data.name || '(Name)');
  if (data.phone) lines.push(`Telefon: ${data.phone}`);
  if (data.email) lines.push(`E-Mail: ${data.email}`);
  lines.push(`Rückmeldung bitte per: ${data.contactPreference}`);

  return lines.join('\n');
}

/** Struktur, die an den Endpunkt geht. Feldnamen bewusst stabil halten. */
export function buildPayload(data: AnfrageData) {
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
    consent: data.consent,
    /** Fertig formatierte Fassung, damit die Weiterleitung nichts bauen muss. */
    summary: buildMessage(data),
  };
}

export type AnfragePayload = ReturnType<typeof buildPayload>;

/**
 * Sendet die Anfrage an den konfigurierten Endpunkt.
 * Wirft bei fehlender Konfiguration oder bei einer Fehlerantwort.
 */
export async function sendAnfrage(data: AnfrageData): Promise<void> {
  if (!hasFormEndpoint) {
    throw new Error('Es ist kein Endpunkt für den Versand hinterlegt.');
  }

  const response = await fetch(formEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(buildPayload(data)),
    signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(20000) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Der Versand wurde mit Status ${response.status} abgelehnt.`);
  }
}
