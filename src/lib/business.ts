/**
 * Zentrale Stammdaten des Betriebs.
 * Alle Seiten, Strukturdaten (JSON-LD) und Kontaktpunkte lesen aus dieser Datei –
 * Änderungen hier wirken sich sofort auf die gesamte Website aus.
 */

export const business = {
  name: 'Kevin Garrison',
  legalName: 'Kevin Garrison',
  tagline: 'Bodenleger & Fugenarbeiten',
  headline: 'Bodenverlegung, Sockelleisten & Silikonfugen',
  shortDescription:
    'Bodenverlegung für Laminat, Vinyl und Klickböden, Sockelleisten sowie Acryl- und Silikonfugen in Aalen und Umgebung. Sauber, termingerecht und fair kalkuliert.',
  street: 'Mühlweg 9',
  postalCode: '73460',
  city: 'Hüttlingen',
  country: 'DE',
  countryName: 'Deutschland',
  phone: '0177 5436313',
  phoneE164: '+491775436313',
  whatsappNumber: '491775436313',
  email: 'kevingarrison@outlook.de',
  adId: '3463842102',
  /** Wird für Canonical-URLs, Sitemap und JSON-LD verwendet. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kevin-garrison.de',
  serviceRadiusKm: 20,
  serviceAreaLabel: 'Aalen und Umgebung',
  /** Kleinunternehmerregelung – Preise ohne Umsatzsteuer. */
  vatNote: 'Preise ohne USt. gemäß Kleinunternehmerregelung § 19 UStG.',
  /** Üblicher Vorlauf bis zum Ausführungstermin. */
  leadTime: 'meist 2 bis 3 Wochen',
  leadTimeShort: '2–3 Wochen Vorlauf',
  paymentMethods: 'Barzahlung oder Überweisung',
  experienceYears: 'über 10 Jahre',
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${business.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mailtoLink = (subject: string, body?: string) =>
  `mailto:${business.email}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ''
  }`;

export const telLink = `tel:${business.phoneE164}`;

/** Erreichbarkeit für Anrufe und Nachrichten. */
export const availability = [
  { days: 'Montag – Samstag', hours: '08:00 – 18:00 Uhr' },
  { days: 'Sonntag', hours: 'geschlossen' },
] as const;

export type Price = {
  id: string;
  label: string;
  from: number;
  unit: string;
  unitLong: string;
  note: string;
};

export const prices: Price[] = [
  {
    id: 'verlegung',
    label: 'Bodenverlegung',
    from: 18,
    unit: 'pro m²',
    unitLong: 'pro Quadratmeter',
    note: 'Laminat, Vinyl und Klickböden inklusive Zuschnitt, Trittschalldämmung und Dampfsperre.',
  },
  {
    id: 'sockelleisten',
    label: 'Sockelleisten',
    from: 7,
    unit: 'pro lfm',
    unitLong: 'pro laufendem Meter',
    note: 'Zuschnitt, Gehrung und Montage der vom Kunden gestellten Leisten.',
  },
  {
    id: 'fugen',
    label: 'Acryl- & Silikonfugen',
    from: 6,
    unit: 'pro lfm',
    unitLong: 'pro laufendem Meter',
    note: 'Neuverfugung sowie Entfernen und Erneuern alter Fugen.',
  },
];

export const hourlyRate = {
  amount: 40,
  minHours: 1.5,
  thresholdOrderValue: 250,
  note: 'Kleine Aufträge unter 250 € werden nach Stunden abgerechnet: ab 40 €/Std., mindestens 1,5 Stunden.',
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: 'plank' | 'skirting' | 'joint';
  intro: string;
  bullets: string[];
  priceId: string;
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: 'bodenverlegung',
    title: 'Bodenverlegung',
    short: 'Laminat, Vinyl und Klickböden – fachgerecht verlegt, sauber abgeschlossen.',
    icon: 'plank',
    intro:
      'Laminat, Vinyl und Klickböden werden millimetergenau eingemessen, zugeschnitten und verlegt. Trittschalldämmung und Dampfsperre gehören dazu und sind im Quadratmeterpreis enthalten. Vom Vorbereiten des Untergrunds bis zur letzten Abschlussleiste bleibt alles in einer Hand – Sie bekommen einen Raum, der fertig ist und nicht nachgearbeitet werden muss.',
    bullets: [
      'Laminat, Vinyl und Klickböden – Klicksysteme aller gängigen Hersteller',
      'Untergrund reinigen, grundieren und kleine Unebenheiten ausgleichen',
      'Trittschalldämmung und Dampfsperre – im Quadratmeterpreis enthalten',
      'Millimetergenauer Zuschnitt an Türzargen, Heizrohren und Nischen',
      'Ausbesserungen und Teilflächen – auch an Böden, die jemand anderes verlegt hat',
      'Besenreine Übergabe des fertigen Raums',
    ],
    priceId: 'verlegung',
    metaTitle: 'Bodenverlegung Aalen – Laminat & Vinyl verlegen lassen',
    metaDescription:
      'Laminat, Vinyl und Klickböden fachgerecht verlegen lassen in Aalen und Umgebung. Ab 18 €/m² inklusive Trittschalldämmung, kostenlose Besichtigung und schriftliches Angebot.',
  },
  {
    slug: 'sockelleisten',
    title: 'Sockelleisten',
    short: 'Sauber auf Gehrung geschnitten, spaltfrei montiert, passend zum Boden.',
    icon: 'skirting',
    intro:
      'Sockelleisten sind das, was man als Erstes sieht, wenn ein Boden nicht sauber gearbeitet wurde. Ich schneide auf Gehrung, arbeite Ecken und Übergänge spaltfrei aus und montiere so, dass die Leisten dicht an der Wand sitzen – auch dann, wenn der Altbau keine gerade Wand hergibt.',
    bullets: [
      'Zuschnitt auf Gehrung für Innen- und Außenecken',
      'Montage mit Clips, Kleber oder Schrauben – je nach Wand und Leiste',
      'Saubere Anschlüsse an Türzargen und Heizungsnischen',
      'Abdichten der Anschlussfuge zur Wand',
      'Demontage alter Leisten nach Absprache',
      'Übergangsprofile an Türen und Raumwechseln als eigene Position',
    ],
    priceId: 'sockelleisten',
    metaTitle: 'Sockelleisten montieren – Aalen und Umgebung',
    metaDescription:
      'Sockelleisten fachgerecht zuschneiden und montieren lassen. Ab 7 € pro laufendem Meter Arbeitsleistung in Aalen und Umgebung.',
  },
  {
    slug: 'fugen',
    title: 'Acryl- & Silikonfugen',
    short: 'Alte Fugen raus, neue Fugen sauber gezogen – in Bad, Küche und Anschlussbereich.',
    icon: 'joint',
    intro:
      'Verfärbte oder rissige Fugen macht man nicht schön, die macht man neu. Alte Fugen werden vollständig entfernt, der Untergrund gereinigt und vorbereitet, dann wird sauber und in gleichmäßiger Stärke neu gezogen – im Bad, in der Küche und an allen Anschlussfugen rund um den Boden.',
    bullets: [
      'Alte Silikon- und Acrylfugen vollständig entfernen',
      'Untergrund reinigen, entfetten und trocknen lassen',
      'Sanitärsilikon für Bad, Dusche und Küche',
      'Acrylfugen für Anschlüsse an Wand und Decke',
      'Dehnungs- und Anschlussfugen am Bodenbelag',
      'Gleichmäßige Fugenstärke, saubere Kanten',
    ],
    priceId: 'fugen',
    metaTitle: 'Silikonfugen erneuern – Aalen und Umgebung',
    metaDescription:
      'Silikon- und Acrylfugen erneuern lassen in Bad, Küche und am Bodenanschluss. Ab 6 € pro laufendem Meter in Aalen und Umgebung.',
  },
];

/** Beläge, die bewusst nicht verlegt werden – schafft Klarheit und spart beiden Seiten Zeit. */
export const notOffered = ['Fliesen', 'Parkett', 'Estrich', 'PVC', 'Linoleum', 'Teppich'];

/** Weitere Arbeiten, die nicht angeboten werden. */
export const notOfferedExtra = ['Treppen', 'Sockelleisten mit Kabelkanal', 'vollflächig verklebtes Vinyl'];

/** Leistungen, die auf Wunsch dazukommen und separat berechnet werden. */
export const extras = [
  {
    title: 'Material gemeinsam aussuchen',
    text: 'Material stellt und bezahlt der Kunde. Auf Wunsch suchen wir es gemeinsam aus – dann passt die Nutzungsklasse zum Raum und die Menge zum Verschnitt. Gegen Transportkosten liefere ich es auch an.',
  },
  {
    title: 'Alten Belag entfernen',
    text: 'Der alte Boden kommt raus und wird abtransportiert. Entfernung und Transport werden nach Aufwand berechnet und stehen als eigene Position im Angebot.',
  },
  {
    title: 'Übergangsprofile',
    text: 'Profile und Schienen an Türen und Raumwechseln setze ich auf Wunsch – als eigene Position, damit Sie sehen, was sie kosten.',
  },
  {
    title: 'Türblätter kürzen',
    text: 'Baut der neue Boden höher auf, kürze ich das Türblatt auf Wunsch. Wird ebenfalls separat berechnet.',
  },
];

export const importantNotes = [
  'Das Material stellt und bezahlt der Kunde – auf Wunsch suchen wir es gemeinsam aus.',
  'Angeliefert wird das Material auf Wunsch gegen Transportkosten.',
  'Trittschalldämmung und Dampfsperre sind in der Verlegung enthalten.',
  'Die Anfahrt im Einsatzgebiet ist im Preis enthalten.',
  `Kleine Aufträge unter ${hourlyRate.thresholdOrderValue} €: ab ${hourlyRate.amount} €/Std. (mindestens ${hourlyRate.minHours.toLocaleString('de-DE')} Std.).`,
  `Bezahlung per ${business.paymentMethods}.`,
  business.vatNote,
  'Alle Preise sind Richtwerte. Verbindlich wird das schriftliche Angebot nach der Besichtigung vor Ort.',
];

export type Step = { title: string; text: string };

export const processSteps: Step[] = [
  {
    title: 'Anfrage',
    text: 'Sie schreiben mir per WhatsApp oder E-Mail, um welche Räume es geht und wie viele Quadratmeter ungefähr anfallen. Ein Foto hilft mir bereits sehr.',
  },
  {
    title: 'Besichtigung',
    text: 'Ich schaue mir den Untergrund, die Raumsituation und die Anschlüsse vor Ort an. So gibt es später keine Überraschungen auf der Rechnung.',
  },
  {
    title: 'Schriftliches Angebot',
    text: 'Sie erhalten ein Angebot mit klaren Positionen und Festpreis für die Arbeitsleistung. Erst danach entscheiden Sie.',
  },
  {
    title: 'Termin & Ausführung',
    text: `Wir legen einen festen Termin – aktuell mit ${business.leadTimeShort}. Ich arbeite die Fläche in einem Zug ab, decke ab und halte die Baustelle sauber.`,
  },
  {
    title: 'Übergabe',
    text: 'Wir gehen den fertigen Raum gemeinsam durch. Erst wenn Sie zufrieden sind, ist der Auftrag abgeschlossen.',
  },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: 'Was kostet das Verlegen von Laminat oder Vinyl?',
    answer:
      'Die Arbeitsleistung beginnt bei 18 € pro Quadratmeter, inklusive Trittschalldämmung und Dampfsperre. Sockelleisten kosten ab 7 € pro laufendem Meter, Acryl- und Silikonfugen ab 6 € pro laufendem Meter. Das sind Richtwerte – der verbindliche Preis steht nach der Besichtigung im schriftlichen Angebot.',
  },
  {
    question: 'Ist das Material im Preis enthalten?',
    answer:
      'Nein. Material stellt und bezahlt der Kunde. Sie kaufen genau den Boden und die Leisten, die Sie möchten – ich berechne ausschließlich die Arbeitsleistung. Das macht die Rechnung transparent und Sie zahlen keinen Aufschlag auf Material. Wenn Sie möchten, suchen wir das Material gemeinsam aus, und ich liefere es gegen Transportkosten an.',
  },
  {
    question: 'Wird der alte Boden mit entfernt?',
    answer:
      'Ja, den alten Belag nehme ich auf Wunsch heraus und transportiere ihn ab. Entfernung und Transport werden nach Aufwand berechnet und stehen als eigene Position im Angebot, damit Sie sehen, was sie kosten.',
  },
  {
    question: 'Welche Böden werden nicht verlegt?',
    answer:
      'Nicht im Angebot sind Fliesen, Parkett, Estrich, PVC, Linoleum und Teppich. Ebenso keine Treppen und kein vollflächig verklebtes Vinyl – der Schwerpunkt liegt auf Klicksystemen bei Laminat und Vinyl sowie auf Sockelleisten und Fugenarbeiten.',
  },
  {
    question: 'In welchem Gebiet sind Sie tätig?',
    answer:
      'In Aalen und Umgebung, in einem Radius von rund 20 Kilometern. Dazu gehören unter anderem Hüttlingen, Wasseralfingen, Oberkochen, Essingen, Abtsgmünd, Neuler, Westhausen, Lauchheim, Bopfingen, Heubach und Mögglingen. Die 20 Kilometer sind ein Richtwert – bei größeren Aufträgen fahre ich auch weiter. Die Anfahrt im Einsatzgebiet ist im Preis enthalten.',
  },
  {
    question: 'Wie schnell ist ein Termin möglich?',
    answer:
      'Der Vorlauf bis zum Ausführungstermin beträgt derzeit meist zwei bis drei Wochen. Auf Ihre Anfrage melde ich mich in der Regel innerhalb von 24 Stunden mit einer realistischen Einschätzung zurück.',
  },
  {
    question: 'Übernehmen Sie auch kleine Aufträge und Ausbesserungen?',
    answer:
      'Ja. Aufträge unter 250 € werden nach Stunden abgerechnet: ab 40 € pro Stunde bei mindestens 1,5 Stunden. Auch einzelne Räume, Teilflächen und Ausbesserungen sind kein Problem – ebenso an Böden, die jemand anderes verlegt hat.',
  },
  {
    question: 'Arbeiten Sie auch für Gewerbe und Hausverwaltungen?',
    answer:
      'Ja. Neben Privatkunden übernehme ich auch Aufträge für Büros, Ladenflächen, Praxen und Hausverwaltungen. Auch größere zusammenhängende Flächen sind möglich.',
  },
  {
    question: 'Muss der Raum leer geräumt sein?',
    answer:
      'Ja. Der Raum und die Zuwege dorthin sollten zum Termin leer und begehbar sein, damit ich sofort anfangen kann. Wenn das nicht möglich ist oder der Altbelag noch liegt, sprechen wir bei der Besichtigung ab, wie wir damit umgehen.',
  },
  {
    question: 'Wie kann ich bezahlen?',
    answer:
      'Per Barzahlung oder Überweisung. Es gilt die Kleinunternehmerregelung nach § 19 UStG, daher werden alle Preise ohne Umsatzsteuer ausgewiesen. Es gelten die gesetzlichen Gewährleistungsfristen.',
  },
];

/** Orte im Einsatzgebiet – relevant für lokale Suchanfragen. */
export const serviceAreas = [
  'Aalen',
  'Hüttlingen',
  'Wasseralfingen',
  'Oberkochen',
  'Essingen',
  'Abtsgmünd',
  'Neuler',
  'Westhausen',
  'Lauchheim',
  'Bopfingen',
  'Heubach',
  'Mögglingen',
  'Böbingen an der Rems',
  'Rainau',
  'Ellwangen',
  'Adelmannsfelden',
];

export const trustPoints = [
  {
    title: 'Immer persönlich vor Ort',
    text: 'Ich schaue mir jeden Auftrag selbst an und verlege auch selbst. Keine wechselnden Kolonnen, keine Übergabefehler.',
  },
  {
    title: 'Nur die Arbeitsleistung',
    text: 'Material kaufen Sie selbst. Dadurch entfällt jeder versteckte Materialaufschlag auf der Rechnung.',
  },
  {
    title: 'Termin steht',
    text: 'Ein zugesagter Termin wird gehalten. Wenn etwas dazwischenkommt, erfahren Sie es sofort und nicht am Tag danach.',
  },
  {
    title: 'Sauberes Arbeiten',
    text: 'Abdecken, absaugen, aufräumen. Der Raum wird besenrein übergeben, nicht als Baustelle hinterlassen.',
  },
];
