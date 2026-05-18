import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const data = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal mengambil artikel' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = generateSlug(body.title);

    const result = await db.insert(blogPosts).values({
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      tags: body.tags || null,
      status: body.status || 'draft',
      author: body.author || 'Admin Sundara',
      publishedAt: body.status === 'published' ? new Date().toISOString() : null,
    }).returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('UNIQUE')) {
      return NextResponse.json({ success: false, message: 'Slug artikel sudah ada, gunakan judul berbeda' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menambah artikel' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    const body = await req.json();
    const slug = generateSlug(body.title);

    await db.update(blogPosts).set({
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      tags: body.tags || null,
      status: body.status || 'draft',
      author: body.author || 'Admin Sundara',
      publishedAt: body.status === 'published' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    }).where(eq(blogPosts.id, Number(id)));

    return NextResponse.json({ success: true, message: 'Artikel berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui artikel' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    const updateData: Record<string, unknown> = { status };
    if (status === 'published') {
      updateData.publishedAt = new Date().toISOString();
    }

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, Number(id)));
    return NextResponse.json({ success: true, message: `Status artikel diubah ke ${status}` });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui artikel' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.delete(blogPosts).where(eq(blogPosts.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal menghapus artikel' }, { status: 500 });
  }
}
