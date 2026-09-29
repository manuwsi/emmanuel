import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post Archive Faction',
  description: 'Un musée digital en hommage à la marque Post Archive Faction : UI, motion et éditorial.',
  openGraph: { title: 'Post Archive Faction — Emmanuel Ijjou', description: 'Un musée digital en hommage à la marque Post Archive Faction : UI, motion et éditorial.', url: '/post-archive-faction', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
