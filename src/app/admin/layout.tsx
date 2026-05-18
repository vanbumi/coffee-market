import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Sundara Coffee',
  description: 'Kelola produk dan upload gambar kopi - Premium Coffee Roastery',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface">
      {children}
    </div>
  );
}
