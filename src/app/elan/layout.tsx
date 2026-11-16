import type { Metadata } from 'next';

const description =
  'Élan, un concept d’application de fractionné pour montre connectée et iPhone : une information à la fois, lisible en une seconde.';

export const metadata: Metadata = {
  title: 'Élan — Concept montre et iOS',
  description,
  openGraph: { title: 'Élan — Emmanuel Ijjou', description, url: '/elan', images: [{ url: '/elan/cover.jpg', width: 1667, height: 1250 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
