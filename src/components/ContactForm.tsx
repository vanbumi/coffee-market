'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek harus diisi';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan harus diisi';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Pesan minimal 10 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pesan');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-surface-card border border-border rounded-lg text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300';
  const inputErrorClass =
    'w-full px-4 py-3 bg-surface-card border border-red-500 rounded-lg text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all duration-300';
  const labelClass = 'block text-sm font-medium text-text-primary mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Success Notification */}
      {status === 'success' && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-green-600 dark:text-green-400 font-medium text-sm">
              Pesan berhasil dikirim!
            </p>
            <p className="text-green-600/70 dark:text-green-400/70 text-xs mt-1">
              Terima kasih, kami akan menghubungi Anda segera.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {status === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-red-600 dark:text-red-400 font-medium text-sm">
              Gagal mengirim pesan
            </p>
            <p className="text-red-600/70 dark:text-red-400/70 text-xs mt-1">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Nama */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masukkan nama Anda"
          className={errors.name ? inputErrorClass : inputClass}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="contoh@email.com"
          className={errors.email ? inputErrorClass : inputClass}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
        )}
      </div>

      {/* Phone (Optional) */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          No. WhatsApp <span className="text-text-secondary text-xs">(opsional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+62 812-3456-7890"
          className={inputClass}
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className={labelClass}>
          Subjek <span className="text-red-500">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={errors.subject ? inputErrorClass : inputClass}
        >
          <option value="">Pilih subjek pesan</option>
          <option value="Pertanyaan Produk">Pertanyaan Produk</option>
          <option value="Pemesanan">Pemesanan</option>
          <option value="Pembayaran">Pembayaran</option>
          <option value="Pengiriman">Pengiriman</option>
          <option value="Wholesale / Reseller">Wholesale / Reseller</option>
          <option value="Kerjasama">Kerjasama</option>
          <option value="Saran & Kritik">Saran & Kritik</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        {errors.subject && (
          <p className="text-red-500 text-xs mt-1.5">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tulis pesan Anda di sini..."
          className={errors.message ? inputErrorClass : inputClass}
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3.5 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg transition-all duration-300 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {status === 'sending' ? (
          <>
            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Mengirim...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  );
}
