import type { Metadata } from 'next';

const description =
  'Foil, un concept d’application iOS pour suivre une collection de cartes (Pokémon, One Piece, Yu-Gi-Oh!) avec ce qu’elle vaut et ce qu’on gagnerait à la revente.';

export const metadata: Metadata = {
  title: 'Foil — Concept iOS, collection de cartes',
  description,
  openGraph: { title: 'Foil — Emmanuel Ijjou', description, url: '/foil', images: [{ url: '/og/foil.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/foil.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
