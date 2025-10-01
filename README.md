# AnimeLogger (Anime Watchlist)

Aplikasi Next.js untuk mencatat dan melacak anime favoritmu. UI ringan dengan tema anime, dilengkapi form CRUD, statistik sederhana, ekspor CSV, dan AI header bar "AniSensei".

## Requirements

- Node.js 18.18+ atau 20+ (disarankan LTS)
- npm 9+ / pnpm 8+ / yarn 1+ (gunakan salah satu)
- Git (opsional, untuk clone repo)

Optional (hanya jika kamu ingin fitur AI/dev server Genkit):
- JavaScript/TypeScript runtime untuk Genkit: sudah termasuk via `tsx`
- API key model (mis. Google AI Studio) jika mengaktifkan AI

## Getting Started

1. Instal dependencies:
   - npm: `npm install`
   - pnpm: `pnpm install`
   - yarn: `yarn`

2. Jalankan development server:
   - `npm run dev` (port default: 9002)

3. Buka `http://localhost:9002`.

## Scripts

- `dev`  — menjalankan Next.js dev server (Turbopack)
- `build` — produksi build Next.js
- `start` — menjalankan server produksi
- `lint`  — menjalankan Next lint
- `typecheck` — cek tipe TypeScript
- `genkit:dev` / `genkit:watch` — dev server untuk AI (opsional)

## Konfigurasi Penting

- Font: `Noto Sans JP` dan `Rampart One` dimuat di `src/app/layout.tsx`.
- Tailwind: kustom tema (warna primary/accent, dark mode) di `tailwind.config.ts` dan `src/app/globals.css`.
- Gambar eksternal: domain yang diizinkan di `next.config.ts` (`placehold.co`, `images.unsplash.com`, `picsum.photos`). Jika menambah domain lain, update bagian `images.remotePatterns`.

## Struktur Proyek (ringkas)

- `src/app` — halaman Next.js (App Router)
- `src/components` — komponen UI (watchlist, form, AI bar, dsb.)
- `src/lib` — types dan utilitas
- `src/hooks` — custom hooks
- `prisma` — seed/db dev (opsional, tidak wajib untuk fitur watchlist lokal)

## Fitur

- Tambah/Edit/Hapus anime (disimpan di Local Storage)
- Filter judul, status, rating 0–10 (0 = Not Rated)
- Stat ringkas & tier progress
- Ekspor watchlist ke CSV (lihat endpoint `/api/export.csv`)
- AI top bar "AniSensei" (non-intrusive, dapat toggle)

## Deploy

Build lalu jalankan:

```
npm run build
npm start
```

Untuk hosting (Vercel/Cloud Run/App Hosting), pastikan environment memenuhi versi Node di atas dan domain gambar sudah diizinkan.

## Catatan

- Jika `coverImage` tidak valid, app otomatis fallback ke `picsum.photos` untuk mencegah error URL.
- Tipe `Anime` ada di `src/lib/types.ts`.
