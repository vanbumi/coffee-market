'use client';

import { useState } from 'react';
import { Customer } from '@/db/schema';

interface CustomerManagementProps {
  customers: Customer[];
  onDeleteCustomer: (id: number) => void;
}

/**
 * Komponen manajemen customer untuk admin
 * Menampilkan daftar customer dengan pencarian dan opsi hapus
 */
export default function CustomerManagement({ customers, onDeleteCustomer }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Filter customer berdasarkan pencarian
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    onDeleteCustomer(id);
    setDeleteConfirm(null);
  };

  /** Format tanggal */
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-16 w-16 text-text-tertiary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-sm text-text-secondary">Belum ada data customer</p>
        <p className="text-xs text-text-tertiary mt-1">Data customer akan muncul setelah ada pesanan masuk</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari customer (nama, telepon, alamat)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none text-sm text-text-primary placeholder-text-tertiary"
          />
        </div>
      </div>

      {/* Customer List - Card View */}
      <div className="space-y-3">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-surface-card border border-border rounded-lg p-4 hover:border-gold/20 hover:shadow-sm hover:shadow-gold/5 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-text-primary text-sm truncate group-hover:text-gold transition-colors">
                    {customer.name}
                  </h4>
                  <span className="text-xs text-text-tertiary whitespace-nowrap">
                    {formatDate(customer.createdAt)}
                  </span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <p className="text-xs text-text-secondary flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {customer.phone}
                  </p>
                  <p className="text-xs text-text-secondary flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{customer.address}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                {deleteConfirm === customer.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-surface-hover text-text-secondary text-xs rounded-lg hover:bg-border-hover transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(customer.id)}
                    className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Hapus customer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 text-xs text-text-tertiary text-center">
        Menampilkan {filteredCustomers.length} dari {customers.length} customer
      </div>
    </div>
  );
}
