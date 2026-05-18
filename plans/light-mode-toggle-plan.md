# 🌗 Rencana Implementasi Light/Dark Mode Toggle

## 1. Gambaran Umum

Menambahkan **Light Mode** ke aplikasi "Sundara Coffee" yang saat ini 100% dark theme, dengan toggle switch di navigasi yang memungkinkan user beralih kapan saja. Preferensi akan tersimpan di `localStorage` dan menghormati preferensi sistem (`prefers-color-scheme`).

---

## 2. Arsitektur

### Pendekatan: CSS Custom Properties + Tailwind `darkMode: 'class'`

```
ThemeContext (React Context)
    ↓ read/write
localStorage ('coffee-theme')
    ↓
<html class="dark"> / <html> (no class)
    ↓
CSS Variables di :root vs .dark
    ↓
Semantic Tailwind classes di komponen
```

### Alur:

1. User klik toggle → `ThemeContext` update state
2. Set class `dark` pada `<html>` atau remove
3. Simpan preferensi ke `localStorage`
4. CSS variables react secara otomatis
5. Halaman render dengan warna yang sesuai

---

## 3. Color Palette Design

### Light Mode (`:root` default)

| Token            | CSS Variable                    | Warna      | Penggunaan              |
|------------------|---------------------------------|------------|-------------------------|
| `surface`        | `--color-surface`               | `#FFFFFF`  | Background utama        |
| `surface-alt`    | `--color-surface-alt`           | `#F9FAFB`  | Background sekunder     |
| `surface-card`   | `--color-surface-card`          | `#F3F4F6`  | Background card         |
| `surface-hover`  | `--color-surface-hover`         | `#E5E7EB`  | Hover state             |
| `text-primary`   | `--color-text-primary`          | `#111111`  | Teks utama              |
| `text-secondary` | `--color-text-secondary`        | `#6B7280`  | Teks muted              |
| `text-tertiary`  | `--color-text-tertiary`         | `#9CA3AF`  | Teks sangat muted       |
| `border`         | `--color-border`                | `#E5E7EB`  | Border default          |
| `border-hover`   | `--color-border-hover`          | `#D1D5DB`  | Border hover            |

### Dark Mode (`.dark`)

| Token            | CSS Variable                    | Warna      | Penggunaan              |
|------------------|---------------------------------|------------|-------------------------|
| `surface`        | `--color-surface`               | `#0A0A0A`  | Background utama        |
| `surface-alt`    | `--color-surface-alt`           | `#111111`  | Background sekunder     |
| `surface-card`   | `--color-surface-card`          | `#1A1A1A`  | Background card         |
| `surface-hover`  | `--color-surface-hover`         | `#2A2A2A`  | Hover state             |
| `text-primary`   | `--color-text-primary`          | `#FFFFFF`  | Teks utama              |
| `text-secondary` | `--color-text-secondary`        | `#A3A3A3`  | Teks muted              |
| `text-tertiary`  | `--color-text-tertiary`         | `#555555`  | Teks sangat muted       |
| `border`         | `--color-border`                | `#2A2A2A`  | Border default          |
| `border-hover`   | `--color-border-hover`          | `#3A3A3A`  | Border hover            |

### Gold (tetap sama di kedua theme)

- `gold`: `#D4AF37`
- `gold-light`: `#F3E5AB`
- `gold-dark`: `#B8960F`

---

## 4. File yang Perlu Diubah/Dibuat

### File Baru

| # | File | Tujuan |
|---|------|--------|
| 1 | `src/context/ThemeContext.tsx` | Context + Provider untuk theme state |

### File yang Dimodifikasi

| # | File | Perubahan |
|---|------|-----------|
| 1 | `tailwind.config.ts` | Add `darkMode: 'class'`, register CSS variable-based color tokens |
| 2 | `src/app/globals.css` | Define CSS variables untuk light (`:root`) dan dark (`.dark`) |
| 3 | `src/app/layout.tsx` | Wrap dengan `ThemeProvider`, add smooth transition on body |
| 4 | `src/components/Navbar.tsx` | Add toggle button (☀️/🌙 icon) di desktop & mobile nav |
| 5 | `src/components/Footer.tsx` | Replace hardcoded colors with semantic classes |
| 6 | `src/app/page.tsx` | Replace hardcoded colors (Hero, sections, cards) |
| 7 | `src/app/catalog/page.tsx` | Replace hardcoded colors |
| 8 | `src/app/product/[id]/page.tsx` | Replace hardcoded colors |
| 9 | `src/app/cart/page.tsx` | Replace hardcoded colors |
| 10 | `src/app/checkout/page.tsx` | Replace hardcoded colors |
| 11 | `src/app/order/success/page.tsx` | Replace hardcoded colors |
| 12 | `src/app/admin/dashboard/page.tsx` | Replace hardcoded colors |
| 13 | `src/app/admin/login/page.tsx` | Replace hardcoded colors |
| 14 | `src/components/ProductCard.tsx` | Replace hardcoded colors |
| 15 | `src/components/CategoryCard.tsx` | Replace hardcoded colors |
| 16 | `src/components/StatCard.tsx` | Replace hardcoded colors |
| 17 | `src/components/Toast.tsx` | Replace hardcoded colors |
| 18 | `src/components/FilterSidebar.tsx` | Replace hardcoded colors |
| 19 | `src/components/ProductGrid.tsx` | Replace hardcoded colors (skeleton) |
| 20 | `src/components/CartItem.tsx` | Replace hardcoded colors |
| 21 | `src/components/CartSummary.tsx` | Replace hardcoded colors |
| 22 | `src/components/CheckoutForm.tsx` | Replace hardcoded colors |
| 23 | `src/components/admin/SalesChart.tsx` | Replace hardcoded colors |
| 24 | `src/components/admin/ImageGallery.tsx` | Replace hardcoded colors |
| 25 | `src/components/admin/ProductManagement.tsx` | Replace hardcoded colors |

---

## 5. Detail Implementasi

### 5.1. ThemeContext (`src/context/ThemeContext.tsx`)

```tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('coffee-theme') as Theme | null;
    if (stored) {
      setThemeState(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setThemeState('light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('coffee-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

### 5.2. Tailwind Config (`tailwind.config.ts`)

```ts
darkMode: 'class',
// Dalam theme.extend.colors, tambahkan:
surface: {
  DEFAULT: 'var(--color-surface)',
  alt: 'var(--color-surface-alt)',
  card: 'var(--color-surface-card)',
  hover: 'var(--color-surface-hover)',
},
text: {
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-text-secondary)',
  tertiary: 'var(--color-text-tertiary)',
},
border: {
  DEFAULT: 'var(--color-border)',
  hover: 'var(--color-border-hover)',
},
```

### 5.3. CSS Variables (`src/app/globals.css`)

```css
:root {
  /* Light mode (default) */
  --color-surface: #FFFFFF;
  --color-surface-alt: #F9FAFB;
  --color-surface-card: #F3F4F6;
  --color-surface-hover: #E5E7EB;
  --color-text-primary: #111111;
  --color-text-secondary: #6B7280;
  --color-text-tertiary: #9CA3AF;
  --color-border: #E5E7EB;
  --color-border-hover: #D1D5DB;
}

.dark {
  /* Dark mode */
  --color-surface: #0A0A0A;
  --color-surface-alt: #111111;
  --color-surface-card: #1A1A1A;
  --color-surface-hover: #2A2A2A;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A3A3A3;
  --color-text-tertiary: #555555;
  --color-border: #2A2A2A;
  --color-border-hover: #3A3A3A;
}

body {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 5.4. Navbar Toggle Button

**Icon Sun/Moon SVG** — tambahkan di samping tombol Admin:

```tsx
// Di Navbar.tsx, setelah tombol Admin:
<button
  onClick={toggleTheme}
  className="p-2 text-[#A3A3A3] hover:text-gold hover:bg-[#1A1A1A] dark:hover:bg-surface-hover rounded-lg transition-all duration-300 border border-[#2A2A2A] dark:border-border"
  aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
>
  {theme === 'dark' ? (
    <svg className="w-5 h-5" ...>☀️ icon</svg>
  ) : (
    <svg className="w-5 h-5" ...>🌙 icon</svg>
  )}
</button>
```

### 5.5. Color Mapping — Aturan Konversi

Setiap kali menemui kode warna berikut, ganti dengan semantic class:

| Dark Hardcode        | Semantic Class (Light)          |
|----------------------|---------------------------------|
| `bg-[#0A0A0A]`       | `bg-surface`                    |
| `bg-[#111111]`       | `bg-surface-alt`                |
| `bg-[#1A1A1A]`       | `bg-surface-card`               |
| `bg-[#2A2A2A]`       | `bg-surface-hover`              |
| `text-white`         | `text-text-primary`             |
| `text-[#A3A3A3]`     | `text-text-secondary`           |
| `text-[#555555]`     | `text-text-tertiary`            |
| `border-[#2A2A2A]`   | `border-border`                 |
| `border-[#3A3A3A]`   | `border-border-hover`           |
| `from-[#0A0A0A]`     | `from-surface` *(gradient)*     |
| `via-[#111111]`      | `via-surface-alt` *(gradient)*  |

> **Catatan Khusus:** Gradient dan efek visual kompleks (seperti `bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]`) perlu di-handle manual dengan semantic colors atau dibuatkan CSS custom properties khusus.

---

## 6. Handling Gradient & Efek Khusus

Beberapa gradient kompleks yang perlu diperhatikan:

### 6.1. Hero Background (`page.tsx`)
```tsx
// Current:
<div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-[#0A0A0A]" />
// Light mode: ganti to-[#0A0A0A] menjadi to-white
// Gunakan: to-surface
```

### 6.2. Featured Products Section (`page.tsx`)
```tsx
// Current:
<section className="... bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]">
// Light: from-surface via-surface-alt to-surface
```

### 6.3. Newsletter Section (`page.tsx`)
```tsx
// Current:
<section className="... bg-gradient-to-b from-[#0A0A0A] to-[#1A1A0A]">
// Light: from-surface to-[#F5F0E0] (warm light gold tint)
```

### 6.4. Testimonials Background (`page.tsx`)
```tsx
// Current:
<section className="... bg-[#111111]">
// Light: bg-surface-alt
```

### 6.5. Admin Header Gradient
```tsx
// Current (admin dashboard):
<header className="bg-[#111111] border-b border-[#2A2A2A]">
// Light: bg-surface-alt border-b border-border
```

### 6.6. Dotted Pattern (hero, etc.)
```tsx
// Current: bg-dot-pattern uses gold dots on dark bg
// Light: perlu disesuaikan — gold dots tetap ok di light bg, atau buat var:
--color-dot: rgba(212,175,55,0.15); // sama untuk kedua mode
```

---

## 7. Potensi Masalah & Solusi

| Masalah | Solusi |
|---------|--------|
| **Flash of wrong theme** saat load | Gunakan inline script di `<head>` layout untuk set class sebelum React mount |
| **Gradient background** perlu adaptasi | Buat CSS custom properties khusus gradient atau gunakan `@apply` |
| **Transition flicker** | `transition-colors duration-300` pada body dan elemen utama |
| **Icon SVG color** perlu ikut berubah | Gunakan `currentColor` + `text-text-primary` pada SVG |
| **Skeleton loader** berwarna gelap | Gunakan `bg-surface-hover` untuk skeleton |

### Prevent Flash Script
Tambahkan di `layout.tsx` sebelum children:
```tsx
// Di dalam <html>, tambahkan <script>:
dangerouslySetInnerHTML={{
  __html: `
    (function() {
      var theme = localStorage.getItem('coffee-theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();
  `
}}
```

---

## 8. Urutan Implementasi (Todo)

### Phase 1 — Foundation
1. Update `tailwind.config.ts` — add `darkMode: 'class'` + semantic color tokens
2. Update `src/app/globals.css` — add CSS variables for light + dark + body transition
3. Create `src/context/ThemeContext.tsx` — ThemeProvider + useTheme hook
4. Update `src/app/layout.tsx` — wrap with ThemeProvider + flash prevention script

### Phase 2 — Navigasi
5. Update `src/components/Navbar.tsx` — add toggle button + semantic colors

### Phase 3 — Komponen (dari yang paling sering digunakan)
6. `Footer.tsx`
7. `ProductCard.tsx` + `ProductGrid.tsx`
8. `CategoryCard.tsx` + `StatCard.tsx`
9. `FilterSidebar.tsx`
10. `CartItem.tsx` + `CartSummary.tsx`
11. `CheckoutForm.tsx`
12. `Toast.tsx`

### Phase 4 — Halaman
13. `src/app/page.tsx` (Hero, sections, gradient)
14. `src/app/catalog/page.tsx`
15. `src/app/product/[id]/page.tsx`
16. `src/app/cart/page.tsx`
17. `src/app/checkout/page.tsx`
18. `src/app/order/success/page.tsx`

### Phase 5 — Admin
19. `src/app/admin/dashboard/page.tsx`
20. `src/app/admin/login/page.tsx`
21. `src/components/admin/SalesChart.tsx`
22. `src/components/admin/ImageGallery.tsx`
23. `src/components/admin/ProductManagement.tsx`
