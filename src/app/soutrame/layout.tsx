import type { Metadata } from 'next';

const description =
  'Soutrame, une marque de vêtements conçue et développée de bout en bout : identité, pièces, production et lancement du premier drop.';

export const metadata: Metadata = {
  title: 'Soutrame',
  description,
  openGraph: { title: 'Soutrame — Emmanuel Ijjou', description, url: '/soutrame', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
