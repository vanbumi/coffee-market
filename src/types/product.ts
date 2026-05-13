export type CoffeeType = 'Arabica' | 'Robusta' | 'Blend';
export type ProcessingMethod = 'natural' | 'washed' | 'honey' | 'semi-washed' | 'full washed' | 'wet-hulled' | 'washed/dry';
export type RoastLevel = 'light' | 'medium' | 'dark';
export type TastingNote = 'fruity' | 'nutty' | 'chocolate' | 'floral' | 'spicy' | 'earthy' | 'herbal' | 'sweet' | 'caramel' | 'berry' | 'winey' | 'lemon' | 'bright' | 'syrupy' | 'woody' | 'peanut' | 'spice';

export interface Product {
  id: string;
  name: string;
  origin: string;
  region: string;
  type: CoffeeType;
  price: number; // price per kg in IDR
  rating: number;
  images: string[];
  description: string;
  altitude: string; // e.g. "1.200-1.600 masl"
  processing: ProcessingMethod;
  roastLevel: RoastLevel;
  tastingNotes: TastingNote[];
  stock: number;
  featured: boolean;
}

export interface CatalogFilters {
  search: string;
  types: CoffeeType[];
  regions: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating';
}
