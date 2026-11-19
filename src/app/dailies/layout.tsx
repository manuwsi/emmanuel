import type { Metadata } from 'next';

const description = 'Dailies, un concept d’outil pour les studios qui produisent des vidéos en IA : versions, validation client et coût des rendus.';

export const metadata: Metadata = {
  title: 'Dailies',
  description,
  openGraph: { title: 'Dailies — Emmanuel Ijjou', description, url: '/dailies', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
