import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Anbieterkennzeichnung gemäß § 5 DDG.',
  alternates: { canonical: '/impressum' },
  /* Indexierbar: Google prüft am Impressum und an den AGB, dass es den
     Betrieb wirklich gibt. Sie auszusperren kostet Vertrauen. */
};

export default function ImpressumPage() {
  return <LegalPage slug="impressum" title="Impressum" lead="Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG)." variant={0} />;
}
