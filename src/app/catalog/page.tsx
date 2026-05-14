'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { CoffeeType } from '@/types/product';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';

const ITEMS_PER_PAGE = 8;

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as CoffeeType | null;

  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<CoffeeType[]>(
    initialType ? [initialType] : []
  );
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(400000);
  const [sortBy, setSortBy] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.includes(p.type));
    }

    // Region filter
    if (selectedRegions.length > 0) {
      result = result.filter((p) => selectedRegions.includes(p.origin));
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [search, selectedTypes, selectedRegions, minPrice, maxPrice, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleTypeToggle = (type: CoffeeType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleReset = () => {
    setSearch('');
    setSelectedTypes([]);
    setSelectedRegions([]);
    setMinPrice(0);
    setMaxPrice(400000);
    setSortBy('');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Katalog Produk
        </h1>
        <p className="text-gray-500">
          Menampilkan {filteredProducts.length} produk biji kopi premium
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <FilterSidebar
              search={search}
              selectedTypes={selectedTypes}
              selectedRegions={selectedRegions}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortBy={sortBy}
              onSearchChange={(v) => {
                setSearch(v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onTypeToggle={handleTypeToggle}
              onRegionToggle={handleRegionToggle}
              onMinPriceChange={(v) => {
                setMinPrice(v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onMaxPriceChange={(v) => {
                setMaxPrice(v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onSortChange={(v) => {
                setSortBy(v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {visibleProducts.length > 0 && (
            <div className="mb-4 text-sm text-gray-500">
              Menampilkan {visibleProducts.length} dari {filteredProducts.length} produk
            </div>
          )}
          <ProductGrid products={visibleProducts} />
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="px-8 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold shadow-sm hover:shadow-md"
              >
                Tampilkan Lebih Banyak
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Katalog Produk
        </h1>
        <p className="text-gray-500">Memuat katalog...</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-16 bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                <div className="h-5 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogContent />
    </Suspense>
  );
}
