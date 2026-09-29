import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pleated Assortment',
  description: 'Une collection de mobilier inspirée du plissé d’Issey Miyake et sa boutique e-commerce.',
  openGraph: { title: 'Pleated Assortment — Emmanuel Ijjou', description: 'Une collection de mobilier inspirée du plissé d’Issey Miyake et sa boutique e-commerce.', url: '/pleated', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
