import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/product';
import { getDynamicProducts, saveDynamicProducts, getAllProducts } from '@/utils/productStore';

/**
 * GET /api/products
 * Mengembalikan semua produk (statis + dinamis)
 * Atau jika query ?source=dynamic, hanya produk dari admin
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    if (source === 'dynamic') {
      return NextResponse.json({
        success: true,
        data: getDynamicProducts(),
      });
    }

    // Default: return all products (static + dynamic)
    const allProducts = getAllProducts();
    return NextResponse.json({
      success: true,
      data: allProducts,
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
 * Menambahkan produk baru ke penyimpanan dinamis (products.json)
 * 
 * Body: Omit<Product, 'id'> (id akan digenerate otomatis)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi field wajib
    const requiredFields = ['name', 'price', 'origin', 'type'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Field "${field}" wajib diisi` },
          { status: 400 }
        );
      }
    }

    // Validasi tipe kopi
    const validTypes = ['Arabica', 'Robusta', 'Blend'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, message: 'Tipe kopi harus Arabica, Robusta, atau Blend' },
        { status: 400 }
      );
    }

    // Generate ID dari nama produk
    const id = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Cek duplikasi ID
    const existingDynamic = getDynamicProducts();
    if (existingDynamic.some((p) => p.id === id)) {
      return NextResponse.json(
        { success: false, message: `Produk dengan nama "${body.name}" sudah ada` },
        { status: 409 }
      );
    }

    // Buat objek produk baru
    const newProduct: Product = {
      id,
      name: body.name,
      origin: body.origin,
      region: body.region || 'Indonesia',
      type: body.type,
      price: Number(body.price),
      rating: Number(body.rating) || 0,
      images: body.images || [],
      description: body.description || '',
      altitude: body.altitude || '-',
      processing: body.processing || 'natural',
      roastLevel: body.roastLevel || 'medium',
      tastingNotes: body.tastingNotes || [],
      stock: Number(body.stock) || 0,
      featured: body.featured || false,
    };

    // Append ke array existing dan simpan
    const updatedProducts = [...existingDynamic, newProduct];
    saveDynamicProducts(updatedProducts);

    return NextResponse.json(
      {
        success: true,
        message: 'Produk berhasil ditambahkan',
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan produk' },
      { status: 500 }
    );
  }
}
