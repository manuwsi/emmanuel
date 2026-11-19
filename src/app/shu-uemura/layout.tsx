import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shu Uemura AI:tutor',
  description: 'Un coach beauté IA personnel pour Shu Uemura : parcours mobile, analyse faciale et tutoriels pas-à-pas.',
  openGraph: { title: 'Shu Uemura AI:tutor — Emmanuel Ijjou', description: 'Un coach beauté IA personnel pour Shu Uemura : parcours mobile, analyse faciale et tutoriels pas-à-pas.', url: '/shu-uemura', images: [{ url: '/og/shu-uemura.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/shu-uemura.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
