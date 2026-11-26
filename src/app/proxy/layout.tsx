import type { Metadata } from 'next';

const description = 'Proxy, un concept d’interface pour superviser un agent IA personnel : niveaux d’autonomie, validation, journal et arrêt de sécurité.';

export const metadata: Metadata = {
  title: 'Proxy',
  description,
  openGraph: { title: 'Proxy — Emmanuel Ijjou', description, url: '/proxy', images: [{ url: '/og/proxy.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/proxy.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
