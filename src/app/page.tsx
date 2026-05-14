'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useAllProducts } from '@/hooks/useAllProducts';

const categories = [
  {
    name: 'Arabica',
    description: 'Kopi premium dengan acidity rendah & aroma kompleks',
    icon: '🫘',
    color: 'bg-primary-500',
    slug: 'Arabica',
  },
  {
    name: 'Robusta',
    description: 'Kopi dengan body kuat & kadar kafein lebih tinggi',
    icon: '☕',
    color: 'bg-primary-600',
    slug: 'Robusta',
  },
  {
    name: 'Blend',
    description: 'Racikan spesial dari berbagai biji kopi pilihan',
    icon: '✨',
    color: 'bg-primary-700',
    slug: 'Blend',
  },
];

export default function HomePage() {
  const { allProducts } = useAllProducts();
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 4);
  const testimonials = [
    {
      name: 'Rina Wijaya',
      role: 'Barista, Jakarta',
      text: 'Kualitas biji kopi dari Saudara Coffee luar biasa! Gayo Arabica menjadi favorit pelanggan di kafe saya.',
      rating: 5,
    },
    {
      name: 'Bambang Setiawan',
      role: 'Home Brewer, Bandung',
      text: 'Pengiriman cepat, biji kopi masih segar. Toraja-nya recommended banget untuk manual brew.',
      rating: 5,
    },
    {
      name: 'Dewi Lestari',
      role: 'Coffee Shop Owner, Surabaya',
      text: 'Sudah langganan sejak 2 tahun lalu. Kualitas konsisten dan pelayanan ramah. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Jual Beli Biji Kopi Premium
              <span className="block text-primary-500">dari Seluruh Nusantara</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              Temukan biji kopi terbaik dari petani pilihan di berbagai daerah Indonesia.
              Dari Gayo hingga Papua, kami hadirkan cita rasa Nusantara untuk Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-lg"
              >
                Jelajahi Katalog
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-full font-semibold text-lg transition-all"
              >
                Lihat Produk Unggulan
              </Link>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">12+</p>
                <p className="text-gray-500 text-sm">Varian Kopi</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">10+</p>
                <p className="text-gray-500 text-sm">Daerah Asal</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">100%</p>
                <p className="text-gray-500 text-sm">Biji Kopi Premium</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kategori Kopi
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Kami menyediakan berbagai jenis biji kopi premium dari seluruh Nusantara
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/catalog?type=${cat.slug}`}
              className={`${cat.color} text-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 shadow-md`}
            >
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
              <p className="text-white/80">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produk Unggulan
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Koleksi biji kopi terbaik pilihan kami untuk Anda
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/catalog"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold shadow-sm hover:shadow-md"
            >
              Lihat Semua Produk
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Kami?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Langsung dari Petani</h3>
            <p className="text-gray-500 text-sm">
              Bekerja sama langsung dengan petani kopi pilihan di seluruh Indonesia
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Kualitas Premium</h3>
            <p className="text-gray-500 text-sm">
              Hanya biji kopi dengan kualitas terbaik yang kami jual
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Pengiriman Cepat</h3>
            <p className="text-gray-500 text-sm">
              Dikirim langsung setelah dipesan dengan kemasan vakum
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">💚</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Ramah Lingkungan</h3>
            <p className="text-gray-500 text-sm">
              Mendukung praktik pertanian kopi yang berkelanjutan
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Pelanggan?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex text-yellow-400 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Menikmati Kopi Nusantara?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Pesan sekarang dan rasakan kelezatan biji kopi premium dari berbagai daerah di Indonesia
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-500 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            Mulai Belanja
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
