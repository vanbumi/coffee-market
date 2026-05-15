import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

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
  createdAt: text('created_at').default("CURRENT_TIMESTAMP"),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').unique().notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  totalAmount: integer('total_amount').notNull(),
  shippingCost: integer('shipping_cost').notNull(),
  discount: integer('discount').default(0),
  status: text('status').default('pending'),
  paymentMethod: text('payment_method'),
  createdAt: text('created_at').default("CURRENT_TIMESTAMP"),
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
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
