import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileContactBar from '@/components/MobileContactBar';
import JsonLd from '@/components/JsonLd';
import PageTransition from '@/components/PageTransition';
import ScrollReset from '@/components/ScrollReset';
import { business } from '@/lib/business';
import { cssUrl, noIndex } from '@/lib/assets';
import { localBusinessSchema, websiteSchema } from '@/lib/schema';

/* Schriften werden von Next.js beim Build heruntergeladen und selbst ausgeliefert.
   Dadurch entsteht zur Laufzeit keine Verbindung zu Google-Servern (DSGVO). */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

/**
 * Überschriftenschrift, ausgewählt nach dem Logo des Betreibers: eine
 * Renaissance-Antiqua mit hohem Strichkontrast und feinen, spitzen Serifen.
 * Fraunces stand hier vorher – sie ist weicher und runder gezeichnet und lag
 * neben der Wortmarke sichtbar daneben.
 *
 * Cormorant zeichnet dünn, deshalb 600 statt der üblichen 400.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} – Bodenverlegung, Sockelleisten & Fugen in Aalen`,
    template: `%s | ${business.name} – ${business.tagline}`,
  },
  description: business.shortDescription,
  applicationName: `${business.name} – ${business.tagline}`,
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  keywords: [
    'Bodenleger Aalen',
    'Laminat verlegen Aalen',
    'Vinyl verlegen Aalen',
    'Sockelleisten montieren',
    'Silikonfugen erneuern',
    'Bodenverlegung Ostalbkreis',
    'Klickboden verlegen',
    'Bodenleger Hüttlingen',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: '/',
    siteName: `${business.name} – ${business.tagline}`,
    title: `${business.name} – Bodenverlegung, Sockelleisten & Fugen in Aalen`,
    description: business.shortDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${business.name} – Bodenverlegung, Sockelleisten und Fugenarbeiten in Aalen und Umgebung`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${business.name} – Bodenverlegung & Fugen in Aalen`,
    description: business.shortDescription,
    images: ['/og-image.jpg'],
  },
  robots: noIndex
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
      },
  category: 'Handwerk',
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: '#15422f',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  /* Die Seite reicht bis unter die Systemleisten. Dadurch bleibt die
     Gestenleiste am unteren Bildschirmrand durchsichtig und zeigt den
     Seiteninhalt, statt einen eigenen Farbstreifen zu setzen. Die
     Sicherheitsabstände holt das CSS über env(safe-area-inset-*) zurück. */
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${cormorant.variable}`}
      /* Hintergrundbilder als Variablen, damit sie auch unter einem Unterpfad geladen werden. */
      style={
        {
          '--img-wood-hero': cssUrl('/media/wood-hero.jpg'),
          '--img-wood-detail': cssUrl('/media/wood-detail.jpg'),
          '--img-wood-dark': cssUrl('/media/wood-dark.jpg'),
        } as React.CSSProperties
      }
    >
      <body>
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>
        <ScrollReset />
        <SiteHeader />
        <main id="inhalt">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <MobileContactBar />
        <JsonLd data={[localBusinessSchema, websiteSchema]} />
      </body>
    </html>
  );
}
