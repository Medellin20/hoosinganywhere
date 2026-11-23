import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, ShieldCheck, KeyRound, CalendarCheck, Building2, MapPin, Quote, Star } from 'lucide-react';
import { HeroSearchBar } from '@/components/properties/hero-search-bar';
import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { FeaturedProperties } from '@/components/properties/featured-properties';
import { getCityPropertySummaries, getFeaturedProperties } from '@/lib/data/properties';
import { formatPrice } from '@/lib/utils/format';
import { SPANISH_CITIES } from '@/lib/utils/constants';
import { TESTIMONIALS } from '@/lib/data/testimonials';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Hoosing Anywhere — Location d’appartements en Espagne',
  description:
    'Trouvez votre prochain logement en Espagne. Hoosing Anywhere facilite la recherche, la visite et la réservation d’appartements à Madrid, Barcelone, Valence et ailleurs.',
};

const STEPS = [
  {
    icon: Building2,
    title: 'Découvrez nos propriétés',
    description: 'Choisissez votre type de logement, puis filtrez par destination, budget et capacité.',
  },
  {
    icon: CalendarCheck,
    title: 'Réservez une visite',
    description: 'Choisissez une date et un créneau, puis envoyez gratuitement votre demande à l’agence.',
  },
  {
    icon: ShieldCheck,
    title: 'Envoyez votre réservation',
    description: 'Transmettez votre projet de location ; notre équipe examine ensuite votre dossier.',
  },
  {
    icon: KeyRound,
    title: 'Emménagez',
    description: 'Votre dossier validé, récupérez les clés de votre nouveau logement.',
  },
];

export default async function HomePage() {
  const [citySummaries, featuredProperties] = await Promise.all([
    getCityPropertySummaries(),
    getFeaturedProperties(3),
  ]);

  const summariesByCity = new Map(citySummaries.map((summary) => [summary.city, summary]));
  const destinations = [
    ...SPANISH_CITIES.map((city) => ({
      city,
      summary: summariesByCity.get(city),
      imageUrl: `/cities/${city.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')}.webp`,
    })),
    ...citySummaries
      .filter((summary) => !SPANISH_CITIES.some((city) => city === summary.city))
      .map((summary) => ({ city: summary.city, summary, imageUrl: summary.imageUrl })),
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-orange">
        <div className="container-app grid max-w-6xl items-center gap-7 pb-14 pt-10 sm:gap-10 sm:pb-20 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-20">
          <div>
            <h1 className="max-w-xl text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.065em] text-white">
              Trouvez votre prochain logement en Espagne
            </h1>
            <p className="mt-5 max-w-md text-base font-semibold text-ink-950 sm:text-lg">
              Louez un appartement dans la ville qui vous convient.
            </p>
          </div>
          <HeroSearchBar />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-5 bg-white [clip-path:polygon(0_100%,100%_0,100%_100%)] sm:h-9" />
      </section>

      <section className="bg-white pb-12 pt-7 sm:pb-16 sm:pt-9" aria-labelledby="popular-cities">
        <div className="container-app max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="popular-cities" className="text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
              Découvrez les villes les plus recherchées
            </h2>
            <Link href="/appartements" className="inline-flex items-center gap-2 text-sm font-bold text-canal-700 hover:underline">
              Tous les appartements <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 sm:mt-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7">
            {destinations.map(({ city, summary, imageUrl }) => (
              <Link
                key={city}
                href={`/appartements?city=${encodeURIComponent(city)}`}
                className="group block min-w-0 rounded-xl"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-canal-50 sm:aspect-[2/1]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 639px) 50vw, (max-width: 1152px) 33vw, 350px"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-canal-600"><MapPin className="h-7 w-7" aria-hidden="true" /></span>
                  )}
                </div>
                <h3 className="mt-2 break-words font-extrabold text-ink-950 group-hover:text-canal-700">{city}</h3>
                <p className="mt-0.5 text-xs font-medium text-ink-600 sm:text-sm">
                  {summary
                    ? `${summary.count} appartement${summary.count === 1 ? '' : 's'} · En moyenne ${formatPrice(summary.averagePrice)} / mois`
                    : 'Voir les annonces'}
                </p>
              </Link>
            ))}
          </div>
          <Link href="/mentions-legales#fotocredits" className="mt-5 inline-block text-xs text-ink-600 underline underline-offset-4">
            Crédits photos
          </Link>
        </div>
      </section>

      <FeaturedProperties properties={featuredProperties} />

      <div className="container-app">
        <div className="canal-divider" />
      </div>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 sm:py-20">
        <div className="container-app">
          <FadeIn>
            <SectionHeading
              eyebrow="Processus"
              title="Comment ça marche"
              description="De la recherche à l’emménagement, un parcours pensé pour vous simplifier la vie."
              align="center"
              className="mx-auto"
            />
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08} className="h-full">
                <div className="relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
                  <span className="text-eyebrow text-ink-300">Étape {i + 1}</span>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-canal-50 text-canal-700">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink-900">{step.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="mt-10 text-center">
            <Link href="/comment-ca-marche">
              <Button variant="ghost">
                En savoir plus sur notre processus
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-sand-100/60 py-16 sm:py-20">
        <div className="container-app">
          <FadeIn>
            <SectionHeading title="Témoignages de clients" />
          </FadeIn>
          <div className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:thin]">
            {TESTIMONIALS.map((testimonial, index) => (
              <article
                key={index}
                className="flex min-h-64 w-[85vw] max-w-sm shrink-0 snap-start flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:w-80"
              >
                <div className="flex items-center justify-between gap-3">
                  <Quote className="h-7 w-7 text-canal-600" aria-hidden="true" />
                  <div className="flex gap-0.5 text-amber-400" aria-label="5 étoiles sur 5">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                </div>
                <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-ink-600">
                  “{testimonial.quote}”
                </blockquote>
                <p className="mt-5 border-t border-ink-100 pt-4 text-xs font-semibold tracking-wide text-ink-400">
                  {testimonial.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pb-20">
        <div className="container-app">
          <FadeIn>
            <div className="overflow-hidden rounded-3xl bg-ink-700 px-6 py-14 text-center sm:px-16">
              <h2 className="text-display-sm font-extrabold text-white sm:text-display-md">
                Prêt à découvrir votre prochaine destination ?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sand-200">
                Parcourez nos annonces vérifiées et réservez une visite en quelques minutes.
              </p>
              <Link href="/appartements" className="mt-7 inline-block">
                <Button size="lg">
                  Voir les biens disponibles
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
