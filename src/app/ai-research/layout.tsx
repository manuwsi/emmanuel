import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recherche visuelle IA',
  description: 'Recherche visuelle personnelle entre IA et 3D : matière, couleur, distorsion et mouvement.',
  openGraph: { title: 'Recherche visuelle IA — Emmanuel Ijjou', description: 'Recherche visuelle personnelle entre IA et 3D : matière, couleur, distorsion et mouvement.', url: '/ai-research', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
