import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { requireWriteAccess } from '@/lib/auth-helpers';

/**
 * GET /api/products
 * Mengembalikan semua produk dari database Turso (PUBLIC - store frontend)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    if (source === 'dynamic') {
      const { getDynamicProducts } = await import('@/utils/productStore');
      return NextResponse.json({
        success: true,
        data: getDynamicProducts(),
      });
    }

    const allProducts = await db.select().from(products);
    return NextResponse.json({
      success: true,
      data: allProducts.map((p) => ({
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
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Menambahkan produk baru — superuser only
 */
export async function POST(request: NextRequest) {
  try {
    await requireWriteAccess();

    const body = await request.json();

    const requiredFields = ['name', 'price', 'origin', 'type'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Field "${field}" wajib diisi` },
          { status: 400 }
        );
      }
    }

    const validTypes = ['Arabica', 'Robusta', 'Blend'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, message: 'Tipe kopi harus Arabica, Robusta, atau Blend' },
        { status: 400 }
      );
    }

    const newProduct = await db.insert(products).values({
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
    }).returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Produk berhasil ditambahkan',
        data: newProduct[0],
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error adding product:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan produk' },
      { status: 500 }
    );
  }
}
