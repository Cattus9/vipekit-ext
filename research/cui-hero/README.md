# Bedah hero CUI

Referensi pertama menetapkan bentuk Collection Vipekit. Sidebar memuat kategori, sedangkan area utama memuat judul, pencarian, pengalih grid/daftar, dan kartu tautan. Referensi kedua menunjukkan bagaimana pemandangan bisa menjadi latar yang hidup untuk bagian atas halaman. Riset ini mengambil efek visual dari referensi kedua sebagai bahan eksplorasi untuk layout pertama.

## Source yang diperiksa

Empat file dari [situs CUI](https://yappologistic.github.io/CUI/) cocok byte demi byte berdasarkan SHA-256 dengan file di commit [`86d9781`](https://github.com/yappologistic/CUI/commit/86d9781bbc3c35c264ec46287ad89c1d86a4c4de). File bisa dibaca langsung dari GitHub.

| File | Bagian yang relevan |
| --- | --- |
| [`app.js`](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/app.js#L757-L824) | Menyusun hero dan lapisan latar. Hero memanggil `ditherArt()` dengan `focusY: 0.3`, `gamma: 1.25`, dan `loop: true`. |
| [`dither.js`](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/dither.js) | Memuat foto, mengambil sampel, menghitung pola titik, dan mengatur siklus animasi. |
| [`style.css`](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/style.css#L441-L459) | Menempatkan canvas di belakang konten, meredam titik di balik teks, dan memudarkan bagian bawah. |
| [`tetons.jpg`](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/img/tetons.jpg) | Foto hitam-putih *The Tetons – Snake River* karya Ansel Adams (1942). [Katalog National Archives](https://www.archives.gov/research/still-pictures/highlights/the-tetons-snake-river) |

## Bagaimana pikselnya bekerja

1. **Foto menjadi grid.** Canvas kecil mengambil sampel foto dengan crop seperti `cover`. `focusY` mengatur posisi crop jika tinggi foto perlu dipotong. Tiap sel berukuran sekitar 2 piksel CSS dan dibulatkan ke jumlah piksel perangkat yang utuh. Karena fotonya grayscale, CUI bisa membaca tingkat terang dari kanal merah saja. Sampelnya disimpan dan dihitung ulang ketika ukuran berubah. [Pengambilan sampel](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/dither.js#L57-L96)
2. **Ordered dithering membentuk pemandangan.** Matriks Bayer 8 × 8 memberi ambang berbeda untuk setiap posisi dalam pola yang berulang. Sel muncul sebagai titik berwarna ketika nilainya melewati ambang, dan transparan di bawah ambang. Di dark mode, area terang menghasilkan lebih banyak titik. Di light mode, CUI membalik nilai terang sehingga area gelap menghasilkan lebih banyak titik. Warna titik dipilih dari palet yang berubah antara langit dan daratan. Canvas diperbesar dengan smoothing dimatikan agar tiap titik tetap tajam. [Matriks Bayer](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/dither.js#L8-L19), [Palet dan penggambaran](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/dither.js#L39-L129)
3. **Sapuan cahaya mengubah titik yang terlihat.** Saat halaman diam, koordinat tiap titik tetap. Gelombang kosinus diagonal berjalan dengan periode 14 detik dan mengubah nilai terang sebelum dibandingkan dengan ambang Bayer. Titik di jalurnya muncul dan menghilang sehingga pemandangan terasa bergerak. Loop menggambar ulang paling sering sekali tiap 50 ms, sekitar 20 fps sebagai batas atas. Loop berhenti ketika canvas keluar dari viewport, tab tersembunyi, atau pengaturan reduced motion aktif. [Loop animasi](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/dither.js#L98-L160)
4. **Scroll dan CSS membentuk gerak lapisan.** Saat scroll, lapisan canvas digeser sebesar `0.35 × scrollY` ke bawah relatif terhadap halaman, sehingga ia bergerak lebih lambat daripada konten, lalu memudar. CSS menambahkan fade vertikal dan mask radial yang menipiskan titik di belakang teks. Canvas masuk dengan transisi opacity sekitar 1,1 detik sebelum sapuan mulai. [Parallax](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/app.js#L869-L889), [Mask CSS](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/style.css#L445-L458), [Jeda sebelum animasi](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/web/site/js/dither.js#L131-L147)

## Eksplorasi untuk Collection Vipekit

Untuk MVP, kandidat yang paling dekat dengan gambar Collection adalah **hero pendek di area judul “Semua tautan”**, terbatas pada panel utama. Teks dan pencarian tetap mudah ditemukan, sidebar mempertahankan kategorinya, dan gambar memudar sebelum baris kartu pertama. Foto lanskap dengan siluet yang jelas bisa diolah memakai warna aksen Vipekit. Di layar kecil, gunakan crop dengan fokus yang disesuaikan agar bentuk pemandangan tetap terbaca.

Mulai eksperimen dari satu frame dither statis dan cek keterbacaan judul, pencarian, serta posisi kartu pertama di desktop dan ponsel. Tambahkan sapuan diagonal setelah komposisinya pas, lalu lihat apakah parallax masih memberi efek yang cukup terasa untuk hero sependek itu. Frame statis juga bisa menjadi versi reduced motion. Jika Vipekit nanti punya beranda untuk Pack, hero yang lebih tinggi bisa diuji di sana tanpa menambah jarak ke kartu Collection.

## Fetch, clone, dan REA

Fetch langsung sudah cukup untuk penelusuran ini karena source yang terbaca cocok dengan aset yang disajikan situs. `git clone` baru berguna jika kita ingin menjalankan build CUI sendiri atau menelusuri riwayat efeknya secara lokal. REA (*Reverse Engineer Anything*) bisa membantu menelusuri perilaku situs ketika hanya ada build atau bundle. Di sini fungsi pembentuk pola, CSS, dan foto bisa dibaca langsung. [Dokumentasi REA](https://github.com/morluto/rea), [Workflow build CUI](https://github.com/yappologistic/CUI/blob/86d9781bbc3c35c264ec46287ad89c1d86a4c4de/.github/workflows/pages.yml)

Verifikasi tahap ini dilakukan lewat pembacaan source dan perbandingan file dengan situs yang dipublikasikan. Arah layout Vipekit di atas masih berupa usulan desain.
