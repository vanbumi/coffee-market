import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  origin: text('origin').notNull(),
  region: text('region'),
  type: text('type').notNull(),
  price: integer('price').notNull(),
  images: text('images'), // JSON string array
  description: text('description'),
  tastingNotes: text('tasting_notes'),
  processing: text('processing'),
  rating: real('rating').default(0),
  featured: integer('featured').default(0),
  inStock: integer('in_stock').default(1),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').unique().notNull(),
  customerId: integer('customer_id'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  totalAmount: integer('total_amount').notNull(),
  shippingCost: integer('shipping_cost').notNull(),
  discount: integer('discount').default(0),
  status: text('status').default('pending'),
  paymentMethod: text('payment_method'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export const faqAiUsage = sqliteTable('faq_ai_usage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ip: text('ip').notNull(),
  date: text('date').notNull(), // format: YYYY-MM-DD
  count: integer('count').notNull().default(0),
  lastUsedAt: text('last_used_at').default(sql`(CURRENT_TIMESTAMP)`),
}, (table) => ({
  ipDateUnique: uniqueIndex('faq_ai_ip_date_idx').on(table.ip, table.date),
}));

// ============================================================
// Tabel Baru untuk Admin Menu
// ============================================================

/** Tabel Kategori Produk */
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

/** Tabel Kupon Diskon */
export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // 'percentage' | 'fixed'
  value: integer('value').notNull(),
  minPurchase: integer('min_purchase').default(0),
  maxUses: integer('max_uses').default(100),
  usedCount: integer('used_count').default(0),
  startDate: text('start_date'),
  endDate: text('end_date'),
  isActive: integer('is_active').default(1),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

/** Tabel Ulasan / Testimoni */
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull(),
  productName: text('product_name'),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment').notNull(),
  status: text('status').default('pending'), // 'pending' | 'approved' | 'rejected'
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

/** Tabel Blog / Artikel */
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  tags: text('tags'), // comma-separated
  status: text('status').default('draft'), // 'draft' | 'published'
  author: text('author').default('Admin Sundara'),
  publishedAt: text('published_at'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

/** Tabel Pengaturan Toko (key-value store) */
export const storeSettings = sqliteTable('store_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(), // JSON string
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Export types
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type FaqAiUsage = typeof faqAiUsage.$inferSelect;
export type NewFaqAiUsage = typeof faqAiUsage.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type StoreSetting = typeof storeSettings.$inferSelect;
export type NewStoreSetting = typeof storeSettings.$inferInsert;
