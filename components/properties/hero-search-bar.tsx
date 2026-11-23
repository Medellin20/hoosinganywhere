'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Wallet, BedDouble, Building2, SlidersHorizontal } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SPANISH_CITIES, PROPERTY_TYPES } from '@/lib/utils/constants';

export function HeroSearchBar() {
  const router = useRouter();
  const [city, setCity] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('');
  const [type, setType] = React.useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (type) params.set('type', type);
    router.push(`/appartements${params.toString() ? `?${params}` : ''}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-3xl border border-white bg-white p-4 text-left shadow-lifted sm:p-5"
    >
      <label htmlFor="hero-city" className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-900">
        <MapPin className="h-4 w-4 text-canal-600" aria-hidden="true" />
        Ville
          </label>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Select id="hero-city" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Toutes les villes</option>
          {SPANISH_CITIES.map((name) => <option key={name} value={name}>{name}</option>)}
        </Select>
        <Button type="submit" className="h-11">
          <Search className="h-4 w-4" aria-hidden="true" />
          Rechercher
        </Button>
      </div>

      <details className="mt-3 border-t border-ink-100 pt-3">
        <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded text-sm font-semibold text-ink-700 hover:text-canal-700 [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Plus de filtres
        </summary>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="hero-minPrice" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
              <Wallet className="h-3.5 w-3.5" /> Budget min.
          </label>
            <Select id="hero-minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
              <option value="">Aucun</option>
              {[500, 750, 1000, 1250, 1500, 2000].map((v) => (
                <option key={v} value={v}>
                  €{v}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="hero-maxPrice" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
              <Wallet className="h-3.5 w-3.5" /> Budget max.
          </label>
            <Select id="hero-maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="">Aucun</option>
              {[1000, 1500, 2000, 2500, 3000, 4000, 5000].map((v) => (
                <option key={v} value={v}>
                  €{v}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="hero-bedrooms" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
              <BedDouble className="h-3.5 w-3.5" /> Chambres
          </label>
            <Select id="hero-bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
              <option value="">Indifférent</option>
              {[1, 2, 3, 4].map((v) => (
                <option key={v} value={v}>
                  {v}+
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="hero-type" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
              <Building2 className="h-3.5 w-3.5" /> Type
          </label>
            <Select id="hero-type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Tous types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </details>
    </form>
  );
}
