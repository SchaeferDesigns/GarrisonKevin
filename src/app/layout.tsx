import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileContactBar from '@/components/MobileContactBar';
import JsonLd from '@/components/JsonLd';
import { business } from '@/lib/business';
import { localBusinessSchema, websiteSchema } from '@/lib/schema';

/* Schriften werden von Next.js beim Build heruntergeladen und selbst ausgeliefert.
   Dadurch entsteht zur Laufzeit keine Verbindung zu Google-Servern (DSGVO). */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['SOFT', 'WONK'],
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'Handwerk',
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: '#1d3a2e',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="inhalt">{children}</main>
        <SiteFooter />
        <MobileContactBar />
        <JsonLd data={[localBusinessSchema, websiteSchema]} />
      </body>
    </html>
  );
}
