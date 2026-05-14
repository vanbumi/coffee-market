'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { formatRupiah } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get 3 random recommended products
  const recommended = products
    .filter((p) => p.id !== product?.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Produk Tidak Ditemukan
        </h1>
        <p className="text-gray-500 mb-6">
          Maaf, produk yang Anda cari tidak tersedia.
        </p>
        <Link
          href="/catalog"
          className="inline-flex px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold shadow-sm"
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
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-500 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-primary-500 transition-colors">
          Katalog
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-200 hover:border-gray-300'
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
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.type === 'Arabica'
                  ? 'bg-primary-500 text-white'
                  : product.type === 'Robusta'
                  ? 'bg-primary-600 text-white'
                  : 'bg-primary-700 text-white'
              }`}
            >
              {product.type}
            </span>
            <span className="flex items-center text-yellow-500 font-semibold">
              ★ {product.rating}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-gray-500 mb-4">
            📍 {product.origin}, {product.region}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Detail Info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-500">Ketinggian</p>
              <p className="font-semibold text-sm text-gray-900">{product.altitude}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-500">Proses</p>
              <p className="font-semibold text-sm text-gray-900 capitalize">
                {product.processing}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-500">Roast</p>
              <p className="font-semibold text-sm text-gray-900 capitalize">
                {product.roastLevel}
              </p>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Tasting Notes
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">Harga per kg</p>
            <p className="text-3xl font-bold text-primary-500">
              {formatRupiah(product.price)}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xl font-medium rounded-l-full"
              >
                -
              </button>
              <span className="px-6 py-3 text-gray-900 font-semibold text-lg min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQty}
                disabled={quantity >= 10}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xl font-medium rounded-r-full"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 w-full sm:w-auto px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center"
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
          <p className="text-sm text-gray-500 mt-3">
            {product.stock > 0
              ? `Stok tersedia: ${product.stock} kg`
              : 'Stok habis'}
          </p>
        </div>
      </div>

      {/* Recommended Products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
