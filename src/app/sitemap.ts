import type { MetadataRoute } from 'next';
import { business, services } from '@/lib/business';

// Beim statischen Export als Datei erzeugen.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.siteUrl;
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/leistungen', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/kontakt', priority: 0.85, changeFrequency: 'yearly' },
    { path: '/ablauf', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/ueber-mich', priority: 0.65, changeFrequency: 'yearly' },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    /* Rechtstexte, die indexiert werden dürfen. Datenschutz und
       Widerrufsbelehrung tragen ein noindex und gehören deshalb nicht hierher. */
    { path: '/impressum', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/agb', priority: 0.2, changeFrequency: 'yearly' },
  ];

  /* Die Seite liefert unter Adressen mit Schrägstrich am Ende aus, und genau
     die stehen auch in den Canonical-Angaben. Ohne den Schrägstrich meldete
     die Sitemap Adressen, die auf eine andere weiterleiten – Google führt das
     als „Seite mit Weiterleitung" und krault zweimal für nichts. */
  const mitSchraegstrich = (pfad: string) => (pfad === '/' ? '/' : `${pfad}/`);

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${mitSchraegstrich(route.path)}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${base}/leistungen/${service.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
