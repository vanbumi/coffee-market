import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { coupons } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(coupons).orderBy(coupons.createdAt);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal mengambil kupon' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await db.insert(coupons).values({
      code: body.code,
      type: body.type,
      value: body.value,
      minPurchase: body.minPurchase || 0,
      maxUses: body.maxUses || 100,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
    }).returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('UNIQUE')) {
      return NextResponse.json({ success: false, message: 'Kode kupon sudah ada' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menambah kupon' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive } = body;
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.update(coupons).set({ isActive: isActive ? 1 : 0 }).where(eq(coupons.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Status kupon diperbarui' });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui kupon' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.delete(coupons).where(eq(coupons.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Kupon berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal menghapus kupon' }, { status: 500 });
  }
}
