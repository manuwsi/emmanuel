import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serena',
  description: 'Serena, un assistant IA pour l’administratif agricole : recherche terrain, itérations et UI desktop & mobile.',
  openGraph: { title: 'Serena — Emmanuel Ijjou', description: 'Serena, un assistant IA pour l’administratif agricole : recherche terrain, itérations et UI desktop & mobile.', url: '/serena', images: [{ url: '/og/serena.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/serena.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
