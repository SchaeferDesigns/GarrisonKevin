import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Allgemeine Geschäftsbedingungen für Bodenverlegung, Sockelleisten und Fugenarbeiten.',
  alternates: { canonical: '/agb' },
  robots: { index: false, follow: true },
};

export default function AgbPage() {
  return <LegalPage slug="agb" title="AGB" lead="Allgemeine Geschäftsbedingungen für Aufträge und Ausführung." variant={2} />;
}
