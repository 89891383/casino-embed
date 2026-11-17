import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['500', '600', '700', '800', '900'],
});

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
    <html lang="pl" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="font-sans bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}