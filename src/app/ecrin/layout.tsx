import type { Metadata } from 'next';

const description =
  'Écrin, un concept d’application iOS pour suivre une collection de cartes (Pokémon, One Piece, Yu-Gi-Oh!) avec sa valeur de marché et son gain réel à la revente.';

export const metadata: Metadata = {
  title: 'Écrin — Concept iOS, collection de cartes',
  description,
  openGraph: { title: 'Écrin — Emmanuel Ijjou', description, url: '/ecrin', images: [{ url: '/ecrin/cover.jpg', width: 1667, height: 1250 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
