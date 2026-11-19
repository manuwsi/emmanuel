import type { Metadata } from 'next';

const description =
  'Élan, un concept d’application de fractionné pour montre connectée et iPhone : une information à la fois, lisible en une seconde.';

export const metadata: Metadata = {
  title: 'Élan — Concept montre et iOS',
  description,
  openGraph: { title: 'Élan — Emmanuel Ijjou', description, url: '/elan', images: [{ url: '/og/elan.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/elan.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
