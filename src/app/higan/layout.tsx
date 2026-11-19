import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HIGAN',
  description: 'HIGAN, un flacon de parfum imaginé comme la métamorphose du lys araignée rouge : design, 3D et direction artistique.',
  openGraph: { title: 'HIGAN — Emmanuel Ijjou', description: 'HIGAN, un flacon de parfum imaginé comme la métamorphose du lys araignée rouge : design, 3D et direction artistique.', url: '/higan', images: [{ url: '/og/higan.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/higan.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
