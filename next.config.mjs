import { seite } from './site.config.mjs';

/**
 * Alle Schalter für den Betrieb stehen in site.config.mjs – das ist die
 * einzige Datei, die der Betreiber anfassen muss.
 *
 * Umgebungsvariablen haben trotzdem Vorrang, damit der Workflow für die
 * Testumgebung auf GitHub Pages seine eigenen Werte setzen kann, ohne dass
 * dafür eine Datei im Projekt geändert werden müsste.
 */
const domain = (process.env.NEXT_PUBLIC_SITE_URL || seite.domain || '').trim().replace(/\/+$/, '');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? seite.unterordner ?? '').replace(/\/+$/, '');
const isExport = process.env.NEXT_OUTPUT ? process.env.NEXT_OUTPUT === 'export' : seite.statischeDateien;

/* Ohne eingetragene Domain bleibt die Seite eine Testfassung und wird für
   Suchmaschinen gesperrt. Sonst steht eine halbfertige Adresse im Index, und
   die wieder herauszubekommen dauert Wochen. */
const noIndex = process.env.NEXT_PUBLIC_NOINDEX === 'true' || !domain;

if (!domain) {
  console.warn(
    '\n  Hinweis: In site.config.mjs ist keine Domain eingetragen.\n' +
      '  Die Seite wird deshalb gebaut, ohne dass Suchmaschinen sie aufnehmen dürfen.\n',
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  compress: true,

  // Erzeugt Verzeichnisse mit index.html – so liefert jeder Webserver die
  // Unterseiten korrekt aus, ohne dass Umschreibungsregeln nötig wären.
  trailingSlash: true,

  // Die Werte aus site.config.mjs erreichen den Anwendungscode über dieselben
  // Variablennamen wie bisher. Deshalb muss dort nichts angepasst werden.
  env: {
    NEXT_PUBLIC_SITE_URL: domain,
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_NOINDEX: noIndex ? 'true' : '',
  },

  ...(isExport ? { output: 'export', images: { unoptimized: true } } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  // Header lassen sich nur mit laufendem Server setzen, nicht bei reinen Dateien.
  ...(isExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
