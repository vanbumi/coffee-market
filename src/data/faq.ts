export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqCategories = [
  { id: 'produk', label: 'Produk', icon: '🫘' },
  { id: 'pemesanan', label: 'Pemesanan', icon: '📝' },
  { id: 'pembayaran', label: 'Pembayaran', icon: '💳' },
  { id: 'pengiriman', label: 'Pengiriman', icon: '🚚' },
  { id: 'lainnya', label: 'Lainnya', icon: '❓' },
] as const;

export const faqData: FAQItem[] = [
  // ─── PRODUK ─────────────────────────────────
  {
    id: 'apa-itu-arabica',
    category: 'produk',
    question: 'Apa perbedaan kopi Arabica, Robusta, dan Blend?',
    answer:
      '**Arabica** — Kopi premium dengan acidity rendah, aroma kompleks, dan rasa halus. Tumbuh di dataran tinggi (1.200-1.900 masl). Cocok untuk manual brew.\n\n**Robusta** — Kopi dengan body kuat, kadar kafein lebih tinggi, dan rasa lebih pahit. Tumbuh di dataran rendah. Cocok untuk espresso atau campuran.\n\n**Blend** — Racikan spesial dari berbagai biji kopi pilihan yang menghasilkan keseimbangan sempurna antara acidity, body, dan rasa.',
  },
  {
    id: 'roast-level',
    category: 'produk',
    question: 'Apa itu Light Roast, Medium Roast, dan Dark Roast?',
    answer:
      '**Light Roast** — Dipanggang sebentar, warna cokelat muda. Mempertahankan acidity dan aroma asli biji. Cocok untuk pour-over dan manual brew.\n\n**Medium Roast** — Keseimbangan antara acidity dan body. Rasa lebih rounded, cocok untuk berbagai metode seduh.\n\n**Dark Roast** — Dipanggang lebih lama, warna gelap mengkilap. Body tebal, rasa smoky, cocok untuk espresso.',
  },
  {
    id: 'cara-pilih-kopi',
    category: 'produk',
    question: 'Bagaimana cara memilih kopi yang tepat untuk saya?',
    answer:
      'Beberapa tips memilih kopi:\n\n• **Pemula** — Mulai dengan Blend Signature atau Java Preanger (light-medium roast, balanced)\n• **Suka rasa kuat** — Pilih Mandheling atau Robusta Temanggung (dark roast, full body)\n• **Suka rasa fruity** — Coba Kintamani Bali atau Wamena Papua (light roast, fruity)\n• **Untuk espresso** — Mandheling atau Robusta cocok untuk base espresso\n• **Untuk manual brew** — Gayo Arabica, Lintong, atau Java Preanger',
  },
  {
    id: 'cara-simpan-kopi',
    category: 'produk',
    question: 'Bagaimana cara menyimpan biji kopi agar tetap segar?',
    answer:
      'Tips menyimpan biji kopi:\n\n1. Simpan di wadah **kedap udara** (airtight container)\n2. Jauhkan dari **sinar matahari langsung**\n3. Simpan di tempat **sejuk dan kering** (suhu ruang)\n4. **Jangan simpan di kulkas** — kelembaban merusak biji\n5. Gunakan dalam **2-4 minggu** setelah dibuka untuk kesegaran optimal\n6. Beli dalam jumlah sesuai kebutuhan, jangan stock terlalu banyak',
  },
  {
    id: 'produk-halal',
    category: 'produk',
    question: 'Apakah produk Sundara Coffee sudah bersertifikat halal?',
    answer:
      'Seluruh produk biji kopi yang kami jual adalah **100% halal** karena merupakan biji kopi murni tanpa campuran bahan lain. Kami sedang dalam proses pengurusan sertifikasi halal resmi dari MUI. Untuk saat ini, kami menjamin bahan baku kami berasal dari petani kopi pilihan Nusantara dengan proses yang bersih dan higienis.',
  },

  // ─── PEMESANAN ─────────────────────────────
  {
    id: 'cara-order',
    category: 'pemesanan',
    question: 'Bagaimana cara memesan di Sundara Coffee?',
    answer:
      'Cara memesan sangat mudah:\n\n1. **Jelajahi katalog** di halaman [Katalog](/catalog) — pilih produk kopi favorit Anda\n2. **Klik produk** untuk melihat detail, lalu pilih jumlah (kg) dan klik "Tambah ke Keranjang"\n3. **Buka halaman Keranjang** — review pesanan, masukkan kode voucher jika ada\n4. **Klik Checkout** — isi alamat pengiriman dan pilih metode pembayaran\n5. **Konfirmasi pesanan** — pesanan akan segera diproses\n\nAnda tidak perlu membuat akun untuk berbelanja!',
  },
  {
    id: 'minimal-order',
    category: 'pemesanan',
    question: 'Apakah ada minimal pembelian?',
    answer:
      'Tidak ada minimal pembelian! Anda bisa membeli **mulai dari 1 kg** untuk setiap varian kopi. Kami ingin memudahkan siapa saja untuk menikmati kopi Nusantara premium, baik untuk dicoba maupun untuk stock rutin.',
  },
  {
    id: 'order-status',
    category: 'pemesanan',
    question: 'Bagaimana cara cek status pesanan saya?',
    answer:
      'Saat ini Anda bisa melihat status pesanan melalui halaman **Order Success** setelah checkout. Nomor pesanan akan dikirimkan dan Anda bisa menghubungi kami via WhatsApp atau email untuk menanyakan status terbaru.\n\nFitur **Lacak Pesanan** akan segera hadir!',
  },
  {
    id: 'ubah-pesanan',
    category: 'pemesanan',
    question: 'Bisa mengubah atau membatalkan pesanan?',
    answer:
      '**Selama status masih "Pending"**, Anda bisa menghubungi kami untuk mengubah atau membatalkan pesanan. Hubungi kami secepat mungkin melalui:\n\n• **WhatsApp**: +62 812-3456-7890\n• **Email**: hello@sundaracoffee.com\n\nJika pesanan sudah diproses (status "Processing"), sayangnya kami tidak dapat mengubah atau membatalkan pesanan.',
  },

  // ─── PEMBAYARAN ────────────────────────────
  {
    id: 'metode-pembayaran',
    category: 'pembayaran',
    question: 'Apa saja metode pembayaran yang tersedia?',
    answer:
      'Kami menyediakan berbagai metode pembayaran:\n\n🏦 **Bank Transfer**:\n  • BCA — Bank Transfer BCA\n  • Mandiri — Bank Transfer Mandiri\n  • BNI — Bank Transfer BNI\n\n📱 **QRIS** — Scan QR code dari aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay, dll)\n\n💵 **COD (Bayar di Tempat)** — Bayar tunai saat pesanan diterima\n\nSemua transaksi aman dan terpercaya.',
  },
  {
    id: 'voucher-diskon',
    category: 'pembayaran',
    question: 'Apakah ada voucher atau diskon yang tersedia?',
    answer:
      'Tentu! Berikut voucher yang bisa Anda gunakan:\n\n• **COFFEE10** — Diskon **10%** untuk setiap pembelian!\n• **GRATISONGKIR** — **Gratis ongkos kirim** untuk pembelian minimal Rp500.000\n\nMasukkan kode voucher di halaman Keranjang sebelum checkout. Promo dapat berubah sewaktu-waktu, pantau terus Instagram kami @sundaracoffee untuk info terbaru!',
  },
  {
    id: 'keamanan-pembayaran',
    category: 'pembayaran',
    question: 'Apakah transaksi di Sundara Coffee aman?',
    answer:
      'Ya, keamanan adalah prioritas kami. Seluruh transaksi diproses secara aman. Informasi pembayaran Anda tidak disimpan di server kami. Untuk pembayaran QRIS menggunakan sistem pembayaran terenkripsi. Jika ada kendala, segera hubungi kami.',
  },

  // ─── PENGIRIMAN ────────────────────────────
  {
    id: 'lama-pengiriman',
    category: 'pengiriman',
    question: 'Berapa lama waktu pengiriman?',
    answer:
      'Estimasi pengiriman berdasarkan kurir:\n\n• **JNE Reguler** — 3-5 hari kerja\n• **JNE YES** — 1-2 hari kerja\n• **SiCepat** — 2-4 hari kerja\n• **J&T** — 2-5 hari kerja\n\nPesanan diproses dalam **1x24 jam** setelah pembayaran dikonfirmasi. Kami mengirimkan kopi dalam kemasan vakum untuk menjaga kesegaran.',
  },
  {
    id: 'biaya-pengiriman',
    category: 'pengiriman',
    question: 'Berapa biaya pengiriman?',
    answer:
      'Biaya pengiriman dihitung berdasarkan **berat (kg)** dengan minimum biaya:\n\n• **JNE Reguler** — Rp20.000/kg (min Rp30.000)\n• **JNE YES** — Rp50.000/kg (min Rp50.000)\n• **SiCepat** — Rp25.000/kg (min Rp35.000)\n• **J&T** — Rp18.000/kg (min Rp30.000)\n\nGunakan voucher **GRATISONGKIR** untuk pembelian minimal Rp500.000 dan dapatkan pengiriman gratis!',
  },
  {
    id: 'daerah-pengiriman',
    category: 'pengiriman',
    question: 'Apakah bisa dikirim ke seluruh Indonesia?',
    answer:
      'Ya, kami **mengirim ke seluruh Indonesia**! Mulai dari Aceh hingga Papua. Kami bekerja sama dengan jasa kirir ternama: JNE, SiCepat, dan J&T. Untuk daerah terpencil, estimasi waktu pengiriman mungkin lebih lama. Silakan hubungi kami jika ada pertanyaan tentang pengiriman ke daerah Anda.',
  },
  {
    id: 'kemasan-produk',
    category: 'pengiriman',
    question: 'Bagaimana kemasan produk saat dikirim?',
    answer:
      'Kami mengemas kopi dengan standar tertinggi:\n\n1. **Kemasan Vakum** — Biji kopi dikemas vakum untuk menjaga kesegaran\n2. **Lapisan Pelindung** — Dibungkus bubble wrap untuk melindungi dari benturan\n3. **Box Karton** — Dikemas dalam box karton kokoh\n4. **Label Handle With Care** — Setiap paket diberi label khusus\n\nKami juga menggunakan biji kopi yang baru di-roast, jadi Anda mendapatkan kopi dengan kualitas terbaik!',
  },

  // ─── LAINNYA ────────────────────────────────
  {
    id: 'wholesale',
    category: 'lainnya',
    question: 'Apakah ada harga khusus untuk pembelian grosir / kafe?',
    answer:
      'Ya! Kami menawarkan **harga khusus wholesale** untuk:\n\n• **Kafe dan Coffee Shop** — Harga reseller untuk pemakaian rutin\n• **Hotel dan Restoran** — Pasokan kopi berkualitas untuk kebutuhan bisnis\n• **Event dan Catering** — Pesanan dalam jumlah besar\n\nHubungi kami via **WhatsApp (+62 812-3456-7890)** atau **email (hello@sundaracoffee.com)** untuk mendapatkan penawaran khusus.',
  },
  {
    id: 'retur',
    category: 'lainnya',
    question: 'Apakah ada kebijakan retur atau pengembalian?',
    answer:
      'Kami menjamin kualitas produk. Namun jika ada masalah:\n\n• **Barang rusak saat pengiriman** — Kami akan mengganti penuh. Simpan dokumentasi (foto/video) unboxing\n• **Produk tidak sesuai pesanan** — Kami akan mengganti dengan produk yang benar\n• **Keluhan kualitas** — Hubungi kami dalam 2x24 jam setelah barang diterima\n\nKetentuan lengkap: Hubungi kami langsung agar kami bisa menyelesaikan masalah dengan cepat dan adil.',
  },
  {
    id: 'kerjasama',
    category: 'lainnya',
    question: 'Mau kerjasama atau jadi reseller, bagaimana caranya?',
    answer:
      'Kami terbuka untuk kerjasama! Beberapa peluang:\n\n🛒 **Reseller** — Jual kembali produk kami dengan harga khusus\n🤝 **Bisnis Partnership** — Kolaborasi untuk event atau program bersama\n📦 **Supplier untuk Kafe** — Pasokan rutin untuk bisnis kopi Anda\n\nSilakan hubungi kami di **hello@sundaracoffee.com** atau **WhatsApp +62 812-3456-7890** dengan subjek "Kerjasama". Tim kami akan menghubungi Anda!',
  },
  {
    id: 'saran-kritik',
    category: 'lainnya',
    question: 'Bagaimana cara menyampaikan saran atau kritik?',
    answer:
      'Kami sangat menghargai masukan dari pelanggan! Anda bisa menyampaikan saran dan kritik melalui:\n\n• **Form Kontak** di halaman ini — isi form di samping/kiri\n• **Email**: hello@sundaracoffee.com\n• **WhatsApp**: +62 812-3456-7890\n• **DM Instagram**: @sundaracoffee\n\nSetiap masukan akan kami baca dan jadikan bahan evaluasi untuk pelayanan yang lebih baik!',
  },
];
