import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Coffee Market',
  description: 'Kelola produk dan upload gambar kopi',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}
