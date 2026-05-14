import { NextRequest, NextResponse } from 'next/server';
import { getDynamicProducts, saveDynamicProducts } from '@/utils/productStore';

/**
 * DELETE /api/products/[id]
 * Menghapus produk dinamis (dari admin) berdasarkan ID
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const existingProducts = getDynamicProducts();

    const productIndex = existingProducts.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    const deletedProduct = existingProducts[productIndex];
    const updatedProducts = existingProducts.filter((p) => p.id !== id);
    saveDynamicProducts(updatedProducts);

    return NextResponse.json({
      success: true,
      message: `Produk "${deletedProduct.name}" berhasil dihapus`,
      data: deletedProduct,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}
