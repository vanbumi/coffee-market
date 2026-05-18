import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { storeSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/settings
 * Ambil semua pengaturan sebagai object key-value
 */
export async function GET() {
  try {
    const rows = await db.select().from(storeSettings);
    // Convert to single object
    const data: Record<string, unknown> = {};
    rows.forEach((row) => {
      try {
        data[row.key] = JSON.parse(row.value);
      } catch {
        data[row.key] = row.value;
      }
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal mengambil pengaturan' }, { status: 500 });
  }
}

/**
 * POST /api/settings
 * Simpan semua pengaturan (upsert per key)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Iterate over all keys in body
    for (const [key, value] of Object.entries(body)) {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      // Check if key exists
      const existing = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);

      if (existing.length > 0) {
        // Update
        await db.update(storeSettings)
          .set({ value: stringValue, updatedAt: new Date().toISOString() })
          .where(eq(storeSettings.key, key));
      } else {
        // Insert
        await db.insert(storeSettings).values({
          key,
          value: stringValue,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Pengaturan berhasil disimpan' });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}
