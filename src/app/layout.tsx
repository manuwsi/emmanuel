import type { Metadata } from 'next';
import '../styles/globals.css';
import Cursor from '@/components/Cursor';
import { LangProvider } from '@/components/i18n';

const description =
  'Portfolio d’Emmanuel Ijjou, Product Designer à Paris : UI, direction artistique et IA pour le luxe, la beauté et la tech.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ijjouemmanuel.com'),
  title: {
    default: 'Emmanuel Ijjou — Product Designer',
    template: '%s — Emmanuel Ijjou',
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'Emmanuel Ijjou',
    title: 'Emmanuel Ijjou — Product Designer',
    description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Emmanuel Ijjou — Product Designer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Ijjou — Product Designer',
    description,
    images: ['/og.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* IvyOra */}
        <link rel="stylesheet" href="https://use.typekit.net/cgb0rtc.css" />
      </head>
      <body
        className="bg-[#0a0a0a] text-white font-sans"
        suppressHydrationWarning={true}
      >
        <LangProvider>
          <Cursor />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
