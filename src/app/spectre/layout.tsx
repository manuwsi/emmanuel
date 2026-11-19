import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SPECTRE',
  description: 'SPECTRE, magazine éditorial généré par IA pour OKCC : séries vert et violet, mise en page.',
  openGraph: { title: 'SPECTRE — Emmanuel Ijjou', description: 'SPECTRE, magazine éditorial généré par IA pour OKCC : séries vert et violet, mise en page.', url: '/spectre', images: [{ url: '/og/spectre.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/spectre.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
