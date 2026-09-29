import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Emmanuel Ijjou, Product Designer à Paris formé chez OKCC : recherche utilisateur, UX et UI.',
  openGraph: { title: 'À propos — Emmanuel Ijjou', description: 'Emmanuel Ijjou, Product Designer à Paris formé chez OKCC : recherche utilisateur, UX et UI.', url: '/about', images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
