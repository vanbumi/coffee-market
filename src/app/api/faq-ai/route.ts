import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { faqAiUsage } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface FaqAiBody {
  question: string;
  history?: ChatMessage[];
}

const SYSTEM_PROMPT = `Kamu adalah asisten virtual dari **Sundara Coffee**, sebuah premium coffee roastery Indonesia.

**Identitas & Tugasmu:**
- Kamu membantu pengunjung website menjawab pertanyaan seputar produk kopi, pemesanan, pembayaran, pengiriman, dan informasi umum tentang Sundara Coffee.
- Jawablah dengan ramah, informatif, dan menggunakan **Bahasa Indonesia** yang baik.
- Gunakan gaya bicara yang hangat seperti barista yang ramah.

**Produk yang dijual:**
- Kopi Arabica (Gayo, Lintong, Kintamani, Java Preanger, Wamena Papua, Flores Bajawa)
- Kopi Robusta (Temanggung, Lampung)
- Kopi Blend (Blend Signature, Blend Espresso)
- Tersedia dalam bentuk biji (whole bean) atau bubuk (ground coffee)
- Ukuran: 1 kg per paket

**Informasi Penting:**
- Harga mulai Rp85.000 - Rp145.000 per kg
- Pengiriman ke seluruh Indonesia via JNE, SiCepat, J&T
- Pembayaran: Bank Transfer (BCA, Mandiri, BNI), QRIS, COD
- Tidak ada minimal pembelian
- Voucher: COFFEE10 (diskon 10%), GRATISONGKIR (gratis ongkir min Rp500.000)
- Info lebih detail bisa cek halaman FAQ

**Aturan:**
1. Jika ditanya di luar konteks kopi atau Sundara Coffee, arahkan kembali ke topik.
2. Jika tidak tahu jawabannya, akui dan arahkan ke kontak WhatsApp/Email.
3. Jangan memberikan informasi palsu.
4. Jawab dengan singkat tapi informatif (maksimal 150 kata).
5. Jika pengguna bertanya tentang harga terbaru atau promo, arahkan untuk cek katalog di website.`;

function buildPrompt(question: string, history?: ChatMessage[]): { role: string; content: string }[] {
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // Add conversation history (last 4 messages to keep context)
  if (history && history.length > 0) {
    const recentHistory = history.slice(-4);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
  }

  // Add current question
  messages.push({ role: 'user', content: question });

  return messages;
}

/**
 * Get the client IP from request headers.
 * Supports various proxy headers (Cloudflare, Vercel, etc.)
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Get today's date as YYYY-MM-DD string in local timezone.
 */
function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the daily limit from env, default to 20 if not set.
 */
function getDailyLimit(): number {
  const envLimit = process.env.AI_FAQ_DAILY_LIMIT;
  if (envLimit) {
    const parsed = parseInt(envLimit, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 20; // default
}

/**
 * Check and increment usage for a given IP on today's date.
 * Returns the current count and whether the limit is exceeded.
 */
async function checkAndIncrementUsage(ip: string): Promise<{
  allowed: boolean;
  currentCount: number;
  limit: number;
}> {
  const today = getTodayDate();
  const limit = getDailyLimit();

  try {
    // Try to find existing record for this IP + date
    const existing = await db
      .select()
      .from(faqAiUsage)
      .where(and(eq(faqAiUsage.ip, ip), eq(faqAiUsage.date, today)))
      .limit(1);

    if (existing.length > 0) {
      const record = existing[0];

      if (record.count >= limit) {
        return { allowed: false, currentCount: record.count, limit };
      }

      // Increment count
      await db
        .update(faqAiUsage)
        .set({
          count: record.count + 1,
          lastUsedAt: sql`(CURRENT_TIMESTAMP)`,
        })
        .where(eq(faqAiUsage.id, record.id));

      return { allowed: true, currentCount: record.count + 1, limit };
    } else {
      // Create new record
      await db.insert(faqAiUsage).values({
        ip,
        date: today,
        count: 1,
      });

      return { allowed: true, currentCount: 1, limit };
    }
  } catch (err) {
    // If DB fails (e.g. table doesn't exist yet), allow the request to proceed gracefully
    console.error('FAQ AI usage tracking error:', err);
    return { allowed: true, currentCount: 0, limit };
  }
}

/**
 * Get usage info for display (without incrementing).
 */
async function getUsageInfo(ip: string): Promise<{
  count: number;
  limit: number;
  remaining: number;
  resetDate: string;
}> {
  const today = getTodayDate();
  const limit = getDailyLimit();

  try {
    const existing = await db
      .select()
      .from(faqAiUsage)
      .where(and(eq(faqAiUsage.ip, ip), eq(faqAiUsage.date, today)))
      .limit(1);

    const count = existing.length > 0 ? existing[0].count : 0;
    return {
      count,
      limit,
      remaining: Math.max(0, limit - count),
      resetDate: today,
    };
  } catch {
    return { count: 0, limit, remaining: limit, resetDate: today };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FaqAiBody = await request.json();
    const { question, history } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ error: 'Pertanyaan harus diisi' }, { status: 400 });
    }

    // --- Rate limit check ---
    const ip = getClientIp(request);
    const { allowed, currentCount, limit } = await checkAndIncrementUsage(ip);

    if (!allowed) {
      const remaining = 0;
      return NextResponse.json(
        {
          error: `Kamu sudah mencapai batas chat harian (${limit} pertanyaan/hari). Silakan coba lagi besok atau hubungi kami langsung via WhatsApp/Email.`,
          limit,
          remaining,
          resetDate: getTodayDate(),
        },
        { status: 429 }
      );
    }

    // --- Proceed with AI call ---
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-v4-flash';

    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not configured');
      return NextResponse.json(
        { error: 'Layanan AI belum dikonfigurasi. Silakan hubungi admin.' },
        { status: 500 }
      );
    }

    const messages = buildPrompt(question, history);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://sundaracoffee.com',
        'X-Title': 'Sundara Coffee - FAQ AI',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Layanan AI sedang sibuk. Silakan coba lagi.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: 'Tidak bisa mendapatkan jawaban. Silakan coba lagi.' },
        { status: 502 }
      );
    }

    const remaining = Math.max(0, limit - currentCount);
    return NextResponse.json({
      answer,
      limit,
      remaining,
      resetDate: getTodayDate(),
    });
  } catch (error) {
    console.error('FAQ AI error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint - returns current usage info without consuming quota.
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const info = await getUsageInfo(ip);
    return NextResponse.json(info);
  } catch (error) {
    console.error('FAQ AI usage info error:', error);
    return NextResponse.json(
      { error: 'Gagal mendapatkan informasi penggunaan.' },
      { status: 500 }
    );
  }
}
