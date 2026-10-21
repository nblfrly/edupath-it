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
| 3 | Akun dan Progres Belajar | Memungkinkan mahasiswa login, mengikuti jalur karier, serta menyimpan progres keterampilan. |
| 4 | Review CV dan Portofolio AI | Memberikan masukan mengenai kelebihan, kekurangan, dan bagian CV atau portofolio yang perlu diperbaiki. |
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
- **Integrasi AI:** API AI yang akan ditentukan setelah riset dan pengujian awal.

## Struktur Database Awal

Database `edupath_it` telah dibuat dengan enam tabel:

| Tabel | Fungsi |
|---|---|
| `users` | Menyimpan data akun pengguna dan admin. |
| `programs` | Menyimpan informasi bootcamp, beasiswa, dan pelatihan. |
| `pathways` | Menyimpan data jalur karier IT. |
| `pathway_skills` | Menyimpan daftar keterampilan dalam setiap jalur karier. |
| `user_pathways` | Menyimpan jalur karier yang diikuti pengguna. |
| `user_pathway_skill_progress` | Menyimpan status penyelesaian keterampilan pengguna. |

Struktur database ini merupakan rancangan awal dan dapat disesuaikan berdasarkan kebutuhan sistem yang telah disepakati.

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
- [ ] Menyelesaikan dan mendokumentasikan ERD.
- [ ] Menyelesaikan fitur CRUD data program.
- [ ] Mengembangkan fitur pencarian dan filter.
- [ ] Mengembangkan autentikasi dan progres belajar.
- [ ] Menguji kelayakan integrasi API AI.
- [ ] Melakukan pengujian dan persiapan demo proyek.

## Tujuan Pengembangan

EduPath IT dikembangkan sebagai proyek kelompok pada mata kuliah Pengembangan Aplikasi Berbasis Web (PABW) yang terintegrasi dengan proyek pada mata kuliah Manajemen Pengembangan Teknologi Informasi (MPTI).

Repository ini digunakan untuk menyimpan source code, dokumentasi, rancangan database, dan perkembangan implementasi proyek secara kolaboratif.
