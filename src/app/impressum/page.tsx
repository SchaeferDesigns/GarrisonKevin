import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Anbieterkennzeichnung gemäß § 5 DDG.',
  alternates: { canonical: '/impressum' },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return <LegalPage slug="impressum" title="Impressum" lead="Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG)." variant={0} />;
}
