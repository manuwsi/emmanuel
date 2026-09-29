import '../styles/globals.css';
import Cursor from '@/components/Cursor';
import { LangProvider } from '@/components/i18n';

export const metadata = {
  title: 'Emmanuel Ijjou — Product Designer',
  description: 'Portfolio d’Emmanuel Ijjou, Product Designer à Paris : UI, direction artistique et IA.',
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
