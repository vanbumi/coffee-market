import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireWriteAccess } from '@/lib/auth-helpers';

/**
 * GET /api/categories — PUBLIC (used by store frontend filters)
 */
export async function GET() {
  try {
    const data = await db.select().from(categories).orderBy(categories.name);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal mengambil kategori' }, { status: 500 });
  }
}

/**
 * POST /api/categories — superuser only
 */
export async function POST(req: NextRequest) {
  try {
    await requireWriteAccess();

    const body = await req.json();
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const result = await db.insert(categories).values({
      name: body.name,
      slug,
      description: body.description || null,
      image: body.image || null,
    }).returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: unknown) {
    if (error instanceof Response) throw error;
    if (error instanceof Error && error.message?.includes('UNIQUE')) {
      return NextResponse.json({ success: false, message: 'Kategori dengan nama tersebut sudah ada' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menambah kategori' }, { status: 500 });
  }
}

/**
 * DELETE /api/categories — superuser only
 */
export async function DELETE(req: NextRequest) {
  try {
    await requireWriteAccess();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.delete(categories).where(eq(categories.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal menghapus kategori' }, { status: 500 });
  }
}
