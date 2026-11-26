# EduPath IT

**Platform Informasi Pendidikan dan Pengembangan Karier di Bidang IT**

EduPath IT adalah platform berbasis web yang dirancang untuk membantu mahasiswa menemukan peluang pengembangan kemampuan dan karier di bidang Information Technology (IT). Platform ini menyediakan informasi bootcamp, beasiswa, dan pelatihan, panduan jalur karier IT, pelacakan progres belajar, serta rencana fitur review CV dan portofolio berbasis AI.

## Latar Belakang

Mahasiswa yang ingin mengembangkan kemampuan dan mempersiapkan karier di bidang IT perlu mencari berbagai informasi dari sumber yang berbeda. Informasi mengenai bootcamp, beasiswa, pelatihan, jalur karier, dan keterampilan yang perlu dipelajari dapat tersebar di berbagai platform sehingga proses pencarian dan penentuan langkah belajar menjadi kurang praktis.

EduPath IT dirancang sebagai salah satu alternatif untuk membantu mahasiswa menemukan informasi tersebut dan merencanakan pengembangan keterampilannya dalam satu platform.

*Catatan: rumusan masalah ini merupakan identifikasi awal dan perlu divalidasi berdasarkan pembahasan MPTI serta hasil pengamatan atau wawancara pengguna.*

## Proses Bisnis

Proses bisnis utama yang diangkat dalam proyek ini adalah **pengembangan kesiapan karier mahasiswa di bidang IT**.

Rancangan awal proses yang akan didukung melalui digitalisasi meliputi:

1. **Pencarian peluang pengembangan karier IT**  
   Mahasiswa mencari informasi bootcamp, beasiswa, dan pelatihan, membandingkan informasi yang tersedia, lalu memilih peluang yang sesuai dengan kebutuhannya.

2. **Perencanaan dan pemantauan pengembangan keterampilan**  
   Mahasiswa mengeksplorasi jalur karier IT, mempelajari keterampilan yang dibutuhkan, dan menyimpan progres belajar agar dapat melanjutkan proses pengembangannya.

3. **Persiapan CV dan portofolio untuk peluang karier**  
   Mahasiswa meninjau CV atau portofolionya untuk mengetahui bagian yang perlu diperbaiki sebelum melamar program atau kesempatan karier.

Ketiga alur tersebut merupakan rancangan awal yang perlu disepakati dan divalidasi bersama tim.

## Masalah yang Diidentifikasi

Mahasiswa yang ingin mengembangkan kemampuan dan karier di bidang IT dapat mengalami kesulitan menemukan dan membandingkan informasi peluang belajar serta menentukan keterampilan yang perlu dipelajari karena informasi tersedia di berbagai sumber.

Dampak yang mungkin timbul antara lain:
- Waktu yang dibutuhkan untuk mencari dan membandingkan informasi menjadi lebih banyak.
- Mahasiswa berisiko melewatkan kesempatan pendaftaran karena tidak mengetahui informasi atau tenggatnya.
- Mahasiswa mengalami kesulitan menentukan jalur pengembangan keterampilan yang sesuai dengan tujuan karier.

## Tujuan Proyek

EduPath IT bertujuan untuk:

- Mempermudah mahasiswa menemukan informasi peluang belajar dan pengembangan karier IT.
- Membantu mahasiswa memahami jalur karier serta keterampilan yang dibutuhkan.
- Memungkinkan mahasiswa menyimpan dan memantau progres belajar.
- Memberikan dukungan awal untuk evaluasi CV atau portofolio melalui AI, jika integrasinya memenuhi kebutuhan dan ruang lingkup proyek.

## Pengguna Sistem

### 1. Mahasiswa atau Pengunjung
Pengguna yang mencari informasi program, mengeksplorasi jalur karier IT, dan menggunakan fitur pengembangan keterampilan. Pengunjung tidak perlu login untuk menjelajahi informasi; login diperlukan untuk menyimpan progres belajar.

### 2. Admin
Pengguna yang bertanggung jawab mengelola informasi program agar data yang tersedia di direktori tetap relevan dan terpelihara.

## Fitur yang Direncanakan

| No. | Fitur | Deskripsi |
|---|---|---|
| 1 | Direktori Program | Menampilkan informasi bootcamp, beasiswa, dan pelatihan IT, termasuk pencarian, filter, detail, dan tautan pendaftaran. |
| 2 | Jalur Karier IT | Menampilkan jalur karier dan keterampilan yang perlu dipelajari. |
| 3 | Akun dan Progres Belajar | Pengguna masuk melalui Google atau email dan kata sandi, lalu bisa menyimpan progres per skill. |
| 4 | Review CV dengan AI | Pengguna memilih jalur dan 1–3 pengecekan untuk satu PDF maksimal 4 MB. Hasilnya dapat dibuka kembali di History. |
| 5 | Manajemen Program oleh Admin | Memungkinkan admin menambah, menampilkan, mengubah, dan menghapus data program. |

Fitur-fitur tersebut masih merupakan rancangan awal. Ruang lingkup versi pertama akan disesuaikan dengan hasil pembahasan tim dan feedback asisten.

## Ruang Lingkup Awal

Proyek difokuskan pada pengembangan platform web dengan fungsi utama untuk pencarian program, panduan jalur karier, penyimpanan progres belajar, pengelolaan data program, dan rencana integrasi AI.

Pengembangan belum mencakup sistem rekrutmen kerja, pembayaran program, pendaftaran langsung ke seluruh penyedia, maupun platform pembelajaran lengkap dengan video dan kuis.

## Teknologi yang Digunakan

Teknologi awal yang digunakan atau direncanakan:

- **Backend:** PHP.
- **Database:** MySQL atau MariaDB yang kompatibel dengan kebutuhan aplikasi.
- **Frontend:** HTML, CSS, dan JavaScript.
- **Lingkungan pengembangan lokal:** MAMP.
- **Version control dan kolaborasi:** Git dan GitHub.
- **Integrasi AI:** Gemini untuk review CV.

## Penyimpanan data

Lihat [diagram relasi entitas EduPath IT](docs/erd/ERD.png) untuk menelusuri sembilan tabel dan dua belas relasi. [Sumber Mermaid](docs/erd/EduPath-IT.mmd) dapat diedit saat skema berubah.

Untuk instalasi baru, impor [skema lengkap](database/schema.sql) melalui tab **Import** di phpMyAdmin. Untuk database `edupath_it` dengan enam tabel awal, impor [migrasi 001](database/migrations/001_expand_edupath.sql), kemudian [migrasi 002 untuk batas History](database/migrations/002_limit_cv_review_history.sql). Jika migrasi 001 sudah diterapkan, cukup impor migrasi 002. Keduanya mempertahankan data lama dan dapat dijalankan ulang.

| Tabel | Fungsi |
|---|---|
| `users` | Akun pengguna dan admin. Satu akun dapat memiliki hash kata sandi, ID Google unik (`google_sub`), atau keduanya. |
| `programs` | Informasi resmi program, jenis dan nominal biaya, mata uang, durasi, pola belajar, syarat, status dan tenggat pendaftaran, serta waktu verifikasi. |
| `pathways` | Jalur karier IT beserta tautan referensinya. |
| `program_pathways` | Pasangan unik program dan jalur. Satu program bisa tampil pada beberapa roadmap dengan catatan relevansi masing-masing, misalnya skill yang dipelajari. |
| `pathway_skills` | Menyimpan daftar keterampilan dalam setiap jalur karier. |
| `user_pathways` | Menyimpan jalur karier yang diikuti pengguna. |
| `user_pathway_skill_progress` | Menyimpan status penyelesaian keterampilan pengguna. |
| `cv_reviews` | Satu baris per pengiriman yang selesai, berisi pemilik, jalur, waktu, skor tiap pengecekan, rata-rata, dan umpan balik dalam JSON. |
| `program_candidates` | Antrean usulan agen beserta tautan sumber, data yang diusulkan, status kurasi, dan keputusan admin. |

**Kartu program.** Gunakan `fee_type` untuk label gratis, berbayar, atau belum diketahui. Program berbayar dapat masuk meski penyedia belum mengumumkan nominalnya. `schedule_type` menjelaskan apakah peserta belajar mandiri atau mengikuti jadwal kelas. `deadline` dan `registration_status` menjelaskan pendaftaran. `is_active` mengatur visibilitas di direktori. Isi `verified_at` setelah memeriksa sumber resmi.

**History CV.** Backend menyimpan hasil setelah seluruh pengecekan yang dipilih selesai. Isi `score_1` sampai `score_3` sesuai urutan dan biarkan sisa kolom bernilai `NULL`. Database menghitung `check_count` dan `average_score`. Isi `feedback` dengan ringkasan, aspek penilaian, dan saran. PDF hanya diproses sementara. Ambil riwayat berdasarkan ID pengguna dari sesi login.

Setiap akun memiliki lima tempat di History. Satu pengiriman memakai satu tempat, termasuk saat pengguna memilih tiga pengecekan. Hasil tersimpan sampai pengguna memilih untuk menghapusnya. Pada halaman review, periksa kapasitas sebelum mengirim PDF ke Gemini. Saat penuh, arahkan pengguna ke History untuk memilih hasil yang akan dihapus. Database juga memeriksa kapasitas saat menyimpan hasil. Untuk penghapusan, gunakan `DELETE FROM cv_reviews WHERE id = ? AND user_id = ?` dengan ID pengguna dari sesi login. Akun lama yang sudah memiliki lebih dari lima hasil tetap dapat membacanya dan bisa menyimpan hasil baru setelah jumlahnya turun di bawah lima.

**Kurasi agen.** Gunakan identitas yang stabil untuk tiap angkatan. Hitung `source_key` sebagai SHA-256 biner atas kombinasi penyedia, ID program dari penyedia (atau URL kanonis), dan angkatan. Saat agen menemukan entri yang sama, perbarui `last_seen_at`. Jika isi usulan berubah, kembalikan ke `pending` dan kosongkan keputusan sebelumnya. Saat admin menyetujui usulan, simpan program, jalur terkait, dan keputusan kurasi dalam satu transaksi.

## Anggota Kelompok

| NIM | Nama | Tanggung Jawab Awal |
|---|---|---|
| 25523277 | M. Rizky Ramadhan | UI/UX Design |
| 25523145 | Nabil Farrely | Backend & Database |
| 25523008 | Raja Augustav Noer | Frontend |
| 25523185 | Farrel Priya Arka Agrapana | Frontend |

Pembagian tugas dapat disesuaikan berdasarkan kebutuhan pengembangan dan kesepakatan kelompok.

## Status Proyek

**Tahap: Pengembangan Awal**

Progres awal:
- [x] Membuat repository proyek lokal.
- [x] Membuat database `edupath_it` dan enam tabel awal.
- [x] Menguji koneksi PHP ke database MySQL.
- [x] Menyelesaikan dan mendokumentasikan ERD.
- [ ] Menyelesaikan fitur CRUD data program.
- [ ] Mengembangkan fitur pencarian dan filter.
- [ ] Mengembangkan autentikasi dan progres belajar.
- [ ] Menguji kelayakan integrasi API AI.
- [ ] Melakukan pengujian dan persiapan demo proyek.

## Tujuan Pengembangan

EduPath IT dikembangkan sebagai proyek kelompok pada mata kuliah Pengembangan Aplikasi Berbasis Web (PABW) yang terintegrasi dengan proyek pada mata kuliah Manajemen Pengembangan Teknologi Informasi (MPTI).

Repository ini digunakan untuk menyimpan source code, dokumentasi, rancangan database, dan perkembangan implementasi proyek secara kolaboratif.
