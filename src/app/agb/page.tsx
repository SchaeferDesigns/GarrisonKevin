import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Allgemeine Geschäftsbedingungen für Bodenverlegung, Sockelleisten und Fugenarbeiten.',
  alternates: { canonical: '/agb' },
  /* Indexierbar: Google prüft am Impressum und an den AGB, dass es den
     Betrieb wirklich gibt. Sie auszusperren kostet Vertrauen. */
};

export default function AgbPage() {
  return <LegalPage slug="agb" title="AGB" lead="Allgemeine Geschäftsbedingungen für Aufträge und Ausführung." variant={2} />;
}
