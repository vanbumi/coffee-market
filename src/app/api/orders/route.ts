import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAnyAuth, requireWriteAccess } from '@/lib/auth-helpers';

/**
 * POST /api/orders
 * Membuat order baru dari checkout (PUBLIC — no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    const { order, items } = await request.json();

    const requiredOrderFields = ['customerName', 'customerPhone', 'customerAddress', 'totalAmount', 'shippingCost'];
    for (const field of requiredOrderFields) {
      if (!order[field]) {
        return NextResponse.json(
          { success: false, message: `Field order "${field}" wajib diisi` },
          { status: 400 }
        );
      }
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Minimal 1 item dalam order' },
        { status: 400 }
      );
    }

    const orderNumber = `SC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
    if (error instanceof Response) throw error;
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Daftar semua order — admin only (any role)
 */
export async function GET() {
  try {
    await requireAnyAuth();

    const allOrders = await db.select().from(orders);
    return NextResponse.json({
      success: true,
      data: allOrders,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pesanan' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders
 * Update status order — superuser only
 */
export async function PATCH(request: NextRequest) {
  try {
    await requireWriteAccess();

    const body = await request.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });

    await db.update(orders).set({ status }).where(eq(orders.id, Number(id)));
    return NextResponse.json({ success: true, message: 'Status pesanan diperbarui' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui pesanan' },
      { status: 500 }
    );
  }
}
