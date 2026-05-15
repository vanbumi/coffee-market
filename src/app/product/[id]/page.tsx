'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatRupiah } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
import { useAllProducts } from '@/hooks/useAllProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { allProducts } = useAllProducts();
  const product = allProducts.find((p) => p.id === params.id);

  // Get 3 random recommended products
  const recommended = allProducts
    .filter((p) => p.id !== product?.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Produk Tidak Ditemukan
        </h1>
        <p className="text-text-secondary mb-6">
          Maaf, produk yang Anda cari tidak tersedia.
        </p>
        <Link
          href="/catalog"
          className="inline-flex px-6 py-3 bg-gold text-black rounded-xl hover:bg-gold-light transition-all duration-300 font-semibold shadow-lg shadow-gold/10"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setToastMessage(`${product.name} ditambahkan ke keranjang!`);
    setToastVisible(true);
  };

  const incrementQty = () => {
    if (quantity < 10) setQuantity((q) => q + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-gold transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-gold transition-colors">
          Katalog
        </Link>
        <span>/</span>
        <span className="text-gold font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-4 bg-surface-alt border border-border">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-gold ring-2 ring-gold/20'
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                product.type === 'Arabica'
                  ? 'bg-gold/20 text-gold border-gold/30'
                  : product.type === 'Robusta'
                  ? 'bg-text-secondary/20 text-text-secondary border-text-secondary/30'
                  : 'bg-gold/30 text-gold border-gold/40'
              }`}
            >
              {product.type}
            </span>
            <span className="flex items-center text-gold font-semibold">
              ★ {product.rating}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-text-secondary mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {product.origin}, {product.region}
          </p>

          <p className="text-text-secondary leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Detail Info */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-alt rounded-xl p-4 text-center border border-border">
              <p className="text-xs text-text-secondary mb-1">Ketinggian</p>
              <p className="font-semibold text-sm text-gold">{product.altitude}</p>
            </div>
            <div className="bg-surface-alt rounded-xl p-4 text-center border border-border">
              <p className="text-xs text-text-secondary mb-1">Proses</p>
              <p className="font-semibold text-sm text-text-primary capitalize">
                {product.processing}
              </p>
            </div>
            <div className="bg-surface-alt rounded-xl p-4 text-center border border-border">
              <p className="text-xs text-text-secondary mb-1">Roast</p>
              <p className="font-semibold text-sm text-text-primary capitalize">
                {product.roastLevel}
              </p>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gold mb-3 tracking-wide uppercase">
              Tasting Notes
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1.5 bg-surface-card text-text-secondary border border-border rounded-full text-sm font-medium capitalize"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-sm text-text-secondary">Harga per kg</p>
            <p className="text-4xl font-bold text-gold">
              {formatRupiah(product.price)}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center border border-border rounded-xl bg-surface-alt">
              <button
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="px-4 py-3 text-text-secondary hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xl font-medium rounded-l-xl"
              >
                -
              </button>
              <span className="px-6 py-3 text-text-primary font-semibold text-lg min-w-[60px] text-center border-x border-border">
                {quantity}
              </span>
              <button
                onClick={incrementQty}
                disabled={quantity >= 10}
                className="px-4 py-3 text-text-secondary hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xl font-medium rounded-r-xl"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 w-full sm:w-auto px-8 py-3.5 bg-gold hover:bg-gold-light text-black rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20 flex items-center justify-center"
            >
              <svg
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              Tambah ke Keranjang
            </button>
          </div>

          {/* Stock Info */}
          <p className="text-sm text-text-secondary mt-4">
            {product.stock > 0
              ? `Stok tersedia: ${product.stock} kg`
              : 'Stok habis'}
          </p>
        </div>
      </div>

      {/* Recommended Products */}
      <section className="border-t border-border pt-12">
        <h2 className="text-2xl font-bold text-text-primary mb-8">
          Produk Rekomendasi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
