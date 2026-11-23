import { BrandLogo } from '@/components/shared/brand-logo';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { getSiteSettings } from '@/lib/data/site-settings';

const COLUMN_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/appartements', label: 'Nos biens' },
  { href: '/comment-ca-marche', label: 'Comment ça marche' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

const LEGAL_LINKS = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/conditions-generales', label: 'Conditions générales' },
];

export async function Footer() {
  const [year, settings] = await Promise.all([
    Promise.resolve(new Date().getFullYear()),
    getSiteSettings(),
  ]);

  return (
    <footer className="border-t border-ink-200 bg-[#E3EBEF] text-ink-950">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo className="w-44" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-800">
            Votre agence de location d’appartements en Espagne, de la recherche à l’emménagement.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/5 text-ink-950 transition-colors hover:bg-ink-950/10"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/5 text-ink-950 transition-colors hover:bg-ink-950/10"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/5 text-ink-950 transition-colors hover:bg-ink-950/10"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-eyebrow uppercase text-ink-700">Navigation</h3>
          <ul className="mt-4 space-y-2.5">
            {COLUMN_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ink-800 transition-colors hover:text-ink-950 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-eyebrow uppercase text-ink-700">Informations légales</h3>
          <ul className="mt-4 space-y-2.5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ink-800 transition-colors hover:text-ink-950 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-eyebrow uppercase text-ink-700">Contact</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="mailto:contacts@realestatenl.agency"
                className="flex min-w-0 items-center gap-2.5 break-all text-sm text-ink-800 transition-colors hover:text-ink-950 hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" />
                contacts@realestatenl.agency
              </a>
            </li>
            <li>
              <a
                href={`tel:${settings.footer_phone.replace(/[^\d+]/g, '')}`}
                className="flex min-w-0 items-center gap-2.5 break-all text-sm text-ink-800 transition-colors hover:text-ink-950 hover:underline"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {settings.footer_phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-200">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-700 sm:flex-row">
          <p>© {year} Hoosing Anywhere. Tous droits réservés.</p>
          <p>Location d’appartements en Espagne</p>
        </div>
      </div>
    </footer>
  );
}
