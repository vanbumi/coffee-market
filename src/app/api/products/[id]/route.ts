import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireWriteAccess } from '@/lib/auth-helpers';

/**
 * GET /api/products/[id]
 * Ambil detail satu produk (PUBLIC - store frontend)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(params.id)))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    const p = product[0];
    return NextResponse.json({
      success: true,
      data: {
        id: String(p.id),
        name: p.name,
        origin: p.origin,
        region: p.region || 'Indonesia',
        type: p.type,
        price: p.price,
        rating: p.rating || 0,
        images: p.images ? JSON.parse(p.images) : [],
        description: p.description || '',
        altitude: '-',
        processing: p.processing || 'natural',
        roastLevel: 'medium',
        tastingNotes: p.tastingNotes ? JSON.parse(p.tastingNotes) : [],
        stock: p.inStock || 0,
        featured: p.featured === 1,
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Update produk — superuser only
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireWriteAccess();

    const body = await request.json();

    await db.update(products).set({
      name: body.name,
      origin: body.origin,
      region: body.region || 'Indonesia',
      type: body.type,
      price: Number(body.price),
      images: body.images ? JSON.stringify(body.images) : '[]',
      description: body.description || '',
      tastingNotes: body.tastingNotes ? JSON.stringify(body.tastingNotes) : '[]',
      processing: body.processing || 'natural',
      rating: Number(body.rating) || 0,
      featured: body.featured ? 1 : 0,
      inStock: Number(body.stock) || 0,
    }).where(eq(products.id, Number(params.id)));

    return NextResponse.json({ success: true, message: 'Produk berhasil diperbarui' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui produk' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Hapus produk — superuser only
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireWriteAccess();

    await db.delete(products).where(eq(products.id, Number(params.id)));

    return NextResponse.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}
