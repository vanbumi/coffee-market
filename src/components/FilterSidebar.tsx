'use client';

import { CoffeeType } from '@/types/product';
import { coffeeTypes, regions } from '@/data/products';

interface FilterSidebarProps {
  search: string;
  selectedTypes: CoffeeType[];
  selectedRegions: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onTypeToggle: (type: CoffeeType) => void;
  onRegionToggle: (region: string) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  search,
  selectedTypes,
  selectedRegions,
  minPrice,
  maxPrice,
  sortBy,
  onSearchChange,
  onTypeToggle,
  onRegionToggle,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cari Produk
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama atau asal..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent text-sm"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Urutkan
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent text-sm bg-white"
        >
          <option value="">Default</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="name-asc">Nama A-Z</option>
          <option value="name-desc">Nama Z-A</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipe Kopi
        </label>
        <div className="space-y-2">
          {coffeeTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeToggle(type)}
                className="w-4 h-4 text-[#6F4E37] border-gray-300 rounded focus:ring-[#6F4E37]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Region Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Asal Daerah
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {regions.map((region) => (
            <label
              key={region}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => onRegionToggle(region)}
                className="w-4 h-4 text-[#6F4E37] border-gray-300 rounded focus:ring-[#6F4E37]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {region}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Rentang Harga
        </label>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Min: Rp {minPrice.toLocaleString()}</label>
            <input
              type="range"
              min={0}
              max={400000}
              step={10000}
              value={minPrice}
              onChange={(e) => onMinPriceChange(Number(e.target.value))}
              className="w-full accent-[#6F4E37]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Max: Rp {maxPrice.toLocaleString()}</label>
            <input
              type="range"
              min={0}
              max={400000}
              step={10000}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full accent-[#6F4E37]"
            />
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
      >
        Reset Filter
      </button>
    </div>
  );
}
