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

  /**
   * Nichts wird gesperrt.
   *
   * Datenschutz und Widerrufsbelehrung tragen ein noindex in ihren Metadaten.
   * Das wirkt aber nur, wenn die Seiten auch gelesen werden dürfen – eine
   * Sperre hier verhindert genau das, und die Adressen können trotzdem nackt
   * im Index landen.
   *
   * Impressum und AGB sind bewusst indexierbar: Google prüft daran, dass es
   * den Betrieb wirklich gibt. Sie auszusperren kostet Vertrauen.
   */
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${business.siteUrl}/sitemap.xml`,
    host: business.siteUrl,
  };
}
