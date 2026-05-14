import { Product } from '@/types/product';
import { products as staticProducts } from '@/data/products';
import fs from 'fs';
import path from 'path';

const DYNAMIC_PRODUCTS_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');

/**
 * Membaca produk dinamis dari file products.json
 * Produk yang ditambahkan via admin dashboard
 */
function getDynamicProducts(): Product[] {
  try {
    if (!fs.existsSync(DYNAMIC_PRODUCTS_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DYNAMIC_PRODUCTS_PATH, 'utf-8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('Gagal membaca products.json:', error);
    return [];
  }
}

/**
 * Menulis produk dinamis ke file products.json
 */
export function saveDynamicProducts(products: Product[]): void {
  try {
    const dir = path.dirname(DYNAMIC_PRODUCTS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DYNAMIC_PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Gagal menyimpan products.json:', error);
    throw new Error('Gagal menyimpan produk');
  }
}

/**
 * Mendapatkan semua produk (statis + dinamis)
 */
export function getAllProducts(): Product[] {
  const dynamic = getDynamicProducts();
  return [...staticProducts, ...dynamic];
}

/**
 * Mendapatkan produk berdasarkan ID (dari semua sumber)
 */
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

/**
 * Mendapatkan produk dinamis saja (yang ditambahkan via admin)
 */
export { getDynamicProducts };
