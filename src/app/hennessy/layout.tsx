import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hennessy X.O Second Skin',
  description: 'Visuels 3D et UI de la tablette de personnalisation pour l’édition Second Skin de Hennessy X.O.',
  openGraph: { title: 'Hennessy X.O Second Skin — Emmanuel Ijjou', description: 'Visuels 3D et UI de la tablette de personnalisation pour l’édition Second Skin de Hennessy X.O.', url: '/hennessy', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
