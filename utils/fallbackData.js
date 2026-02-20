// Placeholder images and data to use when DB is empty or for initial dev
export const fallbackHero = {
  title: "Selamat Datang di SMK Paramitha 2 Jakarta",
  subtitle: "Mencetak Generasi Unggul, Kompeten, dan Berkarakter di Era Digital",
  image_url: "/images/Carousel.png", // Pastikan file ini ada di public/images/
};

export const fallbackJurusan = [
  {
    id: 1,
    title: "Desain Komunikasi Visual",
    slug: "dkv",
    short_desc: "Mengembangkan kreativitas dalam desain grafis, fotografi, videografi, dan multimedia.",
    description: "Jurusan Desain Komunikasi Visual (DKV) mempelajari ilmu tentang penyampaian pesan (komunikasi) dengan menggunakan elemen-elemen visual atau rupa. Siswa akan diajarkan teknik desain grafis, fotografi, videografi, hingga animasi untuk kebutuhan industri kreatif dan digital marketing.",
    icon: "Palette",
    image_url: "https://placehold.co/1920x1080/png?text=DKV",
    kurikulum: [
      "Dasar Desain Grafis & Nirmana",
      "Komputer Grafis (Adobe Photoshop, Illustrator, CorelDraw)",
      "Fotografi & Videografi",
      "Desain Publikasi & Media Interaktif",
      "Produk Kreatif & Kewirausahaan",
      "Tipografi & Sketsa"
    ],
    prospek: [
      "Graphic Designer",
      "Illustrator",
      "Photographer & Videographer",
      "Video Editor",
      "UI/UX Designer",
      "Social Media Content Creator",
      "Freelance Designer"
    ],
    fasilitas: [
      "Lab Komputer Grafis (High Spec)",
      "Studio Fotografi & Videografi",
      "Kamera DSLR & Mirrorless",
      "Lighting Equipment",
      "Pen Tablet",
      "Printer High Quality"
    ]
  },
  {
    id: 2,
    title: "Perhotelan",
    slug: "perhotelan",
    short_desc: "Keahlian manajemen perhotelan, front office, housekeeping, dan hospitality.",
    description: "Jurusan Perhotelan menyiapkan tenaga kerja profesional di bidang hospitality. Siswa akan mempelajari operasional hotel mulai dari kantor depan (Front Office), tata graha (Housekeeping), hingga layanan binatu (Laundry). Penekanan pada pelayanan prima (Service Excellence) dan komunikasi bahasa asing.",
    icon: "Hotel",
    image_url: "https://placehold.co/1920x1080/png?text=Perhotelan",
    kurikulum: [
      "Front Office (Resepsionis & Reservasi)",
      "Housekeeping (Tata Graha)",
      "Laundry Service",
      "Food & Beverage Service",
      "Komunikasi Industri Pariwisata",
      "Bahasa Asing (Inggris & Pilihan Lain)"
    ],
    prospek: [
      "Receptionist / Front Desk Agent",
      "Room Attendant",
      "Public Area Attendant",
      "Laundry Attendant",
      "Bellboy / Porter",
      "Concierge",
      "Hospitality Consultant"
    ],
    fasilitas: [
      "Edotel / Hotel Training Center",
      "Mock-up Hotel Room (Standard & Suite)",
      "Front Office Counter Simulator",
      "Laundry Area",
      "Meeting Room Simulator",
      "Laboratorium Bahasa"
    ]
  },
  {
    id: 3,
    title: "Kuliner",
    slug: "kuliner",
    short_desc: "Keahlian tata boga, pastry, bakery, dan manajemen food & beverage.",
    description: "Jurusan Kuliner (Tata Boga) membekali siswa dengan keterampilan seni mengolah, menyajikan, dan menghidangkan makanan. Siswa mempelajari masakan nusantara, kontinental, pastry & bakery, serta manajemen pelayanan makan dan minum (Food & Beverage Service) dengan standar industri perhotelan.",
    icon: "ChefHat",
    image_url: "https://placehold.co/1920x1080/png?text=Kuliner",
    kurikulum: [
      "Pengolahan & Penyajian Makanan (Continental & Nusantara)",
      "Produk Pastry & Bakery",
      "Tata Hidang (Food & Beverage Service)",
      "Keamanan Pangan (Hygiene & Sanitation)",
      "Ilmu Gizi & Perencanaan Menu",
      "Produk Kreatif & Kewirausahaan"
    ],
    prospek: [
      "Chef / Cook di Hotel & Restoran",
      "Baker & Pastry Chef",
      "Barista & Bartender",
      "Waiter / Waitress",
      "Food Stylist",
      "Catering Entrepreneur",
      "Cruise Ship Staff"
    ],
    fasilitas: [
      "Kitchen Lab (Hot & Cold Kitchen)",
      "Pastry & Bakery Room",
      "Restaurant Simulator",
      "Bar Counter",
      "Peralatan Masak Standar Industri",
      "Chiller & Freezer Room"
    ]
  },
  {
    id: 4,
    title: "Usaha Layanan Wisata",
    slug: "ulw",
    short_desc: "Kompetensi di bidang guiding, ticketing, dan manajemen perjalanan wisata.",
    description: "Program keahlian yang mempelajari perencanaan, pengelolaan, dan pemasaran perjalanan wisata. Siswa dilatih menjadi tour guide, tour planner, dan pengelola travel agent yang profesional.",
    icon: "Plane",
    image_url: "https://placehold.co/1920x1080/png?text=Wisata",
    kurikulum: [
      "Perencanaan Perjalanan Wisata (Tour Planning)",
      "Pemanduan Wisata (Tour Guiding)",
      "Pemesanan Tiket (Ticketing & Reservation)",
      "MICE (Meeting, Incentive, Convention, Exhibition)",
      "Bahasa Asing Pariwisata",
      "Produk Kreatif & Kewirausahaan"
    ],
    prospek: [
      "Tour Guide / Pramuwisata",
      "Tour Planner",
      "Ticketing Staff",
      "Travel Consultant",
      "Event Organizer (MICE)",
      "Staff Bandara (Ground Handling)"
    ],
    fasilitas: [
      "Mini Travel Agent Office",
      "Ticketing System Simulator",
      "Tour Guiding Lab",
      "Language Lab",
      "Meeting Room"
    ]
  },
  {
    id: 5,
    title: "Rekayasa Perangkat Lunak",
    slug: "rpl",
    short_desc: "Mempelajari coding, pengembangan aplikasi web, mobile, dan database.",
    description: "Jurusan Rekayasa Perangkat Lunak (RPL) fokus pada pengembangan teknologi informasi, khususnya software. Siswa dibekali kemampuan coding, algoritma, basis data, dan pengembangan aplikasi berbasis web, desktop, maupun mobile (Android/iOS) sesuai kebutuhan industri teknologi saat ini.",
    icon: "Code",
    image_url: "https://placehold.co/1920x1080/png?text=RPL",
    kurikulum: [
      "Pemrograman Dasar & Algoritma",
      "Pemrograman Berorientasi Objek (OOP)",
      "Pemrograman Web & Perangkat Bergerak",
      "Basis Data (Database)",
      "Desain Grafis Percetakan (Pendukung)",
      "Produk Kreatif & Kewirausahaan"
    ],
    prospek: [
      "Web Developer (Frontend / Backend)",
      "Mobile App Developer",
      "Database Administrator",
      "UI/UX Designer",
      "Software Tester / QA",
      "IT Support & Consultant",
      "Freelance Programmer"
    ],
    fasilitas: [
      "Lab Komputer Software Engineering (High Spec)",
      "Koneksi Internet High Speed",
      "Server Room",
      "Software Development Tools (IDE Resmi)",
      "Smart Classroom",
      "Perpustakaan Digital"
    ]
  },
  {
    id: 6,
    title: "Manajemen Logistik",
    slug: "manajemen-logistik",
    singkatan: "MLOG",
    color: "#6366F1",
    short_desc: "Keahlian manajemen rantai pasok, pergudangan, distribusi, dan transportasi.",
    description: "Jurusan Manajemen Logistik mempelajari perencanaan, pelaksanaan, dan pengawasan perpindahan dan penyimpanan barang/jasa. Siswa dibekali kompetensi manajemen gudang, administrasi logistik, manajemen transportasi, dan rantai pasok (Supply Chain Management) yang sangat dibutuhkan di era e-commerce.",
    icon: "Package",
    image_url: "https://placehold.co/1920x1080/png?text=Logistik",
    kurikulum: [
      "Manajemen Pergudangan (Warehouse)",
      "Manajemen Transportasi & Distribusi",
      "Administrasi Logistik & Supply Chain",
      "Manajemen Persediaan (Inventory Control)",
      "Ekspor Impor & Kepabeanan",
      "K3 Lingkungan Kerja Logistik"
    ],
    prospek: [
      "Staf Gudang / Warehouse Staff",
      "Admin Logistik",
      "Supply Chain Officer",
      "Staf Ekspor Impor",
      "Kurir & Pengiriman (Last Mile Delivery)",
      "Freight Forwarding Staff"
    ],
    fasilitas: [
      "Warehouse Simulator",
      "Forklift Training Area",
      "Logistics Administration Lab",
      "Supply Chain Software",
      "Packing & Packaging Lab"
    ]
  }
];

export const fallbackAlumni = [
  {
    id: 1,
    nama: "Budi Santoso",
    jurusan: "Rekayasa Perangkat Lunak",
    angkatan: "2019",
    foto_url: "https://randomuser.me/api/portraits/men/32.jpg",
    perusahaan: "Tokopedia",
    posisi: "Senior Frontend Engineer",
    deskripsi: "SMK Paramitha memberikan fondasi coding yang kuat. Guru-gurunya sangat supportif dalam mengembangkan minat siswa."
  },
  {
    id: 2,
    nama: "Siti Aminah",
    jurusan: "Perhotelan",
    angkatan: "2020",
    foto_url: "https://randomuser.me/api/portraits/women/44.jpg",
    perusahaan: "Hotel Mulia Senayan",
    posisi: "Front Office Supervisor",
    deskripsi: "Fasilitas praktek yang lengkap membuat saya siap kerja langsung setelah lulus. Sangat merekomendasikan sekolah ini."
  },
  {
    id: 3,
    nama: "Rudi Hartono",
    jurusan: "Desain Komunikasi Visual",
    angkatan: "2021",
    foto_url: "https://randomuser.me/api/portraits/men/86.jpg",
    perusahaan: "Gojek Creative Labs",
    posisi: "UI/UX Designer",
    deskripsi: "Belajar desain di sini sangat menyenangkan. Materi update dengan industri dan banyak project riil."
  }
];

export const fallbackMitra = [
  { id: 1, nama: "Astra International", logo_url: "" },
  { id: 2, nama: "Bank BCA", logo_url: "" },
  { id: 3, nama: "Telkom Indonesia", logo_url: "" },
  { id: 4, nama: "Tokopedia", logo_url: "" },
  { id: 5, nama: "Traveloka", logo_url: "" },
];

export const fallbackFasilitas = [
  {
    id: 1,
    title: "Lab Komputer Modern",
    description: "Dilengkapi dengan PC spesifikasi tinggi untuk praktek RPL dan DKV.",
    image_url: "https://placehold.co/800x600/png?text=Lab+Komputer"
  },
  {
    id: 2,
    title: "Kitchen Standar Industri",
    description: "Peralatan lengkap untuk praktek siswa jurusan Kuliner.",
    image_url: "https://placehold.co/800x600/png?text=Kitchen"
  },
  {
    id: 3,
    title: "Mockup Hotel Room",
    description: "Ruang praktek menyerupai kamar hotel berbintang.",
    image_url: "https://placehold.co/800x600/png?text=Hotel+Room"
  },
  {
    id: 4,
    title: "Studio DKV",
    description: "Studio lengkap dengan peralatan fotografi dan videografi profesional.",
    image_url: "https://placehold.co/800x600/png?text=Studio+DKV"
  }
];

export const fallbackTestimonials = [
  {
    id: 1,
    name: "Andi Saputra",
    role: "Alumni RPL 2020",
    message: "SMK Paramitha 2 memberikan bekal skill yang sangat relevan dengan industri. Sekarang saya bekerja sebagai Frontend Developer di startup unicorn.",
    image_url: "https://placehold.co/200x200/png?text=Andi"
  },
  {
    id: 2,
    name: "Siti Aminah",
    role: "Alumni Kuliner 2021",
    message: "Fasilitas kitchen yang lengkap membuat saya percaya diri saat terjun ke dunia kerja. Terima kasih guru-guru yang sabar membimbing.",
    image_url: "https://placehold.co/200x200/png?text=Siti"
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Alumni Perhotelan 2019",
    message: "Pengalaman magang yang disalurkan sekolah sangat membantu karir saya hingga menjadi Supervisor di hotel bintang 5.",
    image_url: "https://placehold.co/200x200/png?text=Budi"
  }
];

export const fallbackPartners = [
  { name: "Telkom Indonesia", logo: "https://placehold.co/200x100/png?text=Telkom" },
  { name: "Aston Hotel", logo: "https://placehold.co/200x100/png?text=Aston" },
  { name: "Swiss-Belhotel", logo: "https://placehold.co/200x100/png?text=SwissBel" },
  { name: "Bank BRI", logo: "https://placehold.co/200x100/png?text=BRI" },
  { name: "Epson", logo: "https://placehold.co/200x100/png?text=Epson" }
];

export const fallbackGaleri = [
  { id: 1, title: "Kunjungan Industri", category: "Kunjungan", image_url: "https://placehold.co/800x600/png?text=Kunjungan" },
  { id: 2, title: "Praktek Cooking", category: "Praktek", image_url: "https://placehold.co/800x600/png?text=Cooking" },
  { id: 3, title: "Upacara Bendera", category: "Kegiatan", image_url: "https://placehold.co/800x600/png?text=Upacara" },
  { id: 4, title: "Lomba Kompetensi Siswa", category: "Prestasi", image_url: "https://placehold.co/800x600/png?text=LKS" },
  { id: 5, title: "Class Meeting", category: "Kegiatan", image_url: "https://placehold.co/800x600/png?text=Classmeet" },
  { id: 6, title: "Wisuda Angkatan 2023", category: "Kegiatan", image_url: "https://placehold.co/800x600/png?text=Wisuda" }
];

export const fallbackSekolahInfo = {
  name: "SMK Paramitha 2 Jakarta",
  address: "Jl. Raya Bekasi Km. 18, Jakarta Timur",
  phone: "(021) 1234-5678",
  email: "info@paramitha2.sch.id",
  description: "Sekolah Menengah Kejuruan Pusat Keunggulan",
  kepsek_name: "Drs. H. Ahmad Fauzi, M.Pd",
  kepsek_message: "Selamat datang di website resmi SMK Paramitha 2 Jakarta.",
  map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.388836567295!2d106.92095907499035!3d-6.212344693775533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698ca1002220d9%3A0xc39247c870295841!2sSMK%20Paramitha%202!5e0!3m2!1sid!2sid!4v1709605342133!5m2!1sid!2sid",
  visi: "Menjadi Sekolah Menengah Kejuruan yang Unggul dalam Imtaq dan Iptek, serta Menghasilkan Tamatan yang Kompeten, Berkarakter, dan Berwawasan Lingkungan.",
  misi: [
    "Menanamkan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa.",
    "Mengembangkan kurikulum yang selaras dengan kebutuhan dunia kerja dan industri.",
    "Meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan.",
    "Menyediakan sarana dan prasarana pembelajaran yang modern dan memadai.",
    "Membangun kerjasama yang sinergis dengan dunia usaha dan dunia industri."
  ]
};
