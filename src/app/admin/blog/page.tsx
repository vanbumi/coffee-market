'use client';

import { useState, useEffect, useCallback } from 'react';

/** Tipe data blog post */
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string | null;
  status: 'draft' | 'published';
  author: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/** Form state */
interface BlogForm {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string;
  author: string;
  status: 'draft' | 'published';
}

const initialBlogForm: BlogForm = {
  title: '',
  content: '',
  excerpt: '',
  coverImage: '',
  tags: '',
  author: 'Admin Sundara',
  status: 'draft',
};

/**
 * Halaman Blog / Artikel (Admin)
 * CRUD artikel konten edukasi kopi
 */
export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState<BlogForm>(initialBlogForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/blog');
      const json = await res.json();
      if (json.success) setPosts(json.data);
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { showNotification('error', 'Judul artikel wajib diisi'); return; }
    if (!form.content.trim()) { showNotification('error', 'Konten artikel wajib diisi'); return; }

    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/blog?id=${editingId}` : '/api/blog';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', editingId ? 'Artikel berhasil diperbarui' : 'Artikel berhasil ditambahkan');
        setForm(initialBlogForm);
        setEditingId(null);
        setShowForm(false);
        fetchPosts();
      } else {
        showNotification('error', json.message || 'Gagal menyimpan artikel');
      }
    } catch { showNotification('error', 'Gagal menyimpan artikel'); }
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      coverImage: post.coverImage || '',
      tags: post.tags || '',
      author: post.author || 'Admin Sundara',
      status: post.status,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) { showNotification('success', 'Artikel dihapus'); fetchPosts(); }
      else showNotification('error', json.message || 'Gagal menghapus');
    } catch { showNotification('error', 'Gagal menghapus artikel'); }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch('/api/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) { showNotification('success', `Status diubah ke ${newStatus}`); fetchPosts(); }
      else showNotification('error', json.message || 'Gagal memperbarui');
    } catch { showNotification('error', 'Gagal memperbarui artikel'); }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">📝 Blog / Artikel</h1>
              <p className="text-sm text-text-secondary mt-1">Content management untuk edukasi kopi</p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); if (editingId) { setForm(initialBlogForm); setEditingId(null); } }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${showForm ? 'bg-surface-card text-text-secondary border border-border hover:bg-surface-hover' : 'bg-gold hover:bg-gold-light text-black shadow-sm shadow-gold/20'}`}
            >
              {showForm ? '✕ Tutup Form' : '➕ Tulis Artikel'}
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div className={`mb-6 px-4 py-3 rounded-xl border flex items-center justify-between ${notification.type === 'success' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Blog Form (collapsible) */}
        {showForm && (
          <div className="bg-surface-alt rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              {editingId ? '✏️ Edit Artikel' : '➕ Artikel Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Judul <span className="text-red-400">*</span></label>
                <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Judul artikel..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))} className="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Author</label>
                  <input type="text" value={form.author} onChange={(e) => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Nama penulis" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Tags (koma)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="kopi, arabica, tips" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Cover Image URL</label>
                <input type="text" value={form.coverImage} onChange={(e) => setForm(p => ({ ...p, coverImage: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Cuplikan (excerpt)</label>
                <textarea value={form.excerpt} onChange={(e) => setForm(p => ({ ...p, excerpt: e.target.value }))} rows={2} placeholder="Ringkasan singkat artikel..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Konten <span className="text-red-400">*</span></label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={12}
                  placeholder="Tulis konten artikel di sini... (HTML atau plain text)"
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none resize-none font-mono"
                  required
                />
                <p className="text-xs text-text-tertiary mt-1">Konten dapat berupa HTML atau plain text. Untuk rich text editor bisa ditambahkan nanti.</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-gold hover:bg-gold-light disabled:bg-gold/50 text-black rounded-lg font-semibold text-sm transition-all">
                  {isSubmitting ? 'Menyimpan...' : editingId ? '💾 Update Artikel' : '📝 Publish / Simpan Draft'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(initialBlogForm); setEditingId(null); }} className="px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-card rounded-lg transition-colors text-sm">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Posts List */}
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="bg-surface-alt rounded-xl border border-border p-4 animate-pulse"><div className="h-4 bg-surface-hover rounded w-1/2 mb-2" /><div className="h-3 bg-surface-hover rounded w-3/4" /></div>)}</div>
        ) : posts.length === 0 ? (
          <div className="bg-surface-alt rounded-xl border border-border p-12 text-center">
            <div className="text-5xl mb-4 opacity-30">📝</div>
            <p className="text-text-secondary text-lg">Belum ada artikel</p>
            <p className="text-text-tertiary text-sm mt-1">Klik &ldquo;Tulis Artikel&rdquo; untuk membuat artikel pertama</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className={`bg-surface-alt rounded-xl border p-5 transition-colors ${post.status === 'published' ? 'border-border hover:border-gold/20' : 'border-border/50 opacity-70'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {post.coverImage && (
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-surface flex-shrink-0 border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-text-primary font-semibold text-sm truncate">{post.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${post.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {post.status === 'published' ? '📢 Published' : '📝 Draft'}
                        </span>
                      </div>
                      {post.excerpt && <p className="text-xs text-text-secondary line-clamp-2">{post.excerpt}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                        {post.tags && <span>🏷️ {post.tags}</span>}
                        <span>✍️ {post.author || '-'}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleToggleStatus(post.id, post.status)} className="p-2 text-text-tertiary hover:text-gold hover:bg-gold/10 rounded-lg transition-colors" title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {post.status === 'published' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                    <button onClick={() => handleEdit(post)} className="p-2 text-text-tertiary hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
