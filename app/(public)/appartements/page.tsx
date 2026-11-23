import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';
import { PropertyGrid } from '@/components/properties/property-grid';
import { PropertyFilters } from '@/components/properties/property-filters';
import { Pagination } from '@/components/properties/pagination';
import { getAvailableCities, getAvailableCityCounts, getPublishedProperties } from '@/lib/data/properties';
import type { PropertyFilters as Filters } from '@/types';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Location d’appartements en Espagne',
  description:
    'Découvrez nos appartements à louer en Espagne. Filtrez les annonces par ville, budget et nombre de chambres.',
};

interface PageProps {
  searchParams: {
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    type?: string;
    sort?: string;
    page?: string;
  };
}

export default async function AppartementsPage({ searchParams }: PageProps) {
  if (!Object.values(searchParams).some(Boolean)) {
    const cities = await getAvailableCityCounts();
    return (
      <div className="container-app py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-display-sm font-extrabold text-ink-900 sm:text-display-md">Choisissez une ville en Espagne</h1>
          <p className="mt-2 max-w-2xl text-ink-500">À chaque envie, une destination</p>
        </div>
        {cities.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map(({ city, count }) => (
              <Link key={city} href={`/appartements?city=${encodeURIComponent(city)}`} className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-canal-300 hover:shadow-card">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-canal-50 text-canal-600"><MapPin className="h-6 w-6" /></span>
                <span className="min-w-0 flex-1"><span className="block text-lg font-bold text-ink-900">{city}</span><span className="text-sm text-ink-400">{count} séjour{count > 1 ? 's' : ''}</span></span>
                <ArrowRight className="h-5 w-5 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-canal-600" />
              </Link>
            ))}
          </div>
        ) : <p className="rounded-2xl bg-sand-100 p-6 text-ink-500">Le catalogue est en cours de préparation. Les premiers biens apparaîtront ici dès leur publication.</p>}
      </div>
    );
  }

  const requestedPage = searchParams.page === undefined ? 1 : Number(searchParams.page);
  const normalizedPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const filters: Filters = {
    city: searchParams.city,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    propertyType: searchParams.type,
    sort: (searchParams.sort as Filters['sort']) || 'recent',
    page: normalizedPage,
  };

  const [{ properties, total, page, pageSize }, cities] = await Promise.all([
    getPublishedProperties(filters),
    getAvailableCities(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (requestedPage !== normalizedPage || normalizedPage > totalPages) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') params.set(key, value);
    });

    const targetPage = requestedPage !== normalizedPage ? 1 : totalPages;
    if (targetPage > 1) params.set('page', String(targetPage));

    const query = params.toString();
    redirect(`/appartements${query ? `?${query}` : ''}`);
  }

  return (
    <div className="container-app py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-display-sm font-extrabold text-ink-900 sm:text-display-md">
          {filters.city ? `Découvrez nos logements disponibles à ${filters.city}` : 'Appartements en Espagne'}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Consultez les logements disponibles qui correspondent à votre recherche.
        </p>
      </div>

      <Link href="/appartements" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-canal-700 hover:underline">← Choisir une autre ville</Link>
      <PropertyFilters resultCount={total} cities={cities} />
      <PropertyGrid properties={properties} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/appartements"
        searchParams={searchParams}
      />
    </div>
  );
}
