import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shu Uemura AI:tutor',
  description: 'Un coach beauté IA personnel pour Shu Uemura : parcours mobile, analyse faciale et tutoriels pas-à-pas.',
  openGraph: { title: 'Shu Uemura AI:tutor — Emmanuel Ijjou', description: 'Un coach beauté IA personnel pour Shu Uemura : parcours mobile, analyse faciale et tutoriels pas-à-pas.', url: '/shu-uemura', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
