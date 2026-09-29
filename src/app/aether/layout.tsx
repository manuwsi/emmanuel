import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aether',
  description: 'Aether, un design system pour générer les 22 arcanes d’un jeu de tarot, entre IA et retouche.',
  openGraph: { title: 'Aether — Emmanuel Ijjou', description: 'Aether, un design system pour générer les 22 arcanes d’un jeu de tarot, entre IA et retouche.', url: '/aether', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
