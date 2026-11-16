# Vipekit

## Produk dan rute

- `/` adalah landing page dengan hero Canvas 2D dan ordered dithering. Hero sementara menggunakan `public/images/nyc.jpg`. Foto Tetons dan nightmares tersimpan sebagai alternatif. Lihat [riset hero CUI](research/cui-hero/README.md).
- `/collection` adalah katalog tautan publik dan fokus MVP. Gunakan sidebar kategori, pencarian, dan tampilan grid/daftar. Data awal ada di `src/lib/collection.ts`. Ulasan pribadi bersifat opsional.
- `/docs` untuk skills dan prompt. `/showcase` untuk hasil eksperimen. Keduanya menampilkan status segera hadir selama dalam pengembangan.
- Topbar mengambil pola CUI berupa bar ringkas, wordmark, navigasi horizontal, dan indikator rute aktif. Tambahkan kontrol saat fungsinya tersedia.

## Normalisasi shadcn/ui

- Gunakan Next.js App Router, TypeScript, Tailwind CSS v4, dan shadcn/ui. Tambahkan primitif yang diperlukan lewat `npx shadcn add <component>`, lalu tinjau hasilnya sebelum dipakai. Simpan primitif di `src/components/ui` dan gunakan `cn` dari `@/lib/utils`.
- Jadikan `src/app/globals.css` sumber utama nilai visual. Deklarasikan palet dan skala di blok `:root`, `:root[data-theme="dark"]`, atau `@theme`, lalu hubungkan token semantik dengan `@theme inline`. Pertahankan kontrak penamaan shadcn/ui seperti `background`, `foreground`, `card`, `primary`, `muted`, `accent`, `border`, `input`, dan `ring`.
- Konsumsi token semantik seperti `bg-background`, `text-muted-foreground`, dan `border-border`. Gunakan skala Tailwind yang bernama untuk jarak dan ukuran. Hindari nilai visual literal dan arbitrary styling values di JSX, TSX, CSS, maupun style inline. Jika skala belum memuat nilai yang dibutuhkan, deklarasikan token di `globals.css` dan gunakan token tersebut. Arbitrary selector boleh dipakai untuk menyatakan struktur atau state, misalnya `aria-[current=page]`.
- Geist untuk judul dan teks display melalui `font-display`. Inter untuk body, subteks, label, dan navigasi melalui `font-sans`. Font disajikan lokal melalui Fontsource.
- Ambil karakter tipografi UIArc melalui Geist Regular pada hero, tracking lebih rapat untuk display, Inter Regular pada navigasi, dan Inter Medium pada tombol. Gunakan token `text-hero`, `text-section`, dan `text-nav` dari `globals.css`.
- Cek keterbacaan, focus-visible, dan layout pada layar kecil. Untuk animasi, sediakan varian reduced motion.

## Supabase dan Auth

- Salin `.env.example` ke `.env.local` dan isi `NEXT_PUBLIC_SUPABASE_URL` serta `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dari project Supabase. Home dan shell Collection bisa dijalankan sebelum project Supabase dihubungkan.
- Gunakan client SSR berbasis cookie di `src/lib/supabase/server.ts` dan browser client di `src/lib/supabase/client.ts`. `src/proxy.ts` menyegarkan sesi. Untuk aksi pengelola, verifikasi identitas di server dengan `getClaims()` dan terapkan izin di database lewat Row Level Security. Sesi login saja belum memberi hak pengelolaan.
- Simpan perubahan skema dan RLS sebagai migrasi SQL saat fitur database mulai dibuat. Arah MVP adalah pembacaan tautan terbit oleh publik dan perubahan data oleh akun pengelola. Simpan secret key di server jika suatu hari dibutuhkan.

## Hallmark

- Skill terpasang lokal di `.agents/skills/hallmark` dari commit `04977e15f3dfd6ee4b74c887dac3eb52665d6c92`. Di Codex, gunakan `$hallmark` untuk pekerjaan UI. Baca `SKILL.md` untuk alur desain, `redesign`, dan `audit`.
- Berikan tujuan halaman, referensi CUI atau Collection, serta aturan token dan tipografi repo ini dalam brief. Untuk Vipekit, gunakan arah custom dengan sistem yang sudah ditetapkan.
- Audit halaman Next.js dengan `node .agents/skills/hallmark/scripts/sloplint.mjs src --render --url http://localhost:3000`. Mode render memerlukan Chrome atau Chromium dan `puppeteer-core` yang bisa ditemukan Hallmark.

## Pengembangan lokal

Gunakan Node.js 24. Jalankan `npm ci`, lalu `npm run dev`. Verifikasi perubahan dengan `npm run build` dan `npm run typecheck`.
