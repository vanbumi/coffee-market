import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAnyAuth, requireWriteAccess } from '@/lib/auth-helpers';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * GET /api/blog — admin only (any role)
 */
export async function GET() {
  try {
    await requireAnyAuth();

    const data = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal mengambil artikel' }, { status: 500 });
  }
}

/**
 * POST /api/blog — superuser only
 */
export async function POST(req: NextRequest) {
  try {
    await requireWriteAccess();

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
    if (error instanceof Response) throw error;
    if (error instanceof Error && error.message?.includes('UNIQUE')) {
      return NextResponse.json({ success: false, message: 'Slug artikel sudah ada, gunakan judul berbeda' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menambah artikel' }, { status: 500 });
  }
}

/**
 * PUT /api/blog — superuser only
 */
export async function PUT(req: NextRequest) {
  try {
    await requireWriteAccess();

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
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal memperbarui artikel' }, { status: 500 });
  }
}

/**
 * PATCH /api/blog — superuser only
 */
export async function PATCH(req: NextRequest) {
  try {
    await requireWriteAccess();

    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    const updateData: Record<string, unknown> = { status };
    if (status === 'published') {
      updateData.publishedAt = new Date().toISOString();
    }

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, Number(id)));
    return NextResponse.json({ success: true, message: `Status artikel diubah ke ${status}` });
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal memperbarui artikel' }, { status: 500 });
  }
}

/**
 * DELETE /api/blog — superuser only
 */
export async function DELETE(req: NextRequest) {
  try {
    await requireWriteAccess();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.delete(blogPosts).where(eq(blogPosts.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal menghapus artikel' }, { status: 500 });
  }
}
