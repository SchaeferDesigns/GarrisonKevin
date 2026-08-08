/**
 * Zwei Betriebsarten:
 *  - Standard: normaler Next.js-Server (inkl. Sicherheits-Header)
 *  - NEXT_OUTPUT=export: statischer Export für GitHub Pages o. ä.
 *
 * Der Unterpfad für GitHub Pages (z. B. /GarrisonKevin) kommt aus
 * NEXT_PUBLIC_BASE_PATH und wird auch von src/lib/assets.ts genutzt,
 * damit Hintergrundbilder in CSS denselben Pfad bekommen.
 */
const isExport = process.env.NEXT_OUTPUT === 'export';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  compress: true,

  // Erzeugt Verzeichnisse mit index.html – so liefert GitHub Pages die Unterseiten korrekt aus.
  trailingSlash: true,

  ...(isExport ? { output: 'export', images: { unoptimized: true } } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  // Header lassen sich nur mit laufendem Server setzen, nicht beim statischen Export.
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
