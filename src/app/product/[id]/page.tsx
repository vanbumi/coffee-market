'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatRupiah } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
import { useAllProducts } from '@/hooks/useAllProducts';
import type { Product } from '@/types/product';

function StarPicker({
  rating,
  onChange,
  disabled,
}: {
  rating: number;
  onChange: (r: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110'
          } ${star <= rating ? 'text-gold' : 'text-text-tertiary/30'}`}
          title={`${star} bintang`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { allProducts } = useAllProducts();
  const product = allProducts.find((p) => p.id === params.id);

  // Compute recommendations client-side only (useEffect) to avoid SSR
  // hydration mismatch from Math.random producing different results
  // on server vs client.
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setRecommended(
        allProducts
          .filter((p) => p.id !== product?.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3),
      );
    }
  }, [allProducts, product?.id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Cart toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

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
    showToast(`${product.name} ditambahkan ke keranjang!`, 'success');
  };

  const incrementQty = () => {
    if (quantity < 10) setQuantity((q) => q + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || reviewRating === 0 || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
          productName: product.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewDone(true);
        setReviewName('');
        setReviewRating(0);
        setReviewComment('');
        showToast('Review berhasil dikirim! Menunggu moderasi admin.', 'success');
      } else {
        showToast(data.message || 'Gagal mengirim review.', 'error');
      }
    } catch {
      showToast('Gagal mengirim review. Silakan coba lagi.', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
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

      {/* ========== REVIEW FORM ========== */}
      <section className="border-t border-border pt-12 mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Beri Review</h2>
        <p className="text-text-secondary mb-8 text-sm">
          Bagikan pengalaman Anda dengan produk ini. Review akan ditinjau oleh admin sebelum ditampilkan.
        </p>

        {reviewDone ? (
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 text-center max-w-lg mx-auto">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-gold mb-1">Review Terkirim!</h3>
            <p className="text-text-secondary text-sm">
              Terima kasih! Review Anda sedang menunggu moderasi admin.
            </p>
            <button
              onClick={() => setReviewDone(false)}
              className="mt-4 px-6 py-2 bg-gold hover:bg-gold-light text-black rounded-xl font-semibold text-sm transition-all duration-300"
            >
              Tulis Review Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="max-w-lg bg-surface-alt border border-border rounded-xl p-6">
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="review-name" className="block text-sm font-medium text-text-primary mb-1.5">
                Nama <span className="text-red-400">*</span>
              </label>
              <input
                id="review-name"
                type="text"
                required
                maxLength={100}
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-2.5 bg-surface-card border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300 text-sm"
              />
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Rating <span className="text-red-400">*</span>
              </label>
              <StarPicker rating={reviewRating} onChange={setReviewRating} disabled={reviewSubmitting} />
              {reviewRating > 0 && (
                <p className="text-xs text-text-secondary mt-1">
                  {reviewRating === 1 && 'Sangat Buruk'}
                  {reviewRating === 2 && 'Buruk'}
                  {reviewRating === 3 && 'Cukup'}
                  {reviewRating === 4 && 'Bagus'}
                  {reviewRating === 5 && 'Sangat Bagus'}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label htmlFor="review-comment" className="block text-sm font-medium text-text-primary mb-1.5">
                Komentar <span className="text-red-400">*</span>
              </label>
              <textarea
                id="review-comment"
                required
                rows={4}
                maxLength={500}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                className="w-full px-4 py-2.5 bg-surface-card border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300 text-sm resize-none"
              />
              <p className="text-xs text-text-secondary mt-1 text-right">{reviewComment.length}/500</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={reviewSubmitting || !reviewName.trim() || reviewRating === 0 || !reviewComment.trim()}
              className="w-full px-6 py-3 bg-gold hover:bg-gold-light text-black rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold disabled:hover:shadow-gold/10 flex items-center justify-center"
            >
              {reviewSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengirim...
                </>
              ) : (
                'Kirim Review'
              )}
            </button>
          </form>
        )}
      </section>

      {/* Recommended Products */}
      {recommended.length > 0 && (
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
      )}
    </div>
  );
}
