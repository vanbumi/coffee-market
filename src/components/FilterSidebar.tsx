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
    <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gold mb-2 tracking-wide">
          Cari Produk
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama atau asal..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#A3A3A3] text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-[#A3A3A3]"
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
        <label className="block text-sm font-semibold text-gold mb-2 tracking-wide">
          Urutkan
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
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
        <label className="block text-sm font-semibold text-gold mb-2 tracking-wide">
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
              />
              <span className="text-sm text-[#A3A3A3] group-hover:text-gold transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Region Filter */}
      <div>
        <label className="block text-sm font-semibold text-gold mb-2 tracking-wide">
          Asal Daerah
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {regions.map((region) => (
            <label
              key={region}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => onRegionToggle(region)}
              />
              <span className="text-sm text-[#A3A3A3] group-hover:text-gold transition-colors">
                {region}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gold mb-2 tracking-wide">
          Rentang Harga
        </label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#A3A3A3]">Min</span>
              <span className="text-gold">Rp {minPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={400000}
              step={10000}
              value={minPrice}
              onChange={(e) => onMinPriceChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#A3A3A3]">Max</span>
              <span className="text-gold">Rp {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={400000}
              step={10000}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-2.5 bg-[#1A1A1A] hover:bg-gold hover:text-black text-gold border border-gold/30 rounded-lg transition-all duration-300 text-sm font-medium"
      >
        Reset Filter
      </button>
    </div>
  );
}
