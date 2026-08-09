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
    { path: '/preise', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/kontakt', priority: 0.85, changeFrequency: 'yearly' },
    { path: '/ablauf', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/einsatzgebiet', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/ueber-mich', priority: 0.65, changeFrequency: 'yearly' },
    { path: '/faq', priority: 0.65, changeFrequency: 'monthly' },
    { path: '/ratgeber', priority: 0.6, changeFrequency: 'monthly' },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${base}/leistungen/${service.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
