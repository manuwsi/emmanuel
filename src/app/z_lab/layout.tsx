import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Z_Lab',
  description: 'Refonte du site du studio d’architecture coréen Z_Lab : audit, direction créative et UI.',
  openGraph: { title: 'Z_Lab — Emmanuel Ijjou', description: 'Refonte du site du studio d’architecture coréen Z_Lab : audit, direction créative et UI.', url: '/z_lab', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
