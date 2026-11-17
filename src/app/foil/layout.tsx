import type { Metadata } from 'next';

const description =
  'Foil, un concept d’application iOS pour suivre une collection de cartes (Pokémon, One Piece, Yu-Gi-Oh!) avec sa valeur de marché et son gain réel à la revente.';

export const metadata: Metadata = {
  title: 'Foil — Concept iOS, collection de cartes',
  description,
  openGraph: { title: 'Foil — Emmanuel Ijjou', description, url: '/foil', images: [{ url: '/foil/cover.jpg', width: 1667, height: 1250 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
