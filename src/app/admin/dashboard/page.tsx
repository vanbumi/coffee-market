'use client';

import { useState, useEffect, useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Product } from '@/types/product';
import { CoffeeType } from '@/types/product';
import ImageGallery from '@/components/admin/ImageGallery';
import ProductManagement from '@/components/admin/ProductManagement';
import SalesChart from '@/components/admin/SalesChart';

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

/** Tipe data order dari database */
interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  shippingCost: number;
  discount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string | null;
}

export default function AdminDashboardPage() {
  // State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [form, setForm] = useState<ProductForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'orders'>('add');

  // Ambil semua produk dari database Turso
  const fetchAdminProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setAdminProducts(json.data);
      }
    } catch (error) {
      console.error('Gagal mengambil produk:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Ambil semua order dari database
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (error) {
      console.error('Gagal mengambil pesanan:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminProducts();
    fetchOrders();
  }, [fetchAdminProducts, fetchOrders]);

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

  /** Format tanggal */
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  /** Format harga */
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  /** Status badge style */
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-surface-hover text-text-secondary border-border-hover';
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
              <p className="text-sm text-text-secondary mt-1">
                Kelola produk, pantau pesanan, dan lihat laporan penjualan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-surface-card hover:bg-surface-hover border border-border rounded-lg transition-all"
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Produk</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{adminProducts.length}</p>
              </div>
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                <span className="text-gold text-lg">📦</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Pesanan</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{orders.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-lg">📋</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Pesanan Pending</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 text-lg">⏳</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Pendapatan</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-lg">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="mb-6">
          <SalesChart orders={orders} />
        </div>

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
        <div className="flex gap-1 mb-6 bg-surface-alt rounded-xl p-1 border border-border shadow-sm shadow-black/20">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'add'
                ? 'bg-gold text-black shadow-sm shadow-gold/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'
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
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'
            }`}
          >
            <span className="hidden sm:inline">📦 </span>
            Kelola Produk ({adminProducts.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              fetchOrders();
            }}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'orders'
                ? 'bg-gold text-black shadow-sm shadow-gold/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'
            }`}
          >
            <span className="hidden sm:inline">📋 </span>
            Pesanan ({orders.length})
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'add' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Upload & Gallery */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Widget */}
              <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Upload Gambar
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                  Upload gambar produk kopi ke Cloudinary. Format: JPG, PNG, WebP.
                </p>

                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'coffee_products'}
                  onSuccess={(result) => handleUploadSuccess(result as CloudinaryResult)}
                  options={{
                    maxFiles: 5,
                    maxFileSize: 5000000,
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
                      className="w-full px-4 py-8 border-2 border-dashed border-border rounded-xl text-text-tertiary hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all flex flex-col items-center gap-2 group"
                    >
                      <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Klik untuk Upload</span>
                      <span className="text-xs text-text-tertiary group-hover:text-text-secondary transition-colors">Maks 5 gambar, 5MB per file</span>
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {/* Image Gallery Preview */}
              <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Preview Gambar
                  {uploadedImages.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-text-secondary">
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
                <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
                  <h2 className="text-lg font-semibold text-text-primary mb-6">
                    Form Tambah Produk
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Nama Produk <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Contoh: Gayo Wine Honey"
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary placeholder-text-tertiary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-text-secondary mb-1.5">
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
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary placeholder-text-tertiary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-text-secondary mb-1.5">
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
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary placeholder-text-tertiary"
                      />
                    </div>

                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Asal Daerah <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="origin"
                        name="origin"
                        value={form.origin}
                        onChange={handleFormChange}
                        placeholder="Contoh: Aceh, Toraja, Bali"
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary placeholder-text-tertiary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Tipe Kopi <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary"
                        required
                      >
                        <option value="Arabica">Arabica</option>
                        <option value="Robusta">Robusta</option>
                        <option value="Blend">Blend</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="roastedLevel" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Roast Level
                      </label>
                      <select
                        id="roastedLevel"
                        name="roastedLevel"
                        value={form.roastedLevel}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary"
                      >
                        <option value="light">Light Roast</option>
                        <option value="medium">Medium Roast</option>
                        <option value="dark">Dark Roast</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="processing" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Metode Proses
                      </label>
                      <select
                        id="processing"
                        name="processing"
                        value={form.processing}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary"
                      >
                        <option value="natural">Natural</option>
                        <option value="washed">Washed</option>
                        <option value="honey">Honey</option>
                        <option value="semi-washed">Semi-Washed</option>
                        <option value="full washed">Full Washed</option>
                        <option value="wet-hulled">Wet-Hulled</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Deskripsi Produk
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Deskripsi singkat tentang produk kopi ini..."
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all text-sm text-text-primary placeholder-text-tertiary resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gold hover:bg-gold-light disabled:bg-gold/50 disabled:cursor-not-allowed text-black rounded-lg font-semibold text-sm transition-all shadow-sm shadow-gold/20 hover:shadow-gold/30 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
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
                      className="px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded-lg transition-colors text-sm font-medium"
                    >
                      Reset Form
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : activeTab === 'manage' ? (
          /* Manage Products Tab */
          <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Kelola Produk Admin
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Produk yang ditambahkan melalui dashboard ini
                </p>
              </div>
              <button
                onClick={fetchAdminProducts}
                className="p-2 text-text-tertiary hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {isLoadingProducts ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-card rounded-lg p-4 animate-pulse flex items-center gap-4 border border-border">
                    <div className="w-16 h-16 bg-surface-hover rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-hover rounded w-1/3" />
                      <div className="h-3 bg-surface-hover rounded w-1/4" />
                    </div>
                    <div className="w-8 h-8 bg-surface-hover rounded-lg" />
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
        ) : (
          /* Orders Tab */
          <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Laporan Pesanan
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Daftar semua pesanan dari database Turso
                </p>
              </div>
              <button
                onClick={fetchOrders}
                className="p-2 text-text-tertiary hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {isLoadingOrders ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-card rounded-lg p-4 animate-pulse flex items-center gap-4 border border-border">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-hover rounded w-1/3" />
                      <div className="h-3 bg-surface-hover rounded w-1/4" />
                    </div>
                    <div className="w-20 h-8 bg-surface-hover rounded-lg" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">📋</div>
                <p className="text-text-secondary text-lg">Belum ada pesanan</p>
                <p className="text-text-tertiary text-sm mt-1">
                  Pesanan akan muncul di sini setelah pelanggan melakukan checkout
                </p>
              </div>
            ) : (
              <>
                {/* Sales Summary Chart */}
                <div className="mb-8 bg-surface-card rounded-lg p-4 border border-border">
                  <h3 className="text-text-primary font-semibold mb-4">Ringkasan Penjualan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface rounded-lg p-4 border border-border">
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Total Pesanan</p>
                      <p className="text-2xl font-bold text-text-primary mt-1">{orders.length}</p>
                    </div>
                    <div className="bg-surface rounded-lg p-4 border border-border">
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Total Pendapatan</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">
                        {formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
                      </p>
                    </div>
                    <div className="bg-surface rounded-lg p-4 border border-border">
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Rata-rata Pesanan</p>
                      <p className="text-2xl font-bold text-gold mt-1">
                        {orders.length > 0
                          ? formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length)
                          : formatPrice(0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-text-secondary font-medium">Order #</th>
                        <th className="text-left py-3 px-2 text-text-secondary font-medium">Pelanggan</th>
                        <th className="text-left py-3 px-2 text-text-secondary font-medium">Total</th>
                        <th className="text-left py-3 px-2 text-text-secondary font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-text-secondary font-medium">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-border hover:bg-surface-card transition-colors"
                        >
                          <td className="py-3 px-2">
                            <span className="text-gold font-mono text-xs">
                              {order.orderNumber}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div>
                              <p className="text-text-primary font-medium">{order.customerName}</p>
                              <p className="text-text-tertiary text-xs">{order.customerPhone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-text-primary font-semibold">
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-text-secondary text-xs">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
