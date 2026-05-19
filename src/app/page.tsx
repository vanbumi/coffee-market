'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import StatCard from '@/components/StatCard';
import { useAllProducts } from '@/hooks/useAllProducts';
import { useStoreSettings } from '@/hooks/useStoreSettings';

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  avatar: string;
  productName?: string;
}

interface ReviewApiEntry {
  id: number;
  customerName: string;
  comment: string;
  rating: number;
  productName: string | null;
  status: string;
  createdAt: string | null;
}

const categories = [
  {
    name: 'Arabica',
    description: 'Kopi premium dengan acidity rendah & aroma kompleks. Pilihan terbaik untuk pengalaman minum kopi yang halus.',
    icon: '🫘',
    slug: 'Arabica' as const,
  },
  {
    name: 'Robusta',
    description: 'Kopi dengan body kuat & kadar kafein lebih tinggi. Cocok untuk espresso atau kopi yang mantap.',
    icon: '☕',
    slug: 'Robusta' as const,
  },
  {
    name: 'Blend',
    description: 'Racikan spesial dari berbagai biji kopi pilihan. Keseimbangan sempurna dalam setiap tegukan.',
    icon: '✨',
    slug: 'Blend' as const,
  },
];

const stats = [
  { value: '12+', label: 'Varian Kopi Premium', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { value: '10+', label: 'Daerah Asal Nusantara', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { value: '100%', label: 'Biji Kopi Premium', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { value: '500+', label: 'Pelanggan Setia', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg> },
];

/** Fallback testimonials used when API is unavailable (no data yet) */
const fallbackTestimonials: Testimonial[] = [
  {
    name: 'Rina Wijaya',
    text: 'Kualitas biji kopi dari Sundara Coffee luar biasa! Gayo Arabica menjadi favorit pelanggan di kafe saya. Benar-benar premium!',
    rating: 5,
    avatar: 'RW',
  },
  {
    name: 'Bambang Setiawan',
    text: 'Pengiriman cepat, biji kopi masih segar. Kintamani Bali recommended banget untuk manual brew. Aromanya sempurna!',
    rating: 5,
    avatar: 'BS',
  },
  {
    name: 'Dewi Lestari',
    text: 'Sudah langganan sejak 2 tahun lalu. Kualitas konsisten dan pelayanan ramah. Highly recommended untuk pebisnis kopi!',
    rating: 5,
    avatar: 'DL',
  },
];

function getAvatarInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function HomePage() {
  const { settings } = useStoreSettings();
  const { allProducts } = useAllProducts();
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 4);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/reviews/public');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: Testimonial[] = json.data.map((r: ReviewApiEntry) => ({
            name: r.customerName,
            text: r.comment,
            rating: r.rating,
            avatar: getAvatarInitials(r.customerName),
            productName: r.productName || undefined,
          }));
          setTestimonials(mapped);
        }
        // If API returns empty array, keep fallback
      } catch {
        // Keep fallback on error
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-surface">
          {/* Hero banner image from settings */}
          {settings.heroBanner && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${settings.heroBanner})` }}
            />
          )}
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          {/* Lighter overlay when banner image is present */}
          {settings.heroBanner ? (
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15) 0%, rgba(10, 10, 10, 0.75) 70%)' }} />
          ) : (
            <div className="absolute inset-0 bg-hero-overlay" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-surface" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 border border-gold/30 rounded-full text-xs text-gold tracking-wider uppercase mb-8 animate-fade-in-down">
              <span className="w-1.5 h-1.5 bg-gold rounded-full mr-2 animate-glow-pulse" />
              Since 2025 — {settings.heroTitle || 'Premium Coffee Roastery'}
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] animate-fade-in-up">
              <span className="text-text-primary">Discover the Art of</span>
              <br />
              <span className="text-gradient-hero">Premium Coffee</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              {settings.heroSubtitle || 'Menghadirkan biji kopi pilihan terbaik dari seluruh Nusantara. Dari petani kopi pilihan, langsung ke cangkir Anda.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold-light text-black rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:scale-105"
              >
                {settings.heroCta || 'Shop Now'}
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 border border-gold/40 text-gold hover:bg-gold/10 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-gold"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* ========== STATISTICS SECTION ========== */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-gold text-sm tracking-widest uppercase font-medium">Categories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-3 mb-4">
            Pilih Kategori Kopi Favorit
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Kami menyediakan berbagai jenis biji kopi premium dari seluruh Nusantara
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              description={cat.description}
              icon={cat.icon}
              slug={cat.slug}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="relative py-24 bg-gradient-to-b from-surface via-surface-alt to-surface border-y border-border">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold text-sm tracking-widest uppercase font-medium">Featured Products</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-3 mb-4">
              Produk Unggulan
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Koleksi biji kopi terbaik pilihan kami untuk Anda
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="inline-flex items-center px-8 py-3.5 bg-gold hover:bg-gold-light text-black rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20 group"
            >
              Lihat Semua Produk
              <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-gold text-sm tracking-widest uppercase font-medium">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-3 mb-4">
            Mengapa Memilih Kami?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: '🌱', title: 'Langsung dari Petani', desc: 'Bekerja sama langsung dengan petani kopi pilihan di seluruh Indonesia' },
            { icon: '🏆', title: 'Kualitas Premium', desc: 'Hanya biji kopi dengan kualitas terbaik yang kami jual' },
            { icon: '🚚', title: 'Pengiriman Cepat', desc: 'Dikirim langsung setelah dipesan dengan kemasan vakum' },
            { icon: '💚', title: 'Ramah Lingkungan', desc: 'Mendukung praktik pertanian kopi yang berkelanjutan' },
          ].map((item, i) => (
            <div
              key={item.title}
              className="text-center group p-6 rounded-xl bg-surface-alt border border-border hover:border-gold/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.08)] animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
              <h3 className="font-bold text-lg text-text-primary mb-2 group-hover:text-gold transition-colors duration-300">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="relative py-24 bg-surface-alt border-y border-border overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=1920&q=10)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold text-sm tracking-widest uppercase font-medium">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-3 mb-4">
              Apa Kata Pelanggan?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Kepercayaan dan kepuasan pelanggan adalah prioritas utama kami
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative bg-surface-card rounded-2xl p-8 border border-border hover:border-gold/20 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.08)] animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
              >
                {/* Gold left border accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gold rounded-l-2xl" />
                
                {/* Stars */}
                <div className="flex text-gold mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-xl">★</span>
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-text-secondary mb-6 italic leading-relaxed text-sm">
                  &ldquo;{t.text}&rdquo;
                </p>
                
                {/* Profile */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm mr-3">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{t.name}</p>
                    {t.productName && (
                      <p className="text-xs text-gold mt-0.5">{t.productName}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER / CTA ========== */}
      <section className="relative py-24 bg-gradient-to-b from-surface to-[#F5F0E0]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-gold text-sm tracking-widest uppercase font-medium">Newsletter</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-3 mb-4">
              Siap Menikmati Kopi Nusantara?
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
              Dapatkan informasi promo, produk baru, dan tips brewing langsung di email Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-5 py-3.5 bg-surface-card border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
              />
              <button
                className="px-6 py-3.5 bg-gold hover:bg-gold-light text-black rounded-xl font-bold transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20"
              >
                Subscribe
              </button>
            </div>
            <p className="text-text-secondary text-xs mt-4">
              Bergabung dengan 500+ subscriber lainnya. Kami tidak mengirim spam.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
