import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SPECTRE',
  description: 'SPECTRE, magazine éditorial généré par IA pour OKCC : séries vert et violet, mise en page.',
  openGraph: { title: 'SPECTRE — Emmanuel Ijjou', description: 'SPECTRE, magazine éditorial généré par IA pour OKCC : séries vert et violet, mise en page.', url: '/spectre', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
