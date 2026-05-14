'use client';

import { useState, useEffect, useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Product } from '@/types/product';
import { CoffeeType } from '@/types/product';
import ImageGallery from '@/components/admin/ImageGallery';
import ProductManagement from '@/components/admin/ProductManagement';

/** Tipe untuk hasil upload Cloudinary */
interface CloudinaryResult {
  info: {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
  };
  event: string;
}

/** State untuk form produk baru */
interface ProductForm {
  name: string;
  price: string;
  origin: string;
  type: CoffeeType;
  description: string;
  stock: string;
  roastedLevel: string;
  processing: string;
}

/** State awal form */
const initialFormState: ProductForm = {
  name: '',
  price: '',
  origin: '',
  type: 'Arabica',
  description: '',
  stock: '0',
  roastedLevel: 'medium',
  processing: 'natural',
};

export default function AdminDashboardPage() {
  // State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [form, setForm] = useState<ProductForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');

  // Ambil produk dinamis (dari admin)
  const fetchAdminProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products?source=dynamic');
      const json = await res.json();
      if (json.success) {
        setAdminProducts(json.data);
      }
    } catch (error) {
      console.error('Gagal mengambil produk admin:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  /** Tampilkan notifikasi */
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  /** Handle upload sukses dari Cloudinary Widget */
  const handleUploadSuccess = (result: CloudinaryResult) => {
    if (result.event === 'success') {
      const imageUrl = result.info.secure_url;
      setUploadedImages((prev) => [...prev, imageUrl]);
      showNotification('success', 'Gambar berhasil diupload!');
    }
  };

  /** Handle hapus gambar dari daftar */
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** Handle perubahan input form */
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle submit form tambah produk */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!form.name.trim()) {
      showNotification('error', 'Nama produk wajib diisi');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      showNotification('error', 'Harga produk wajib diisi dengan angka yang valid');
      return;
    }
    if (!form.origin.trim()) {
      showNotification('error', 'Asal daerah wajib diisi');
      return;
    }
    if (uploadedImages.length === 0) {
      showNotification('error', 'Upload minimal 1 gambar produk');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        origin: form.origin.trim(),
        region: form.origin.trim(),
        type: form.type,
        description: form.description.trim(),
        stock: Number(form.stock),
        roastLevel: form.roastedLevel,
        processing: form.processing,
        images: uploadedImages,
        rating: 0,
        tastingNotes: [],
        featured: false,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        showNotification('success', `Produk "${form.name}" berhasil ditambahkan!`);
        // Reset form
        setForm(initialFormState);
        setUploadedImages([]);
        // Refresh daftar produk
        fetchAdminProducts();
      } else {
        showNotification('error', json.message || 'Gagal menambahkan produk');
      }
    } catch (error) {
      showNotification('error', 'Terjadi kesalahan saat menambahkan produk');
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handle hapus produk */
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', 'Produk berhasil dihapus');
        fetchAdminProducts();
      } else {
        showNotification('error', json.message || 'Gagal menghapus produk');
      }
    } catch (error) {
      showNotification('error', 'Gagal menghapus produk');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="bg-[#111111] border-b border-[#2A2A2A] shadow-sm shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-[#A3A3A3] mt-1">
                Kelola produk dan upload gambar kopi ke Cloudinary
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-sm text-[#A3A3A3] hover:text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-lg transition-all"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Toko
              </a>
              {/* Logout Button */}
              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm text-black bg-gold hover:bg-gold-light rounded-lg transition-all shadow-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl border flex items-center justify-between backdrop-blur-sm ${
              notification.type === 'success'
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-current opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#111111] rounded-xl p-1 border border-[#2A2A2A] shadow-sm shadow-black/20">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'add'
                ? 'bg-gold text-black shadow-sm shadow-gold/20'
                : 'text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <span className="hidden sm:inline">➕ </span>
            Tambah Produk
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'manage'
                ? 'bg-gold text-black shadow-sm shadow-gold/20'
                : 'text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <span className="hidden sm:inline">📦 </span>
            Kelola Produk ({adminProducts.length})
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'add' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Upload & Gallery */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Widget */}
              <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 shadow-sm shadow-black/20">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Upload Gambar
                </h2>
                <p className="text-sm text-[#A3A3A3] mb-4">
                  Upload gambar produk kopi ke Cloudinary. Format: JPG, PNG, WebP.
                </p>

                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'coffee_products'}
                  onSuccess={(result) => handleUploadSuccess(result as CloudinaryResult)}
                  options={{
                    maxFiles: 5,
                    maxFileSize: 5000000, // 5MB
                    folder: 'coffee-market',
                    sources: ['local', 'url', 'camera'],
                    styles: {
                      palette: {
                        window: '#1A1A1A',
                        sourceBg: '#111111',
                        windowBorder: '#2A2A2A',
                        tabIcon: '#D4AF37',
                        inactiveTabIcon: '#555555',
                        menuIcons: '#A3A3A3',
                        link: '#D4AF37',
                        action: '#D4AF37',
                        inProgress: '#D4AF37',
                        complete: '#22C55E',
                        error: '#EF4444',
                        textDark: '#FFFFFF',
                        textLight: '#FFFFFF',
                      },
                    },
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full px-4 py-8 border-2 border-dashed border-[#2A2A2A] rounded-xl text-[#555555] hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all flex flex-col items-center gap-2 group"
                    >
                      <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Klik untuk Upload</span>
                      <span className="text-xs text-[#555555] group-hover:text-[#A3A3A3] transition-colors">Maks 5 gambar, 5MB per file</span>
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {/* Image Gallery Preview */}
              <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 shadow-sm shadow-black/20">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Preview Gambar
                  {uploadedImages.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-[#A3A3A3]">
                      ({uploadedImages.length} gambar)
                    </span>
                  )}
                </h2>
                <ImageGallery
                  images={uploadedImages}
                  onRemoveImage={handleRemoveImage}
                />
              </div>
            </div>

            {/* Right Column: Product Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 shadow-sm shadow-black/20">
                  <h2 className="text-lg font-semibold text-white mb-6">
                    Form Tambah Produk
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nama Produk */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Nama Produk <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Contoh: Gayo Wine Honey"
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white placeholder-[#555555]"
                        required
                      />
                    </div>

                    {/* Harga */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Harga (Rp) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={form.price}
                        onChange={handleFormChange}
                        placeholder="200000"
                        min="0"
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white placeholder-[#555555]"
                        required
                      />
                    </div>

                    {/* Stok */}
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Stok (kg)
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={form.stock}
                        onChange={handleFormChange}
                        placeholder="50"
                        min="0"
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white placeholder-[#555555]"
                      />
                    </div>

                    {/* Asal Daerah */}
                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Asal Daerah <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="origin"
                        name="origin"
                        value={form.origin}
                        onChange={handleFormChange}
                        placeholder="Contoh: Aceh, Toraja, Bali"
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white placeholder-[#555555]"
                        required
                      />
                    </div>

                    {/* Tipe Kopi */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Tipe Kopi <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white"
                        required
                      >
                        <option value="Arabica">Arabica</option>
                        <option value="Robusta">Robusta</option>
                        <option value="Blend">Blend</option>
                      </select>
                    </div>

                    {/* Roast Level */}
                    <div>
                      <label htmlFor="roastedLevel" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Roast Level
                      </label>
                      <select
                        id="roastedLevel"
                        name="roastedLevel"
                        value={form.roastedLevel}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white"
                      >
                        <option value="light">Light Roast</option>
                        <option value="medium">Medium Roast</option>
                        <option value="dark">Dark Roast</option>
                      </select>
                    </div>

                    {/* Processing Method */}
                    <div>
                      <label htmlFor="processing" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Metode Proses
                      </label>
                      <select
                        id="processing"
                        name="processing"
                        value={form.processing}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white"
                      >
                        <option value="natural">Natural</option>
                        <option value="washed">Washed</option>
                        <option value="honey">Honey</option>
                        <option value="semi-washed">Semi-Washed</option>
                        <option value="full washed">Full Washed</option>
                        <option value="wet-hulled">Wet-Hulled</option>
                      </select>
                    </div>

                    {/* Deskripsi */}
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                        Deskripsi Produk
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Deskripsi singkat tentang produk kopi ini..."
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-white placeholder-[#555555] resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gold hover:bg-gold-light disabled:bg-gold/50 disabled:cursor-not-allowed text-black rounded-lg font-semibold text-sm transition-all shadow-sm shadow-gold/20 hover:shadow-gold/30 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          {/* Loading Spinner */}
                          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Simpan Produk
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(initialFormState);
                        setUploadedImages([]);
                      }}
                      className="px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-colors text-sm font-medium"
                    >
                      Reset Form
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Manage Products Tab */
          <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 shadow-sm shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Kelola Produk Admin
                </h2>
                <p className="text-sm text-[#A3A3A3] mt-1">
                  Produk yang ditambahkan melalui dashboard ini
                </p>
              </div>
              <button
                onClick={fetchAdminProducts}
                className="p-2 text-[#555555] hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {isLoadingProducts ? (
              // Loading state
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#1A1A1A] rounded-lg p-4 animate-pulse flex items-center gap-4 border border-[#2A2A2A]">
                    <div className="w-16 h-16 bg-[#2A2A2A] rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#2A2A2A] rounded w-1/3" />
                      <div className="h-3 bg-[#2A2A2A] rounded w-1/4" />
                    </div>
                    <div className="w-8 h-8 bg-[#2A2A2A] rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductManagement
                products={adminProducts}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
