import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(reviews).orderBy(reviews.createdAt);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal mengambil reviews' }, { status: 500 });
  }
}

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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.update(reviews).set({ status }).where(eq(reviews.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Status review diperbarui' });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.delete(reviews).where(eq(reviews.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Review berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal menghapus review' }, { status: 500 });
  }
}
