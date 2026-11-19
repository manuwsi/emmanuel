import type { Metadata } from 'next';

const description = 'Dailies, un concept d’outil pour les studios qui produisent des vidéos en IA : versions, validation client et coût des rendus.';

export const metadata: Metadata = {
  title: 'Dailies',
  description,
  openGraph: { title: 'Dailies — Emmanuel Ijjou', description, url: '/dailies', images: [{ url: '/og/dailies.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/dailies.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
