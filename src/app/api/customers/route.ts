import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAnyAuth, requireWriteAccess } from '@/lib/auth-helpers';

/**
 * GET /api/customers — admin only (any role)
 */
export async function GET() {
  try {
    await requireAnyAuth();

    const allCustomers = await db
      .select()
      .from(customers)
      .orderBy(customers.createdAt);

    return NextResponse.json({
      success: true,
      data: allCustomers,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Gagal mengambil data customer:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data customer' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customers?id=123 — superuser only
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireWriteAccess();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID customer wajib diisi' },
        { status: 400 }
      );
    }

    const customerId = Number(id);
    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, message: 'ID customer tidak valid' },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer tidak ditemukan' },
        { status: 404 }
      );
    }

    await db.delete(customers).where(eq(customers.id, customerId));

    return NextResponse.json({
      success: true,
      message: `Customer "${existing[0].name}" berhasil dihapus`,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Gagal menghapus customer:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus customer' },
      { status: 500 }
    );
  }
}
