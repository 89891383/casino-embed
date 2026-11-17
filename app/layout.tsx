import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Casino Hub',
  description: 'Najlepsze kasyna online - porównanie bonusów i ofert',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}