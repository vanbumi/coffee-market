import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAnyAuth, requireWriteAccess } from '@/lib/auth-helpers';

/**
 * GET /api/reviews — admin only (any role)
 */
export async function GET() {
  try {
    await requireAnyAuth();

    const data = await db.select().from(reviews).orderBy(reviews.createdAt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal mengambil reviews' }, { status: 500 });
  }
}

/**
 * POST /api/reviews — PUBLIC (customer review submission from store frontend)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await db.insert(reviews).values({
      productId: body.productId,
      productName: body.productName || null,
      customerName: body.customerName,
      rating: body.rating,
      comment: body.comment,
      status: 'pending',
    }).returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal menambah review' }, { status: 500 });
  }
}

/**
 * PATCH /api/reviews — superuser only
 */
export async function PATCH(req: NextRequest) {
  try {
    await requireWriteAccess();

    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.update(reviews).set({ status }).where(eq(reviews.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Status review diperbarui' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal memperbarui review' }, { status: 500 });
  }
}

/**
 * DELETE /api/reviews — superuser only
 */
export async function DELETE(req: NextRequest) {
  try {
    await requireWriteAccess();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.delete(reviews).where(eq(reviews.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Review berhasil dihapus' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return NextResponse.json({ success: false, message: 'Gagal menghapus review' }, { status: 500 });
  }
}
