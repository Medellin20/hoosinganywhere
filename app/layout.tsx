import type { Metadata, Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { getSiteUrl } from '@/lib/utils/site-url';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hoosing Anywhere — Location d’appartements en Espagne',
    template: '%s | Hoosing Anywhere',
  },
  description:
    'Hoosing Anywhere vous accompagne dans la recherche, la visite et la réservation d’appartements à louer à Madrid, Barcelone, Valence, Séville, Málaga et Alicante.',
  keywords: [
    'location appartement Espagne',
    'appartement Madrid',
    'location appartement Barcelone',
    'logement pour expatriés en Espagne',
    'Hoosing Anywhere',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Hoosing Anywhere',
    title: 'Hoosing Anywhere — Location d’appartements en Espagne',
    description:
      'Recherchez, visitez et réservez votre prochain logement en Espagne.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hoosing Anywhere — Location d’appartements en Espagne',
    description: 'Trouvez votre prochain logement en Espagne.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={openSans.variable}>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              fontFamily: 'var(--font-open-sans)',
            },
          }}
        />
      </body>
    </html>
  );
}
