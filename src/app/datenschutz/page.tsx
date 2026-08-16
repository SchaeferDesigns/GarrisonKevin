import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung gemäß DSGVO.',
  alternates: { canonical: '/datenschutz' },
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return <LegalPage slug="datenschutz" title="Datenschutz" lead="Wie diese Website mit Ihren Daten umgeht – nach DSGVO." variant={1} />;
}
