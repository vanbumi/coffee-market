import { db } from './index';
import { products } from './schema';
import { products as existingProducts } from '@/data/products';

async function seed() {
  console.log('Seeding products...');
  for (const product of existingProducts) {
    await db.insert(products).values({
      name: product.name,
      origin: product.origin,
      region: product.region,
      type: product.type,
      price: product.price,
      images: JSON.stringify(product.images),
      description: product.description,
      tastingNotes: JSON.stringify(product.tastingNotes),
      processing: product.processing,
      rating: product.rating,
      featured: product.featured ? 1 : 0,
    });
  }
  console.log('Seeding complete!');
}

seed();
