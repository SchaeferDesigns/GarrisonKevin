import { availability, business, faqs, mapsLink, prices, services, serviceAreas } from './business';

const url = business.siteUrl;

/**
 * Preisspanne über alle Leistungen, direkt aus den veröffentlichten Preisen.
 * Keine Einschätzung, sondern der niedrigste und höchste Ab-Preis.
 */
const preisspanne = (() => {
  const werte = prices.map((p) => p.from);
  return `${Math.min(...werte)}–${Math.max(...werte)} €`;
})();

/**
 * Felder, die nur erscheinen, wenn die Angaben wirklich vorliegen.
 * Erfundene Koordinaten oder leere Profillisten schaden mehr, als sie nützen.
 */
const geoWennBekannt = business.geo
  ? { geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng } }
  : {};

const profileWennVorhanden = business.sameAs.length ? { sameAs: [...business.sameAs] } : {};

/** Erreichbarkeit: Montag bis Samstag, 08:00–18:00 Uhr. */
const openingHoursSpecification = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '18:00',
  },
];

/** Zentrale Beschreibung des Betriebs – Basis für lokale Suche und KI-Antworten. */
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${url}/#betrieb`,
  name: `${business.name} – ${business.tagline}`,
  alternateName: business.name,
  description: business.shortDescription,
  url,
  telephone: business.phoneE164,
  email: business.email,
  image: `${url}/og-image.jpg`,
  logo: `${url}/marke.svg`,
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Barzahlung, Überweisung',
  priceRange: preisspanne,
  hasMap: mapsLink,
  /* Worum es fachlich geht – hilft Suchmaschinen und KI-Antworten beim
     Einordnen, ohne dass dafür Fließtext nötig wäre. */
  knowsAbout: [
    'Bodenverlegung',
    'Laminat verlegen',
    'Vinylboden verlegen',
    'Klickboden verlegen',
    'Trittschalldämmung',
    'Dampfsperre',
    'Sockelleisten montieren',
    'Acrylfugen',
    'Silikonfugen',
    'Fugen erneuern',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: business.phoneE164,
    email: business.email,
    areaServed: 'DE',
    availableLanguage: 'German',
    hoursAvailable: openingHoursSpecification,
  },
  ...geoWennBekannt,
  ...profileWennVorhanden,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.street,
    postalCode: business.postalCode,
    addressLocality: business.city,
    addressRegion: 'Baden-Württemberg',
    addressCountry: business.country,
  },
  areaServed: serviceAreas.map((place) => ({ '@type': 'City', name: place })),
  founder: { '@type': 'Person', name: business.name },
  knowsLanguage: ['de'],
  availableLanguage: 'Deutsch',
  openingHoursSpecification,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Leistungen',
    itemListElement: services.map((service) => {
      const price = prices.find((p) => p.id === service.priceId);
      return {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.short,
          serviceType: service.title,
          provider: { '@id': `${url}/#betrieb` },
          areaServed: business.serviceAreaLabel,
        },
        ...(price
          ? {
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: price.from,
                priceCurrency: 'EUR',
                minPrice: price.from,
                unitText: price.unitLong,
                valueAddedTaxIncluded: false,
              },
            }
          : {}),
        url: `${url}/leistungen/${service.slug}`,
      };
    }),
  },
  makesOffer: services.map((service) => ({
    '@type': 'Offer',
    name: service.title,
    url: `${url}/leistungen/${service.slug}`,
  })),
  slogan: 'Sauber, termingerecht, fair kalkuliert.',
  additionalProperty: availability.map((slot) => ({
    '@type': 'PropertyValue',
    name: slot.days,
    value: slot.hours,
  })),
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${url}/#website`,
  url,
  name: `${business.name} – ${business.tagline}`,
  inLanguage: 'de-DE',
  publisher: { '@id': `${url}/#betrieb` },
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${url}/faq#faq`,
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

export const serviceSchema = (slug: string) => {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  const price = prices.find((p) => p.id === service.priceId);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}/leistungen/${service.slug}#service`,
    name: service.title,
    description: service.metaDescription,
    serviceType: service.title,
    provider: { '@id': `${url}/#betrieb` },
    areaServed: serviceAreas.map((place) => ({ '@type': 'City', name: place })),
    url: `${url}/leistungen/${service.slug}`,
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: price.from,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: price.from,
              priceCurrency: 'EUR',
              unitText: price.unitLong,
              valueAddedTaxIncluded: false,
            },
          },
        }
      : {}),
  };
};

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${url}${item.path}`,
  })),
});
