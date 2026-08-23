/**
 * Zentrale Stammdaten des Betriebs.
 *
 * WICHTIG: Hier steht ausschließlich, was vom Betrieb bestätigt wurde –
 * die Angaben des Verkaufsschilds und die Antworten aus dem Fragebogen.
 * Beschreibende Zusätze, Qualitätsversprechen oder Leistungsdetails, die
 * nicht bestätigt sind, gehören nicht auf die Website.
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
  email: 'kontakt@garrison-bodentechnik.de',
  adId: '3463842102',
  /** Wird für Canonical-URLs, Sitemap und JSON-LD verwendet. */
  /**
   * Absolute Adresse der Seite. Sie steckt in Canonical-Links, Sitemap und in
   * den strukturierten Daten, wird also auch ohne feste Domain gebraucht.
   *
   * Es gibt noch keine Domain. Der Wert unten ist ein Platzhalter auf der dafür
   * reservierten Endung .example – er kann nie versehentlich auf eine fremde
   * Seite zeigen und fällt sofort auf. Gesetzt wird die echte Adresse über
   * NEXT_PUBLIC_SITE_URL; im Deploy steht dort bereits die Testadresse.
   * Vor dem Livegang die richtige Domain dort eintragen.
   */
  /* Kommt aus site.config.mjs. Ist dort nichts eingetragen, steht hier eine
     reservierte Beispieladresse – die kann niemandem gehören und führt daher
     auch nicht versehentlich auf eine fremde Seite. */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '') || 'https://kevin-garrison.example',
  serviceRadiusKm: 20,
  serviceAreaLabel: 'Aalen und Umgebung',
  vatNote: 'Preise ohne USt. gemäß Kleinunternehmerregelung § 19 UStG.',
  leadTime: 'meist 2 bis 3 Wochen',
  leadTimeShort: '2–3 Wochen Vorlauf',
  paymentMethods: 'Barzahlung oder Überweisung',
  experienceYears: 'über 10 Jahre',
  /** Vom Verkaufsschild übernommen. */
  slogan: 'Sauber, termingerecht, fair kalkuliert.',

  /**
   * Geokoordinaten des Betriebssitzes für die strukturierten Daten.
   *
   * Vom Betreiber aus Google Maps abgelesen und auf sechs Nachkommastellen
   * gekürzt – das sind rund elf Zentimeter. Mehr Stellen wären
   * Scheingenauigkeit, weniger würde den Betrieb im Ort verschieben.
   */
  geo: { lat: 48.888735, lng: 10.100033 } as { lat: number; lng: number } | null,

  /**
   * Verweise auf Profile desselben Betriebs. Google verknüpft darüber
   * Website und Unternehmensprofil miteinander – der stärkste einzelne
   * Hebel für die lokale Suche. Sobald das Profil steht, hier eintragen.
   */
  sameAs: [] as string[],
} as const;

/** Kartenlink aus der Anschrift – braucht keine Koordinaten. */
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${business.street}, ${business.postalCode} ${business.city}`,
)}`;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${business.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mailtoLink = (subject: string, body?: string) =>
  `mailto:${business.email}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ''
  }`;

export const telLink = `tel:${business.phoneE164}`;

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
    note: 'Laminat, Vinyl und Klickböden. Das Einbringen von Trittschalldämmung und Dampfsperre ist enthalten, das Material dafür kauft der Kunde.',
  },
  {
    id: 'sockelleisten',
    label: 'Sockelleisten',
    from: 7,
    unit: 'pro lfm',
    unitLong: 'pro laufendem Meter',
    note: 'Zuschnitt und Montage der vom Kunden gestellten Leisten.',
  },
  {
    id: 'fugen',
    label: 'Acryl- & Silikonfugen',
    from: 6,
    unit: 'pro lfm',
    unitLong: 'pro laufendem Meter',
    note: 'Alte Fugen entfernen und neu ziehen.',
  },
];

export const hourlyRate = {
  amount: 40,
  minHours: 1.5,
  thresholdOrderValue: 250,
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
    short: 'Laminat, Vinyl und Klickböden – verlegt inklusive Einbringung von Trittschalldämmung und Dampfsperre.',
    icon: 'plank',
    intro:
      'Verlegt werden Laminat, Vinyl und Klickböden. Der Untergrund wird vorher gereinigt, grundiert und von kleinen Unebenheiten befreit. Das Einbringen von Trittschalldämmung und Dampfsperre ist im Quadratmeterpreis enthalten – das Material stellt der Kunde.',
    bullets: [
      'Laminat, Vinyl und Klickböden – Klicksysteme',
      'Untergrund reinigen, grundieren und kleine Unebenheiten ausgleichen',
      'Einbringen von Trittschalldämmung und Dampfsperre im Quadratmeterpreis enthalten',
      'Ausbesserungen und Teilflächen, auch an Böden anderer Betriebe',
      'Besichtigung vor Ort und schriftliches Angebot',
    ],
    priceId: 'verlegung',
    metaTitle: 'Bodenverlegung Aalen – Laminat & Vinyl verlegen lassen',
    metaDescription:
      'Laminat, Vinyl und Klickböden verlegen lassen in Aalen und Umgebung. Ab 18 €/m² inklusive Einbringung von Trittschalldämmung und Dampfsperre, Besichtigung und schriftliches Angebot.',
  },
  {
    slug: 'sockelleisten',
    title: 'Sockelleisten',
    short: 'Zuschnitt und Montage der Leisten, passend zum verlegten Boden.',
    icon: 'skirting',
    intro:
      'Die Sockelleisten werden zugeschnitten und montiert. Die Leisten selbst stellt der Kunde – auf Wunsch suchen wir sie gemeinsam aus. Übergangsprofile an Türen und Raumwechseln sind eine eigene Position.',
    bullets: [
      'Zuschnitt und Montage der vom Kunden gestellten Leisten',
      'Übergangsprofile an Türen und Raumwechseln als eigene Position',
      'Sockelleisten mit Kabelkanal sind nicht im Angebot',
    ],
    priceId: 'sockelleisten',
    metaTitle: 'Sockelleisten montieren – Aalen und Umgebung',
    metaDescription:
      'Sockelleisten zuschneiden und montieren lassen. Ab 7 € pro laufendem Meter Arbeitsleistung in Aalen und Umgebung.',
  },
  {
    slug: 'fugen',
    title: 'Acryl- & Silikonfugen',
    short: 'Alte Fugen entfernen und neu ziehen – als eigener Auftrag oder zum Boden dazu.',
    icon: 'joint',
    intro:
      'Alte Acryl- und Silikonfugen werden entfernt und neu gezogen. Das geht als eigener Auftrag genauso wie zusammen mit einer Bodenverlegung. Bei kleinem Umfang wird nach Stunden abgerechnet.',
    bullets: [
      'Alte Acryl- und Silikonfugen entfernen',
      'Fugen neu ziehen',
      'Als eigener Auftrag oder zusammen mit der Bodenverlegung',
    ],
    priceId: 'fugen',
    metaTitle: 'Silikonfugen erneuern – Aalen und Umgebung',
    metaDescription:
      'Acryl- und Silikonfugen erneuern lassen in Aalen und Umgebung. Ab 6 € pro laufendem Meter Arbeitsleistung.',
  },
];

/** Beläge, die laut Verkaufsschild nicht verlegt werden. */
export const notOffered = ['Fliesen', 'Parkett', 'Estrich', 'PVC', 'Linoleum', 'Teppich'];

/** Weitere Arbeiten, die der Betrieb nicht anbietet. */
export const notOfferedExtra = ['Treppen', 'Sockelleisten mit Kabelkanal', 'vollflächig verklebtes Vinyl'];

/** Leistungen, die auf Wunsch dazukommen und separat berechnet werden. */
export const extras = [
  {
    title: 'Material gemeinsam aussuchen',
    text: 'Material stellt und bezahlt der Kunde. Auf Wunsch wird es gemeinsam ausgesucht und gegen Transportkosten angeliefert.',
  },
  {
    title: 'Alten Belag entfernen',
    text: 'Der alte Boden wird herausgenommen und abtransportiert. Entfernung und Transport werden als eigene Position berechnet.',
  },
  {
    title: 'Übergangsprofile',
    text: 'Profile und Schienen an Türen und Raumwechseln werden auf Wunsch gesetzt und separat berechnet.',
  },
  {
    title: 'Türblätter kürzen',
    text: 'Baut der neue Boden höher auf, wird das Türblatt auf Wunsch gekürzt. Wird ebenfalls separat berechnet.',
  },
];

export const importantNotes = [
  'Das Material stellt und bezahlt der Kunde – auf Wunsch wird es gemeinsam ausgesucht.',
  'Angeliefert wird das Material auf Wunsch gegen Transportkosten.',
  'Das Einbringen von Trittschalldämmung und Dampfsperre ist in der Verlegung enthalten.',
  'Die Anfahrt im Einsatzgebiet ist im Preis enthalten.',
  `Aufträge unter ${250} €: ab 40 €/Std., mindestens 1,5 Std.`,
  'Bezahlung per Barzahlung oder Überweisung.',
  business.vatNote,
  'Es gelten die gesetzlichen Gewährleistungsfristen.',
  'Alle Preise sind Richtwerte. Verbindlich wird das schriftliche Angebot nach der Besichtigung vor Ort.',
];

export type Step = { title: string; text: string };

export const processSteps: Step[] = [
  {
    title: 'Anfrage',
    text: 'Sie melden sich per WhatsApp, E-Mail oder Telefon und beschreiben, um welche Räume es geht. Eine Rückmeldung kommt in der Regel innerhalb von 24 Stunden.',
  },
  {
    title: 'Besichtigung',
    text: 'Ich sehe mir den Raum vor Ort an. Die Preise auf dieser Seite sind Richtwerte – verbindlich wird es erst nach der Besichtigung.',
  },
  {
    title: 'Schriftliches Angebot',
    text: 'Sie erhalten ein schriftliches Angebot für die Arbeitsleistung. Erst danach entscheiden Sie.',
  },
  {
    title: 'Termin & Ausführung',
    text: `Wir legen einen Termin fest – der Vorlauf beträgt derzeit ${business.leadTime}. Zum Termin sollten Raum und Zuwege leer und begehbar sein.`,
  },
  {
    title: 'Übergabe',
    text: 'Zum Abschluss übergebe ich Ihnen den fertigen Raum. Es gelten die gesetzlichen Gewährleistungsfristen.',
  },
];

/**
 * Rubriken der Fragenliste. Die Reihenfolge hier bestimmt die Reihenfolge
 * der Abschnitte auf der FAQ-Seite.
 */
export const faqGroups = ['Preis & Leistung', 'Material', 'Termin & Vorbereitung', 'Leistungen & Gebiet'] as const;

export type FaqGroup = (typeof faqGroups)[number];

export type Faq = { question: string; answer: string; group: FaqGroup };

/**
 * Die Reihenfolge zählt: Startseite, Preise und Leistungsseiten zeigen
 * jeweils die ersten Einträge als Auszug.
 */
export const faqs: Faq[] = [
  {
    question: 'Was kostet das Verlegen von Laminat oder Vinyl?',
    answer:
      'Die Arbeitsleistung beginnt bei 18 € pro Quadratmeter, inklusive Einbringung von Trittschalldämmung und Dampfsperre. Sockelleisten kosten ab 7 € pro laufendem Meter, Acryl- und Silikonfugen ab 6 € pro laufendem Meter. Das sind Richtwerte – der verbindliche Preis steht nach der Besichtigung im schriftlichen Angebot.',
    group: 'Preis & Leistung',
  },
  {
    question: 'Ist das Material im Preis enthalten?',
    answer:
      'Nein. Material stellt und bezahlt der Kunde, berechnet wird ausschließlich die Arbeitsleistung. Auf Wunsch suchen wir das Material gemeinsam aus, und gegen Transportkosten liefere ich es an. Das gilt auch für Trittschalldämmung und Dampfsperre – nur das Einbringen ist im Quadratmeterpreis enthalten.',
    group: 'Material',
  },
  {
    question: 'Wird der alte Boden mit entfernt?',
    answer:
      'Ja, auf Wunsch. Entfernung und Abtransport des alten Belags werden als eigene Position berechnet und stehen im Angebot. Ob der alte Belag liegen bleibt oder herauskommt, klären wir bei der Besichtigung.',
    group: 'Termin & Vorbereitung',
  },
  {
    question: 'Welche Böden werden nicht verlegt?',
    answer:
      'Nicht im Angebot sind Fliesen, Parkett, Estrich, PVC, Linoleum und Teppich. Ebenso keine Treppen, keine Sockelleisten mit Kabelkanal und kein vollflächig verklebtes Vinyl – verlegt werden Klicksysteme bei Laminat und Vinyl.',
    group: 'Leistungen & Gebiet',
  },
  {
    question: 'In welchem Gebiet sind Sie tätig?',
    answer:
      'In Aalen und Umgebung, in einem Radius von rund 20 Kilometern. Dazu gehören unter anderem Hüttlingen, Wasseralfingen, Oberkochen, Essingen, Abtsgmünd, Neuler, Westhausen, Lauchheim, Bopfingen, Heubach und Mögglingen. Die 20 Kilometer sind ein Richtwert – bei größeren Aufträgen fahre ich auch weiter. Die Anfahrt im Einsatzgebiet ist im Preis enthalten.',
    group: 'Leistungen & Gebiet',
  },
  {
    question: 'Wie schnell ist ein Termin möglich?',
    answer:
      'Der Vorlauf bis zum Ausführungstermin beträgt derzeit meist zwei bis drei Wochen. Auf Ihre Anfrage melde ich mich in der Regel innerhalb von 24 Stunden zurück. Erreichbar bin ich montags bis samstags von 8 bis 18 Uhr.',
    group: 'Termin & Vorbereitung',
  },
  {
    question: 'Was muss vor dem Termin vorbereitet sein?',
    answer:
      'Der Raum sollte leer geräumt sein – Möbel, Teppiche und lose Gegenstände raus. Auch die Zuwege sollten begehbar sein, also Eingang, Flur und Treppenhaus. Benötigtes Material stellt der Kunde und sollte zum Start der Baustelle vor Ort sein.',
    group: 'Termin & Vorbereitung',
  },
  {
    question: 'Was ist im Quadratmeterpreis enthalten – und was kostet extra?',
    answer:
      'Enthalten ist die Arbeitsleistung: das Einbringen von Trittschalldämmung und Dampfsperre, das Reinigen und Grundieren des Untergrunds, das Ausgleichen kleiner Unebenheiten sowie die Anfahrt innerhalb des Einsatzgebiets. Separat berechnet werden das Entfernen und Abtransportieren des alten Belags, Übergangsprofile an Türen und Raumwechseln sowie das Kürzen von Türblättern, wenn der neue Aufbau höher ist.',
    group: 'Preis & Leistung',
  },
  {
    question: 'Übernehmen Sie auch kleine Aufträge und Ausbesserungen?',
    answer:
      'Ja. Aufträge unter 250 € werden nach Stunden abgerechnet: ab 40 € pro Stunde bei mindestens 1,5 Stunden. Ausbesserungen und Teilflächen sind möglich, auch an Böden, die ein anderer Betrieb verlegt hat. Größere Aufträge sind ebenfalls kein Problem.',
    group: 'Preis & Leistung',
  },
  {
    question: 'Arbeiten Sie auch für Gewerbe?',
    answer: 'Ja. Neben Privatkunden übernehme ich auch Aufträge für Gewerbe.',
    group: 'Leistungen & Gebiet',
  },
  {
    question: 'Wie kann ich bezahlen?',
    answer:
      'Per Barzahlung oder Überweisung. Es gilt die Kleinunternehmerregelung nach § 19 UStG, daher werden alle Preise ohne Umsatzsteuer ausgewiesen. Es gelten die gesetzlichen Gewährleistungsfristen.',
    group: 'Preis & Leistung',
  },
  {
    question: 'Können wir das Material gemeinsam aussuchen?',
    answer:
      'Ja. Auf Wunsch suchen wir Boden und Leisten zusammen aus, und gegen Transportkosten liefere ich das Material an. Gekauft und bezahlt wird es weiterhin vom Kunden – berechnet wird ausschließlich die Arbeitsleistung.',
    group: 'Material',
  },
  {
    question: 'Welche Nutzungsklasse sollte der Boden haben?',
    answer:
      'Bodenbeläge tragen eine Nutzungsklasse nach DIN EN ISO 10874, die auf der Verpackung steht. Für normale Wohnräume ist NK 23/31 üblich, für Flure, Küchen und stark genutzte Bereiche NK 23/32 oder höher. Das ist eine allgemeine Angabe aus der Branche und gilt unabhängig davon, wo Sie kaufen.',
    group: 'Material',
  },
  {
    question: 'Wie viel Verschnitt sollte ich einplanen?',
    answer:
      'Auf die reine Raumfläche werden üblicherweise rund 10 Prozent Verschnitt aufgeschlagen, bei verwinkelten Räumen entsprechend mehr. Auch das ist ein allgemeiner Richtwert aus der Branche.',
    group: 'Material',
  },
  {
    question: 'Muss ich den Boden auf einmal kaufen?',
    answer:
      'Für zusammenhängende Flächen ist das zu empfehlen. Beläge derselben Dekorbezeichnung können sich je nach Produktionscharge im Farbton unterscheiden – wer nachkauft, riskiert einen sichtbaren Unterschied.',
    group: 'Material',
  },
];

/** Vom Betrieb bestätigte Ortsliste. */
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

/** Grundsätze in den Worten des Betriebs: sauber arbeiten, Termine halten, ehrlich kalkulieren. */
export const trustPoints = [
  {
    title: 'Persönlich vor Ort',
    text: 'Ich sehe mir jeden Auftrag selbst an und verlege auch selbst.',
  },
  {
    title: 'Nur die Arbeitsleistung',
    text: 'Material stellt der Kunde. Berechnet wird die Arbeitsleistung, ohne versteckte Positionen.',
  },
  {
    title: 'Termine halten',
    text: 'Ein zugesagter Termin wird gehalten. Der Vorlauf beträgt derzeit zwei bis drei Wochen.',
  },
  {
    title: 'Sauber arbeiten',
    text: 'Sauber arbeiten, Termine halten, ehrlich kalkulieren – die drei Grundsätze des Betriebs.',
  },
];
