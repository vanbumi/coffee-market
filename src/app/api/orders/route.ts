import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';

/**
 * POST /api/orders
 * Membuat order baru beserta item-itemnya di database Turso
 *
 * Body: { order: { customerName, customerPhone, customerAddress, totalAmount, shippingCost, discount, paymentMethod }, items: Array<{ productId, productName, quantity, price }> }
 */
export async function POST(request: NextRequest) {
  try {
    const { order, items } = await request.json();

    // Validasi field wajib order
    const requiredOrderFields = ['customerName', 'customerPhone', 'customerAddress', 'totalAmount', 'shippingCost'];
    for (const field of requiredOrderFields) {
      if (!order[field]) {
        return NextResponse.json(
          { success: false, message: `Field order "${field}" wajib diisi` },
          { status: 400 }
        );
      }
    }

    // Validasi items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Minimal 1 item dalam order' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `SC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Insert order
    const newOrder = await db.insert(orders).values({
      orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      totalAmount: Number(order.totalAmount),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount) || 0,
      status: 'pending',
      paymentMethod: order.paymentMethod || 'transfer',
    }).returning();

    // Insert order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: newOrder[0].id,
        productId: Number(item.productId) || 0,
        productName: item.productName,
        quantity: Number(item.quantity),
        price: Number(item.price),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      orderId: newOrder[0].id,
      orderNumber: newOrder[0].orderNumber,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Mengembalikan daftar semua order (untuk admin dashboard)
 */
export async function GET() {
  try {
    const allOrders = await db.select().from(orders);
    return NextResponse.json({
      success: true,
      data: allOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pesanan' },
      { status: 500 }
    );
  }
}
