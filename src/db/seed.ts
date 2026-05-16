import { db } from './index';
import { products, customers, orders, orderItems } from './schema';
import { products as existingProducts } from '@/data/products';

// ─── 30 Dummy Customers ───────────────────────────────────────────────────────
const customerData = [
  { name: 'Budi Santoso',         phone: '081234567890', address: 'Jl. Merdeka No. 10, Bandung, Jawa Barat 40111' },
  { name: 'Siti Rahmawati',       phone: '081298765432', address: 'Jl. Sudirman No. 25, Jakarta Pusat, DKI Jakarta 10210' },
  { name: 'Agus Wijaya',          phone: '082134567891', address: 'Jl. Diponegoro No. 5, Surabaya, Jawa Timur 60241' },
  { name: 'Dewi Lestari',         phone: '082187654323', address: 'Perumahan Griya Asri Blok A3, Semarang, Jawa Tengah 50111' },
  { name: 'Hendra Gunawan',       phone: '083134567892', address: 'Jl. Ahmad Yani No. 88, Medan, Sumatera Utara 20111' },
  { name: 'Rina Marlina',         phone: '083187654324', address: 'Jl. Pahlawan No. 15, Makassar, Sulawesi Selatan 90111' },
  { name: 'Dian Purnama',         phone: '084134567893', address: 'Jl. Gatot Subroto No. 33, Denpasar, Bali 80231' },
  { name: 'Fajar Hidayat',        phone: '084187654325', address: 'Jl. Siliwangi No. 7, Yogyakarta, DI Yogyakarta 55111' },
  { name: 'Ratna Kusuma',         phone: '085134567894', address: 'Perumahan Citra Garden Blok B2, Palembang, Sumatera Selatan 30111' },
  { name: 'Adi Saputra',          phone: '085187654326', address: 'Jl. Veteran No. 45, Bandar Lampung, Lampung 35111' },
  { name: 'Maya Anggraini',       phone: '086134567895', address: 'Jl. Teuku Umar No. 12, Banda Aceh, Aceh 23111' },
  { name: 'Rizky Pratama',        phone: '086187654327', address: 'Jl. Pattimura No. 21, Malang, Jawa Timur 65111' },
  { name: 'Fitri Handayani',      phone: '087134567896', address: 'Perumahan Permata Hijau Blok C5, Bogor, Jawa Barat 16111' },
  { name: 'Dimas Ardiansyah',     phone: '087187654328', address: 'Jl. Imam Bonjol No. 56, Padang, Sumatera Barat 25111' },
  { name: 'Nurul Hidayah',        phone: '088134567897', address: 'Jl. Jend. Ahmad Yani No. 9, Pontianak, Kalimantan Barat 78111' },
  { name: 'Eko Prasetyo',         phone: '088187654329', address: 'Perumahan Bumi Indah Blok D8, Samarinda, Kalimantan Timur 75111' },
  { name: 'Wulan Sari',           phone: '089134567898', address: 'Jl. WR Supratman No. 34, Manado, Sulawesi Utara 95111' },
  { name: 'Yoga Permana',         phone: '089187654330', address: 'Jl. MT Haryono No. 17, Banjarmasin, Kalimantan Selatan 70111' },
  { name: 'Lina Fitriana',        phone: '081234567901', address: 'Perumahan Pondok Indah Blok E2, Pekanbaru, Riau 28111' },
  { name: 'Arif Rachman',         phone: '081298765412', address: 'Jl. Gajah Mada No. 40, Balikpapan, Kalimantan Timur 76111' },
  { name: 'Indah Permata',        phone: '082134567913', address: 'Jl. Hayam Wuruk No. 8, Mataram, Nusa Tenggara Barat 83111' },
  { name: 'Gilang Ramadhan',      phone: '082187654341', address: 'Perumahan Taman Sari Blok F3, Tasikmalaya, Jawa Barat 46111' },
  { name: 'Nadia Aulia',          phone: '083134567924', address: 'Jl. Dipatiukur No. 22, Cimahi, Jawa Barat 40511' },
  { name: 'Irfan Maulana',        phone: '083187654352', address: 'Jl. Soekarno-Hatta No. 60, Kediri, Jawa Timur 64111' },
  { name: 'Rani Puspita',         phone: '084134567935', address: 'Perumahan Bukit Permai Blok A7, Cirebon, Jawa Barat 45111' },
  { name: 'Bayu Nugroho',         phone: '084187654363', address: 'Jl. Panglima Sudirman No. 13, Madiun, Jawa Timur 63111' },
  { name: 'Tia Safitri',          phone: '085134567946', address: 'Perumahan Graha Indah Blok H9, Sukabumi, Jawa Barat 43111' },
  { name: 'Doni Lesmana',         phone: '085187654374', address: 'Jl. Basuki Rahmat No. 29, Pasuruan, Jawa Timur 67111' },
  { name: 'Sari Dewanti',         phone: '086134567957', address: 'Perumahan Puri Asri Blok J4, Tegal, Jawa Tengah 52111' },
  { name: 'Rangga Wiradinata',    phone: '086187654385', address: 'Jl. Ahmad Dahlan No. 72, Jember, Jawa Timur 68111' },
];

// ─── 30 Dummy Orders ──────────────────────────────────────────────────────────
// Each order references a customer index (0-29), uses products from DB (id 1-8),
// and has a realistic set of items, status, dates, etc.
const orderData = [
  {
    customerIdx: 0,
    items: [{ productId: 1, qty: 2 }, { productId: 7, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer BCA',
    shippingCost: 25000,
    discount: 0,
    dateOffset: 90, // days ago
  },
  {
    customerIdx: 1,
    items: [{ productId: 4, qty: 1 }, { productId: 8, qty: 2 }],
    status: 'delivered',
    paymentMethod: 'QRIS',
    shippingCost: 30000,
    discount: 0,
    dateOffset: 85,
  },
  {
    customerIdx: 2,
    items: [{ productId: 2, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer Mandiri',
    shippingCost: 20000,
    discount: 22000, // COFFEE10 voucher
    dateOffset: 80,
  },
  {
    customerIdx: 3,
    items: [{ productId: 6, qty: 3 }, { productId: 7, qty: 2 }],
    status: 'shipped',
    paymentMethod: 'COD',
    shippingCost: 35000,
    discount: 0,
    dateOffset: 72,
  },
  {
    customerIdx: 4,
    items: [{ productId: 5, qty: 1 }],
    status: 'shipped',
    paymentMethod: 'Bank Transfer BNI',
    shippingCost: 28000,
    discount: 35000, // COFFEE10
    dateOffset: 68,
  },
  {
    customerIdx: 5,
    items: [{ productId: 1, qty: 1 }, { productId: 3, qty: 1 }, { productId: 8, qty: 1 }],
    status: 'shipped',
    paymentMethod: 'QRIS',
    shippingCost: 32000,
    discount: 0,
    dateOffset: 60,
  },
  {
    customerIdx: 6,
    items: [{ productId: 4, qty: 2 }],
    status: 'processing',
    paymentMethod: 'Bank Transfer BCA',
    shippingCost: 22000,
    discount: 0,
    dateOffset: 55,
  },
  {
    customerIdx: 7,
    items: [{ productId: 7, qty: 4 }],
    status: 'processing',
    paymentMethod: 'Bank Transfer Mandiri',
    shippingCost: 40000,
    discount: 0,
    dateOffset: 50,
  },
  {
    customerIdx: 8,
    items: [{ productId: 2, qty: 1 }, { productId: 6, qty: 2 }],
    status: 'processing',
    paymentMethod: 'COD',
    shippingCost: 30000,
    discount: 15000,
    dateOffset: 45,
  },
  {
    customerIdx: 9,
    items: [{ productId: 3, qty: 2 }, { productId: 5, qty: 1 }],
    status: 'pending',
    paymentMethod: 'QRIS',
    shippingCost: 35000,
    discount: 0,
    dateOffset: 40,
  },
  {
    customerIdx: 10,
    items: [{ productId: 8, qty: 1 }, { productId: 1, qty: 1 }],
    status: 'pending',
    paymentMethod: 'Bank Transfer BNI',
    shippingCost: 25000,
    discount: 0,
    dateOffset: 35,
  },
  {
    customerIdx: 11,
    items: [{ productId: 4, qty: 3 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer BCA',
    shippingCost: 28000,
    discount: 42000, // COFFEE10
    dateOffset: 120,
  },
  {
    customerIdx: 12,
    items: [{ productId: 6, qty: 5 }],
    status: 'delivered',
    paymentMethod: 'COD',
    shippingCost: 45000,
    discount: 0,
    dateOffset: 110,
  },
  {
    customerIdx: 13,
    items: [{ productId: 1, qty: 1 }, { productId: 2, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'QRIS',
    shippingCost: 25000,
    discount: 0,
    dateOffset: 100,
  },
  {
    customerIdx: 14,
    items: [{ productId: 5, qty: 2 }, { productId: 7, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer Mandiri',
    shippingCost: 32000,
    discount: 0,
    dateOffset: 95,
  },
  {
    customerIdx: 15,
    items: [{ productId: 3, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer BCA',
    shippingCost: 18000,
    discount: 19500,
    dateOffset: 88,
  },
  {
    customerIdx: 16,
    items: [{ productId: 8, qty: 2 }],
    status: 'shipped',
    paymentMethod: 'QRIS',
    shippingCost: 24000,
    discount: 0,
    dateOffset: 82,
  },
  {
    customerIdx: 17,
    items: [{ productId: 4, qty: 1 }, { productId: 6, qty: 2 }, { productId: 1, qty: 1 }],
    status: 'shipped',
    paymentMethod: 'Bank Transfer BNI',
    shippingCost: 38000,
    discount: 18500,
    dateOffset: 75,
  },
  {
    customerIdx: 18,
    items: [{ productId: 7, qty: 2 }],
    status: 'pending',
    paymentMethod: 'COD',
    shippingCost: 22000,
    discount: 0,
    dateOffset: 30,
  },
  {
    customerIdx: 19,
    items: [{ productId: 2, qty: 1 }, { productId: 5, qty: 1 }],
    status: 'pending',
    paymentMethod: 'Bank Transfer Mandiri',
    shippingCost: 30000,
    discount: 0,
    dateOffset: 25,
  },
  {
    customerIdx: 20,
    items: [{ productId: 3, qty: 2 }],
    status: 'pending',
    paymentMethod: 'QRIS',
    shippingCost: 20000,
    discount: 39000,
    dateOffset: 20,
  },
  {
    customerIdx: 21,
    items: [{ productId: 1, qty: 1 }, { productId: 8, qty: 1 }],
    status: 'processing',
    paymentMethod: 'Bank Transfer BCA',
    shippingCost: 25000,
    discount: 0,
    dateOffset: 18,
  },
  {
    customerIdx: 22,
    items: [{ productId: 6, qty: 3 }],
    status: 'processing',
    paymentMethod: 'COD',
    shippingCost: 28000,
    discount: 0,
    dateOffset: 15,
  },
  {
    customerIdx: 23,
    items: [{ productId: 4, qty: 1 }, { productId: 7, qty: 1 }],
    status: 'processing',
    paymentMethod: 'Bank Transfer BNI',
    shippingCost: 22000,
    discount: 0,
    dateOffset: 12,
  },
  {
    customerIdx: 24,
    items: [{ productId: 5, qty: 1 }],
    status: 'shipped',
    paymentMethod: 'QRIS',
    shippingCost: 30000,
    discount: 0,
    dateOffset: 65,
  },
  {
    customerIdx: 25,
    items: [{ productId: 2, qty: 2 }, { productId: 3, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer Mandiri',
    shippingCost: 32000,
    discount: 44000,
    dateOffset: 130,
  },
  {
    customerIdx: 26,
    items: [{ productId: 1, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer BCA',
    shippingCost: 20000,
    discount: 0,
    dateOffset: 140,
  },
  {
    customerIdx: 27,
    items: [{ productId: 8, qty: 3 }],
    status: 'delivered',
    paymentMethod: 'COD',
    shippingCost: 35000,
    discount: 60000,
    dateOffset: 150,
  },
  {
    customerIdx: 28,
    items: [{ productId: 6, qty: 2 }, { productId: 4, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'QRIS',
    shippingCost: 30000,
    discount: 0,
    dateOffset: 145,
  },
  {
    customerIdx: 29,
    items: [{ productId: 7, qty: 1 }, { productId: 5, qty: 1 }, { productId: 1, qty: 1 }],
    status: 'delivered',
    paymentMethod: 'Bank Transfer BNI',
    shippingCost: 38000,
    discount: 35000,
    dateOffset: 135,
  },
];

// Product price lookup by productId (matches DB auto-increment IDs from existing products)
const productPrices: Record<number, { name: string; price: number }> = {
  1: { name: 'Gayo Arabica', price: 185000 },
  2: { name: 'Mandheling', price: 220000 },
  3: { name: 'Lintong', price: 195000 },
  4: { name: 'Kintamani Bali', price: 210000 },
  5: { name: 'Wamena', price: 350000 },
  6: { name: 'Robusta Temanggung', price: 95000 },
  7: { name: 'Blend Signature "Saudara"', price: 150000 },
  8: { name: 'Java Preanger', price: 200000 },
};

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().replace('T', ' ').substring(0, 19);
}

function generateOrderNumber(idx: number): string {
  return `SC-${String(idx + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function seed() {
  // ─── 1. Seed Products ──────────────────────────────────────────────────────
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
  console.log('Products seeded!');

  // ─── 2. Seed Customers ─────────────────────────────────────────────────────
  console.log('Seeding 30 customers...');
  for (const c of customerData) {
    await db.insert(customers).values({
      name: c.name,
      phone: c.phone,
      address: c.address,
    });
  }
  console.log('Customers seeded!');

  // ─── 3. Seed Orders & Order Items ──────────────────────────────────────────
  console.log('Seeding 30 orders...');
  for (let i = 0; i < orderData.length; i++) {
    const o = orderData[i];
    const customer = customerData[o.customerIdx];
    const customerId = o.customerIdx + 1; // auto-increment starts at 1

    // Calculate item details
    const orderItemDetails = o.items.map((item) => {
      const prod = productPrices[item.productId];
      return {
        productId: item.productId,
        productName: prod.name,
        quantity: item.qty,
        price: prod.price,
        subtotal: prod.price * item.qty,
      };
    });

    const subtotal = orderItemDetails.reduce((sum, item) => sum + item.subtotal, 0);
    const totalAmount = subtotal + o.shippingCost - o.discount;
    const createdAt = formatDate(o.dateOffset);

    // Insert order
    const newOrder = await db.insert(orders).values({
      orderNumber: generateOrderNumber(i),
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      totalAmount,
      shippingCost: o.shippingCost,
      discount: o.discount,
      status: o.status,
      paymentMethod: o.paymentMethod,
      createdAt,
    }).returning();

    // Insert order items
    for (const item of orderItemDetails) {
      await db.insert(orderItems).values({
        orderId: newOrder[0].id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      });
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  ${i + 1} orders inserted...`);
    }
  }
  console.log('Seeding complete!');
}

seed();
