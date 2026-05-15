import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * DELETE /api/products/[id]
 * Menghapus produk dari database Turso berdasarkan ID
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'ID produk tidak valid' },
        { status: 400 }
      );
    }

    // Cari produk yang akan dihapus
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus dari database
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      message: `Produk "${existingProduct[0].name}" berhasil dihapus`,
      data: existingProduct[0],
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}
