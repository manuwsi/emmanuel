import type { Metadata } from 'next';

const description = 'Colosse, le poste de pilotage d’un tunnelier sous Paris, dessiné comme un plan d’ingénieur vivant.';

export const metadata: Metadata = {
  title: 'Colosse',
  description,
  openGraph: { title: 'Colosse — Emmanuel Ijjou', description, url: '/colosse', images: [{ url: '/og/colosse.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/colosse.jpg'] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
