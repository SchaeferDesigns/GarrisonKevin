import type { MetadataRoute } from 'next';
import { business } from '@/lib/business';
import { noIndex } from '@/lib/assets';

// Beim statischen Export als Datei erzeugen.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // Auf einer reinen Testdomain wird die Seite nicht indexiert,
  // damit sie der späteren echten Domain keine Konkurrenz macht.
  if (noIndex) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/impressum', '/datenschutz'],
      },
    ],
    sitemap: `${business.siteUrl}/sitemap.xml`,
    host: business.siteUrl,
  };
}
