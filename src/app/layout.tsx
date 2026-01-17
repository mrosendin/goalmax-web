import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Telofy — Turn Intention Into Execution',
  description:
    'The AI execution system that transforms your objectives into completed days. Define your goal. Let Telofy handle the execution.',
  keywords: ['productivity', 'goal tracking', 'AI', 'habits', 'execution', 'accountability'],
  metadataBase: new URL('https://telofy.ai'),
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Telofy',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'Telofy — Turn Intention Into Execution',
    description: 'The AI execution system that transforms your objectives into completed days. Define your goal. Let Telofy handle the execution.',
    type: 'website',
    siteName: 'Telofy',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Telofy - AI Execution System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telofy — Turn Intention Into Execution',
    description: 'The AI execution system that transforms your objectives into completed days.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#050506] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
