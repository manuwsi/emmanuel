import type { Metadata } from 'next';

const description =
  'Soutrame, le site e-commerce de ma marque de vêtements : photographie, direction artistique, parcours d’achat, motion et mise en ligne.';

export const metadata: Metadata = {
  title: 'Soutrame — E-commerce',
  description,
  openGraph: { title: 'Soutrame — Emmanuel Ijjou', description, url: '/soutrame-ecommerce', images: [{ url: '/og/soutrame-ecommerce.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/soutrame-ecommerce.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
