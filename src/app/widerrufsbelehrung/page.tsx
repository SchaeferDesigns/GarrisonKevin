import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Widerrufsbelehrung',
  description: 'Widerrufsrecht für Verbraucher bei außerhalb von Geschäftsräumen geschlossenen Verträgen.',
  alternates: { canonical: '/widerrufsbelehrung' },
  robots: { index: false, follow: true },
};

export default function WiderrufsbelehrungPage() {
  return <LegalPage slug="widerrufsbelehrung" title="Widerrufsbelehrung" lead="Ihr Widerrufsrecht als Verbraucher und wie Sie es ausüben." variant={3} />;
}
