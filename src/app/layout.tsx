import '../styles/globals.css';

export const metadata = {
  title: 'Portfolio Emmanuel',
  description: 'Creative Developer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* IvyOra */}
        <link rel="stylesheet" href="https://use.typekit.net/cgb0rtc.css" />
      </head>
      <body
        className="bg-[#0a0a0a] text-white font-sans"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
