import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/reviews/public — PUBLIC (no auth required)
 * Returns only approved reviews for display on the store frontend.
 * Limited to 10 most recent entries.
 */
export async function GET() {
  try {
    const data = await db
      .select()
      .from(reviews)
      .where(eq(reviews.status, 'approved'))
      .orderBy(reviews.createdAt)
      .limit(10);

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil reviews' },
      { status: 500 },
    );
  }
}
