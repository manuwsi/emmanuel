import type { Metadata } from 'next';

const description = 'Proxy, un concept d’application pour superviser un agent IA personnel : permissions, niveaux d’autonomie par domaine, validation, journal, pause de sécurité et gestion des erreurs.';

export const metadata: Metadata = {
  title: 'Proxy',
  description,
  openGraph: { title: 'Proxy — Emmanuel Ijjou', description, url: '/proxy', images: [{ url: '/og/proxy.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/proxy.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
