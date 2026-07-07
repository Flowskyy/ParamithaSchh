export const fallbackMottoMars = {
  pink_values: [
    { char: 'P', title: 'Percaya Diri', desc: 'Memiliki keyakinan terhadap kemampuan diri untuk mencapai tujuan.' },
    { char: 'I', title: 'Inovatif', desc: 'Mampu menciptakan ide baru dan solusi kreatif dalam menghadapi tantangan.' },
    { char: 'N', title: 'Niat Baik', desc: 'Memiliki tekad yang tulus dan berorientasi pada kebaikan bersama.' },
    { char: 'K', title: 'Kerja Keras', desc: 'Berusaha maksimal dengan dedikasi tinggi untuk meraih hasil terbaik.' }
  ],
  jitu_values: [
    { char: 'J', title: 'Jujur', desc: 'Menjunjung tinggi kejujuran dalam setiap tindakan dan ucapan.' },
    { char: 'I', title: 'Ikhlas', desc: 'Melakukan segala sesuatu dengan tulus tanpa pamrih.' },
    { char: 'T', title: 'Tanggung Jawab', desc: 'Siap bertanggung jawab atas setiap keputusan dan tindakan yang diambil.' },
    { char: 'U', title: 'Unggul', desc: 'Berprestasi dan menjadi yang terbaik dalam bidang yang digeluti.' }
  ],
  mars_lyrics: [
    {
      verse: 1,
      text: [
        'SMK Paramitha dua',
        'Membentuk karakter unggul',
        'Berkarya dengan semangat',
        'Menuju masa depan gemilang'
      ]
    },
    {
      verse: 2,
      text: [
        'Belajar dengan giat',
        'Mengasah skill dan bakat',
        'Siap menghadapi dunia',
        'Menjadi generasi berprestasi'
      ]
    },
    {
      verse: 3,
      text: [
        'Paramitha dua jaya',
        'Mencetak lulusan berkualitas',
        'Berkarakter dan berdaya saing',
        'Untuk bangsa dan negara'
      ]
    }
  ],
  mars_audio_url: null
};


export const fallbackSekolahInfo = {};


export const fallbackFasilitas = [];
export const fallbackGaleri = [];
export const fallbackTestimonial = [];
export const fallbackAlumni = [];
export const fallbackMitra = [];
export const fallbackJadwalPPDB = [];
export const fallbackPersyaratanPPDB = [];
export const fallbackPendaftar = [];
export const fallbackSejarah = [];
export const fallbackCarousel = [];

// These are kept for seed.ts to populate the database
export const fallbackJurusan = [
  { 
    id: 'rpl', 
    name: 'Rekayasa Perangkat Lunak', 
    slug: 'rpl',
    warna_primer: '#1E1E8F',
    warna_sekunder: '#3D3DB5',
    singkatan: 'RPL',
    aktif: true,
    order_index: 0,
    description: 'Mempelajari cara pengembangan perangkat lunak termasuk pembuatan, pemeliharaan, manajemen organisasi pengembangan perangkat lunak dan manajemen kualitas.',
    fasilitas: [],
    gallery: [],
    apa_yang_dipelajari: [
      { title: 'Pemrograman Web & Mobile', description: 'Mempelajari pengembangan aplikasi web dan mobile modern' },
      { title: 'Basis Data', description: 'Manajemen dan desain database relasional dan NoSQL' },
      { title: 'Pemrograman Berorientasi Objek', description: 'Konsep OOP dan implementasi dalam berbagai bahasa' },
      { title: 'Kerja Proyek Perangkat Lunak', description: 'Pengalaman nyata dalam pengembangan proyek software' },
      { title: 'Produk Kreatif dan Kewirausahaan', description: 'Membangun mindset entrepreneur di bidang teknologi' }
    ],
    peluang_karir: [
      { title: 'Web Developer', description: 'Pengembang website dan aplikasi web' },
      { title: 'Mobile App Developer', description: 'Pengembang aplikasi mobile Android dan iOS' },
      { title: 'Database Administrator', description: 'Pengelola dan administrator database' },
      { title: 'Software Tester', description: 'Quality assurance dan testing software' },
      { title: 'IT Consultant', description: 'Konsultan teknologi informasi untuk perusahaan' }
    ],
    articles: [
      { title: 'Mengapa Memilih Rekayasa Perangkat Lunak?', description: 'Program keahlian Rekayasa Perangkat Lunak di SMK Paramitha 2 dirancang untuk mencetak lulusan yang siap kerja dan kompeten. Kurikulum kami disesuaikan dengan kebutuhan industri terkini, didukung fasilitas modern dan pengajar praktisi.' },
      { title: 'Project Based Learning', description: 'Siswa tidak hanya belajar teori, tetapi juga praktik langsung melalui Project Based Learning dan program magang di perusahaan mitra terkemuka.' }
    ]
  },
  { 
    id: 'ulw', 
    name: 'Usaha Layanan Wisata', 
    slug: 'ulw',
    warna_primer: '#F5C400',
    warna_sekunder: '#E6B800',
    singkatan: 'ULW',
    aktif: true,
    order_index: 1,
    description: 'Kompetensi keahlian yang mempelajari kegiatan yang bersifat komersial yang mengatur, menyediakan, dan menyelenggarakan pelayanan bagi seseorang, sekelompok orang untuk melakukan perjalanan wisata.',
    fasilitas: [],
    gallery: [],
    apa_yang_dipelajari: [
      { title: 'Pemesanan Tiket Penerbangan', description: 'Sistem reservasi dan booking tiket pesawat' },
      { title: 'Perencanaan Perjalanan Wisata', description: 'Perencanaan itinerary dan paket wisata' },
      { title: 'Pemanduan Perjalanan Wisata', description: 'Teknik guiding dan manajemen tour' },
      { title: 'MICE', description: 'Meeting, Incentive, Conference, and Exhibition management' },
      { title: 'Pengelolaan Informasi Wisata', description: 'Manajemen informasi destinasi wisata' }
    ],
    peluang_karir: [
      { title: 'Tour Guide', description: 'Pemandu wisata profesional' },
      { title: 'Travel Consultant', description: 'Konsultan perjalanan wisata' },
      { title: 'Ticketing Staff', description: 'Staf reservasi tiket' },
      { title: 'Event Organizer Staff', description: 'Staf penyelenggara acara' },
      { title: 'Tourism Marketing', description: 'Marketing pariwisata' }
    ],
    articles: []
  },
  { 
    id: 'perhotelan', 
    name: 'Perhotelan', 
    slug: 'perhotelan',
    warna_primer: '#0EA5E9',
    warna_sekunder: '#0284C7',
    singkatan: 'PH',
    aktif: true,
    order_index: 2,
    description: 'Mempelajari tentang pengelolaan hotel, mulai dari pelayanan tamu, penataan kamar, hingga manajemen operasional hotel secara menyeluruh.',
    fasilitas: [],
    gallery: [],
    apa_yang_dipelajari: [
      { title: 'Front Office', description: 'Pelayanan tamu dan resepsionis' },
      { title: 'Housekeeping', description: 'Kebersihan dan penataan kamar' },
      { title: 'Laundry', description: 'Pengelolaan laundry hotel' },
      { title: 'Food & Beverage Service', description: 'Pelayanan makanan dan minuman' },
      { title: 'Industri Perhotelan', description: 'Manajemen operasional hotel' }
    ],
    peluang_karir: [
      { title: 'Receptionist', description: 'Staf resepsionis hotel' },
      { title: 'Room Attendant', description: 'Staf kebersihan kamar' },
      { title: 'Concierge', description: 'Staf layanan tamu VIP' },
      { title: 'Public Area Attendant', description: 'Staf kebersihan area publik' },
      { title: 'Hotel Supervisor', description: 'Supervisor operasional hotel' }
    ],
    articles: []
  },
  { 
    id: 'kuliner', 
    name: 'Kuliner', 
    slug: 'kuliner',
    warna_primer: '#C0161C',
    warna_sekunder: '#A01218',
    singkatan: 'KL',
    aktif: true,
    order_index: 3,
    description: 'Mempelajari teknik memasak, penyajian makanan, manajemen dapur, serta kewirausahaan di bidang kuliner.',
    fasilitas: [],
    gallery: [],
    apa_yang_dipelajari: [
      { title: 'Tata Boga', description: 'Teknik penyajian dan tata hidangan' },
      { title: 'Pengolahan Makanan Kontinental', description: 'Masakan kontinental dan western' },
      { title: 'Pengolahan Makanan Indonesia', description: 'Masakan tradisional Indonesia' },
      { title: 'Pastry & Bakery', description: 'Teknik pembuatan kue dan roti' },
      { title: 'Keamanan Pangan', description: 'HACCP dan food safety' }
    ],
    peluang_karir: [
      { title: 'Chef / Cook', description: 'Juru masak profesional' },
      { title: 'Baker', description: 'Ahli pembuat roti dan kue' },
      { title: 'Barista', description: 'Ahli kopi' },
      { title: 'Food Stylist', description: 'Stylist makanan' },
      { title: 'Catering Entrepreneur', description: 'Pengusaha katering' }
    ],
    articles: []
  },
  { 
    id: 'dkv', 
    name: 'Desain Komunikasi Visual', 
    slug: 'dkv',
    warna_primer: '#1a1a1a',
    warna_sekunder: '#2d2d2d',
    singkatan: 'DKV',
    aktif: true,
    order_index: 4,
    description: 'Mempelajari ilmu tentang penyampaian pesan (komunikasi) dengan menggunakan elemen-elemen visual atau rupa.',
    fasilitas: [],
    gallery: [],
    apa_yang_dipelajari: [
      { title: 'Desain Grafis Percetakan', description: 'Desain untuk media cetak' },
      { title: 'Desain Media Interaktif', description: 'UI/UX dan desain interaktif' },
      { title: 'Teknik Pengolahan Audio Video', description: 'Editing video dan audio' },
      { title: 'Videografi', description: 'Teknik pengambilan video profesional' },
      { title: 'Fotografi', description: 'Teknik fotografi digital' }
    ],
    peluang_karir: [
      { title: 'Graphic Designer', description: 'Desainer grafis profesional' },
      { title: 'Video Editor', description: 'Editor video profesional' },
      { title: 'Photographer', description: 'Fotografer profesional' },
      { title: 'UI/UX Designer', description: 'Desainer antarmuka dan pengalaman pengguna' },
      { title: 'Creative Director', description: 'Direktur kreatif agensi' }
    ],
    articles: []
  },
  { 
    id: 'manajemen-logistik', 
    name: 'Manajemen Logistik', 
    slug: 'manajemen-logistik',
    warna_primer: '#16A34A',
    warna_sekunder: '#15803D',
    singkatan: 'ML',
    aktif: true,
    order_index: 5,
    description: 'Mempelajari perencanaan, pelaksanaan, dan pengawasan perpindahan dan penyimpanan barang/jasa serta informasi terkait.',
    fasilitas: [],
    gallery: [],
    apa_yang_dipelajari: [
      { title: 'Administrasi Gudang', description: 'Manajemen administrasi gudang' },
      { title: 'Pengelolaan Distribusi', description: 'Manajemen distribusi barang' },
      { title: 'Manajemen Transportasi', description: 'Manajemen logistik transportasi' },
      { title: 'Supply Chain Management', description: 'Manajemen rantai pasok' },
      { title: 'K3 Lingkungan Kerja', description: 'Kesehatan dan keselamatan kerja' }
    ],
    peluang_karir: [
      { title: 'Warehouse Staff', description: 'Staf gudang' },
      { title: 'Logistic Coordinator', description: 'Koordinator logistik' },
      { title: 'Supply Chain Staff', description: 'Staf supply chain' },
      { title: 'Purchasing Staff', description: 'Staf pembelian' },
      { title: 'Inventory Control', description: 'Staf kontrol inventaris' }
    ],
    articles: []
  },
  { 
    id: 'tkj', 
    name: 'Teknik Komputer & Jaringan', 
    slug: 'tkj',
    warna_primer: '#7C3AED',
    warna_sekunder: '#6D28D9',
    singkatan: 'TKJ',
    aktif: false,
    order_index: 6,
    description: 'Mempelajari cara merakit komputer dan instalasi program komputer, serta memasang jaringan komputer.',
    fasilitas: [],
    gallery: [],
    apa_yang_dipelajari: [
      { title: 'Perakitan Komputer', description: 'Teknik perakitan dan troubleshooting komputer' },
      { title: 'Sistem Operasi Jaringan', description: 'Instalasi dan konfigurasi OS jaringan' },
      { title: 'Administrasi Infrastruktur Jaringan', description: 'Manajemen infrastruktur jaringan' },
      { title: 'Administrasi Sistem Jaringan', description: 'Manajemen sistem jaringan' },
      { title: 'Teknologi Layanan Jaringan', description: 'Teknologi jaringan terkini' }
    ],
    peluang_karir: [
      { title: 'Network Technician', description: 'Teknisi jaringan' },
      { title: 'System Administrator', description: 'Administrator sistem' },
      { title: 'IT Support', description: 'Staf support IT' },
      { title: 'Network Engineer', description: 'Engineer jaringan' },
      { title: 'CCTV Technician', description: 'Teknisi CCTV' }
    ],
    articles: []
  }
];

export const fallbackHomepageSections = [
  { id: 'hero', label: 'Hero Section', component: 'HeroSection', order_index: 0, is_active: true },
  { id: 'sambutan', label: 'Sambutan Kepala Sekolah', component: 'SambutanSection', order_index: 1, is_active: true },
  { id: 'jurusan', label: 'Daftar Jurusan', component: 'JurusanSection', order_index: 2, is_active: true },
  { id: 'proyek_pkk', label: 'Proyek Kewirausahaan', component: 'TeachingFactorySection', order_index: 3, is_active: true },
  { id: 'alumni', label: 'Alumni Sukses', component: 'AlumniSection', order_index: 4, is_active: true },
  { id: 'mitra', label: 'Mitra Industri', component: 'MitraSection', order_index: 5, is_active: true },
];

export const fallbackVisiMisi = {
  visi: 'Menjadi SMK Unggulan yang menghasilkan lulusan kompeten, berkarakter, dan berdaya saing global.',
  misi: [
    'Menyelenggarakan pendidikan berkualitas berbasis industri.',
    'Membangun karakter siswa yang beriman, bertakwa, dan berakhlak mulia.',
    'Mengembangkan potensi siswa melalui kegiatan ekstrakurikuler dan kokurikuler.',
    'Menjalin kerjasama dengan dunia usaha dan dunia industri.'
  ]
};

export const fallbackHero = {
  title: 'Selamat Datang di SMK Paramitha 2',
  subtitle: 'Sekolah Menengah Kejuruan Pusat Keunggulan',
  description: 'Mencetak generasi unggul, kompeten, dan siap kerja dengan fasilitas modern dan kurikulum berbasis industri.',
  image_url: '/images/Carousel.png',
  cta_text: 'Daftar Sekarang',
  cta_url: '/ppdb'
};
