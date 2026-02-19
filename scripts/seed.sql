-- Storage Bucket Setup
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'images' );
create policy "Authenticated Upload" on storage.objects for insert with check ( bucket_id = 'images' and auth.role() = 'authenticated' );
create policy "Authenticated Update" on storage.objects for update using ( bucket_id = 'images' and auth.role() = 'authenticated' );
create policy "Authenticated Delete" on storage.objects for delete using ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Seed Data for SMK Paramitha 2

-- Jurusan
INSERT INTO jurusan (name, slug, short_desc, icon, image_url, content) VALUES
('Rekayasa Perangkat Lunak', 'rpl', 'Mempelajari pengembangan software, web, dan aplikasi mobile.', 'code', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Program keahlian Rekayasa Perangkat Lunak (RPL) mempersiapkan siswa untuk menjadi tenaga ahli di bidang pemrograman komputer, pengembangan website, aplikasi mobile, dan sistem informasi.'),
('Teknik Komputer & Jaringan', 'tkj', 'Mempelajari instalasi jaringan, server, dan troubleshooting hardware.', 'server', 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Teknik Komputer dan Jaringan (TKJ) fokus pada perakitan komputer, instalasi jaringan LAN/WAN, konfigurasi router/switch, dan administrasi server.'),
('Multimedia', 'mm', 'Mempelajari desain grafis, fotografi, videografi, dan animasi.', 'camera', 'https://images.unsplash.com/photo-1626785774573-4b799312afc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Kompetensi Keahlian Multimedia mempelajari tentang pengolahan citra digital, desain grafis, fotografi, videografi, editing video, dan animasi 2D/3D.'),
('Akuntansi', 'ak', 'Mempelajari pembukuan keuangan, perpajakan, dan aplikasi MYOB.', 'calculator', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Akuntansi dan Keuangan Lembaga membekali siswa dengan kemampuan dalam mengelola transaksi keuangan, menyusun laporan keuangan, perpajakan, dan pengoperasian aplikasi komputer akuntansi.'),
('Perhotelan', 'ph', 'Mempelajari pelayanan hotel, housekeeping, dan front office.', 'hotel', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Program keahlian Perhotelan menyiapkan tenaga kerja terampil di bidang hospitality, mencakup layanan front office, housekeeping, food & beverage service, dan laundry.');

-- Fasilitas
INSERT INTO fasilitas (title, description, image_url) VALUES
('Lab Komputer Modern', 'Dilengkapi dengan PC spesifikasi tinggi untuk praktik RPL, TKJ, dan Multimedia.', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('Perpustakaan Digital', 'Koleksi buku lengkap dengan akses e-book dan ruang baca yang nyaman.', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('Ruang Praktik Hotel', 'Mini hotel untuk simulasi praktik siswa jurusan Perhotelan.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('Lapangan Olahraga', 'Fasilitas olahraga lengkap untuk futsal, basket, dan voli.', 'https://images.unsplash.com/photo-1525919539327-7f77978250e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('Masjid Sekolah', 'Sarana ibadah yang luas dan nyaman untuk kegiatan keagamaan.', 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');

-- Sekolah Info (Update existing or insert)
INSERT INTO sekolah_info (name, phone, email, address, kepsek_name, kepsek_message, kepsek_photo) 
VALUES (
  'SMK Paramitha 2', 
  '(021) 12345678', 
  'info@paramitha2.sch.id', 
  'Jl. Raya Jakarta No. 123, Jakarta Timur', 
  'Dr. H. Ahmad Fauzi, M.Pd', 
  'Selamat datang di website resmi SMK Paramitha 2. Kami berkomitmen mencetak lulusan yang kompeten, berkarakter, dan siap kerja.', 
  '/images/Kepsek.JPG'
)
ON CONFLICT (id) DO NOTHING;

-- Carousel
INSERT INTO carousel (title, description, image_url, order_index) VALUES
('Penerimaan Peserta Didik Baru', 'Tahun Ajaran 2024/2025 Telah Dibuka! Daftar Sekarang.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', 1),
('Juara 1 LKS Tingkat Provinsi', 'Selamat kepada Tim RPL atas prestasi membanggakan.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', 2),
('Kunjungan Industri ke Google Indonesia', 'Menambah wawasan teknologi terkini bagi siswa.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', 3);

-- Testimonial
INSERT INTO testimonial (name, role, message, image_url) VALUES
('Budi Santoso', 'Alumni RPL 2020', 'Sekolah di SMK Paramitha 2 sangat menyenangkan. Fasilitas lengkap dan guru-guru yang kompeten sangat membantu saya dalam belajar programming.', 'https://randomuser.me/api/portraits/men/32.jpg'),
('Siti Aminah', 'Alumni Akuntansi 2019', 'Berkat bimbingan guru-guru di sini, saya bisa langsung bekerja di perusahaan multinasional setelah lulus. Terima kasih SMK Paramitha 2!', 'https://randomuser.me/api/portraits/women/44.jpg');

