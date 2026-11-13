import type { Metadata } from 'next';
import localFont from 'next/font/local';

const generalSans = localFont({
  src: [
    { path: '../../fonts/GeneralSans-Light.otf', weight: '300', style: 'normal' },
    { path: '../../fonts/GeneralSans-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../fonts/GeneralSans-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../fonts/GeneralSans-Semibold.otf', weight: '600', style: 'normal' },
  ],
  variable: '--font-general-sans',
  display: 'swap',
});

const description =
  'SOUTRAME.CYCLE — Cycle 01, Chimera School. A clothing brand built around the inner thread we all carry.';

export const metadata: Metadata = {
  title: { absolute: 'SOUTRAME.CYCLE — Cycle 01 · Chimera School' },
  description,
  openGraph: {
    title: 'SOUTRAME.CYCLE — Cycle 01 · Chimera School',
    description,
    url: '/soutrame',
    siteName: 'SOUTRAME.CYCLE',
    images: [{ url: '/soutrame/og.jpg', width: 1200, height: 630, alt: 'SOUTRAME.CYCLE — Chimera School' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOUTRAME.CYCLE — Cycle 01 · Chimera School',
    description,
    images: ['/soutrame/og.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={generalSans.variable}>{children}</div>;
}
