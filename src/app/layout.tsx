import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import Cursor from '@/components/Cursor';
import Transitions from '@/components/dot/Transitions';
import SmoothScroll from '@/components/dot/SmoothScroll';
import CaseRail from '@/components/dot/CaseRail';
import { LangProvider } from '@/components/i18n';

const generalSans = localFont({
  src: [
    { path: '../fonts/GeneralSans-Light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/GeneralSans-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/GeneralSans-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/GeneralSans-Semibold.otf', weight: '600', style: 'normal' },
    { path: '../fonts/GeneralSans-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-general-sans',
  display: 'swap',
});

const ade = localFont({
  src: [{ path: '../fonts/Ade-Display.otf', weight: '400', style: 'normal' }],
  variable: '--font-ade',
  display: 'swap',
});

const description =
  'Portfolio d’Emmanuel Ijjou, Product Designer à Paris : recherche utilisateur, UX et UI pour le luxe, la beauté et la tech.';

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
    images: [{ url: '/og/site.jpg', width: 1200, height: 630, alt: 'Emmanuel Ijjou — Product Designer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Ijjou — Product Designer',
    description,
    images: ['/og/site.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${generalSans.variable} ${ade.variable}`} suppressHydrationWarning>
      <head>
        {/* first visit of the session opens on the ink slate (see Transitions) */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var p=location.pathname,h=location.hostname;if(!/soutrame\\./.test(h)&&!(p.indexOf('/soutrame')===0&&p.indexOf('/soutrame-')!==0)&&!sessionStorage.getItem('dot-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='1'}catch(e){}",
          }}
        />
      </head>
      <body
        className="bg-white text-[#0a0a0a] font-sans antialiased"
        suppressHydrationWarning={true}
      >
        <LangProvider>
          <SmoothScroll />
          <Cursor />
          {children}
          <CaseRail />
          <Transitions />
        </LangProvider>
      </body>
    </html>
  );
}
