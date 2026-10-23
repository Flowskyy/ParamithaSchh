export const fallbackMottoMars = {
  pink_values: [
    { char: 'P', title: 'Profesional', desc: 'Memiliki kompetensi dan keahlian tinggi dalam bidangnya.' },
    { char: 'I', title: 'Inovatif', desc: 'Selalu menciptakan pembaruan dan solusi kreatif.' },
    { char: 'N', title: 'Nasionalis', desc: 'Menunjung tinggi nilai-nilai kebangsaan dan cinta tanah air.' },
    { char: 'K', title: 'Kompeten', desc: 'Mampu bersaing dan menyelesaikan tugas dengan sangat baik.' },
  ],
  jitu_values: [
    { char: 'J', title: 'Jujur', desc: 'Berintegritas, transparan, dan dapat dipercaya dalam tindakan.' },
    { char: 'I', title: 'Iman', desc: 'Berlandaskan ketakwaan kepada Tuhan Yang Maha Esa.' },
    { char: 'T', title: 'Tangguh', desc: 'Kuat mental, pantang menyerah, dan siap menghadapi tantangan.' },
    { char: 'U', title: 'Unggul', desc: 'Selalu berusaha menjadi yang terbaik dan berprestasi.' },
  ],
  mars_lyrics: [
    { verse: 1, text: ["Singsingkan lengan bajumu", "Tataplah masa depanmu", "SMK Paramitha 2", "Wadah insan cendekia"] }
  ]
};

export const fallbackSekolahInfo = {
  name: 'SMK Paramitha 2 Jakarta',
  phone: '6282124706301',
  email: 'smkparamitha2@gmail.com',
  address: 'Jl. Raya Kalimalang No. 68 I2, Pondok Kelapa, Duren Sawit, Jakarta Timur',
  facebook: 'https://facebook.com/smkparamitha2',
  instagram: 'https://instagram.com/smkparamitha2',
  youtube: 'https://youtube.com/@smkparamitha2',
  tiktok: 'https://tiktok.com/@smkparamitha2',
  wa_ppdb: '6282124706301',
  wa_kontak: '6282124706301',
  kepsek_name: 'Dwi Elvride',
  kepsek_photo: '/images/Kepsek.JPG',
  kepsek_message: "Assalamu’alaikum warahmatullahi wabarakatuh, Salam sejahtera bagi kita semua, Shalom, Om Swastiastu, Namo Buddhaya, Salam kebajikan,|||\nPuji syukur kita panjatkan kepada Tuhan Yang Maha Esa atas berkat dan rahmat-Nya sehingga website resmi SMK Paramitha 2 Jakarta dapat hadir sebagai sarana informasi dan komunikasi bagi seluruh warga sekolah maupun masyarakat luas.\n\nWebsite ini kami hadirkan sebagai bentuk keterbukaan informasi sekaligus wadah untuk memperkenalkan berbagai kegiatan, prestasi, serta program unggulan sekolah kami.\n\nSMK Paramitha 2 Jakarta berkomitmen untuk mencetak generasi yang kompeten, kreatif, dan siap menghadapi tantangan di dunia industri maupun dunia digital yang terus berkembang.\n\nKami berharap website ini dapat memberikan manfaat, inspirasi, dan gambaran nyata tentang semangat belajar serta lingkungan positif yang kami bangun di sekolah ini.\n\nTerima kasih atas kunjungan Anda."
};

export const fallbackJurusan = [
  { 
    id: 'rpl', 
    name: 'Rekayasa Perangkat Lunak', 
    slug: 'rpl',
    warna_primer: '#1E1E8F',
    warna_sekunder: '#3D3DB5',
    singkatan: 'RPL',
    aktif: true,
    description: 'Mempelajari cara pengembangan perangkat lunak termasuk pembuatan, pemeliharaan, manajemen organisasi pengembangan perangkat lunak dan manajemen kualitas.',
    kompetensi: [
      'Pemrograman Web & Mobile',
      'Basis Data',
      'Pemrograman Berorientasi Objek',
      'Kerja Proyek Perangkat Lunak',
      'Produk Kreatif dan Kewirausahaan'
    ],
    prospek: [
      'Web Developer',
      'Mobile App Developer',
      'Database Administrator',
      'Software Tester',
      'IT Consultant'
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
    description: 'Kompetensi keahlian yang mempelajari kegiatan yang bersifat komersial yang mengatur, menyediakan, dan menyelenggarakan pelayanan bagi seseorang, sekelompok orang untuk melakukan perjalanan wisata.',
    kompetensi: [
      'Pemesanan Tiket Penerbangan',
      'Perencanaan Perjalanan Wisata',
      'Pemanduan Perjalanan Wisata',
      'Meeting, Incentive, Conference, and Exhibition (MICE)',
      'Pengelolaan Informasi Wisata'
    ],
    prospek: [
      'Tour Guide',
      'Travel Consultant',
      'Ticketing Staff',
      'Event Organizer Staff',
      'Tourism Marketing'
    ]
  },
  { 
    id: 'perhotelan', 
    name: 'Perhotelan', 
    slug: 'perhotelan',
    warna_primer: '#0EA5E9',
    warna_sekunder: '#0284C7',
    singkatan: 'PH',
    aktif: true,
    description: 'Mempelajari tentang pengelolaan hotel, mulai dari pelayanan tamu, penataan kamar, hingga manajemen operasional hotel secara menyeluruh.',
    kompetensi: [
      'Front Office',
      'Housekeeping',
      'Laundry',
      'Food & Beverage Service',
      'Industri Perhotelan'
    ],
    prospek: [
      'Receptionist',
      'Room Attendant',
      'Concierge',
      'Public Area Attendant',
      'Hotel Supervisor'
    ]
  },
  { 
    id: 'kuliner', 
    name: 'Kuliner', 
    slug: 'kuliner',
    warna_primer: '#C0161C',
    warna_sekunder: '#A01218',
    singkatan: 'KL',
    aktif: true,
    description: 'Mempelajari teknik memasak, penyajian makanan, manajemen dapur, serta kewirausahaan di bidang kuliner.',
    kompetensi: [
      'Tata Boga',
      'Pengolahan Makanan Kontinental',
      'Pengolahan Makanan Indonesia',
      'Pastry & Bakery',
      'Keamanan Pangan'
    ],
    prospek: [
      'Chef / Cook',
      'Baker',
      'Barista',
      'Food Stylist',
      'Catering Entrepreneur'
    ]
  },
  { 
    id: 'dkv', 
    name: 'Desain Komunikasi Visual', 
    slug: 'dkv',
    warna_primer: '#1a1a1a',
    warna_sekunder: '#2d2d2d',
    singkatan: 'DKV',
    aktif: true,
    description: 'Mempelajari ilmu tentang penyampaian pesan (komunikasi) dengan menggunakan elemen-elemen visual atau rupa.',
    kompetensi: [
      'Desain Grafis Percetakan',
      'Desain Media Interaktif',
      'Teknik Pengolahan Audio Video',
      'Videografi',
      'Fotografi'
    ],
    prospek: [
      'Graphic Designer',
      'Video Editor',
      'Photographer',
      'UI/UX Designer',
      'Creative Director'
    ]
  },
  { 
    id: 'manajemen-logistik', 
    name: 'Manajemen Logistik', 
    slug: 'manajemen-logistik',
    warna_primer: '#16A34A',
    warna_sekunder: '#15803D',
    singkatan: 'ML',
    aktif: true,
    description: 'Mempelajari perencanaan, pelaksanaan, dan pengawasan perpindahan dan penyimpanan barang/jasa serta informasi terkait.',
    kompetensi: [
      'Administrasi Gudang',
      'Pengelolaan Distribusi',
      'Manajemen Transportasi',
      'Supply Chain Management',
      'K3 Lingkungan Kerja'
    ],
    prospek: [
      'Warehouse Staff',
      'Logistic Coordinator',
      'Supply Chain Staff',
      'Purchasing Staff',
      'Inventory Control'
    ]
  },
  { 
    id: 'tkj', 
    name: 'Teknik Komputer & Jaringan', 
    slug: 'tkj',
    warna_primer: '#7C3AED',
    warna_sekunder: '#6D28D9',
    singkatan: 'TKJ',
    aktif: false,
    description: 'Mempelajari cara merakit komputer dan instalasi program komputer, serta memasang jaringan komputer.',
    kompetensi: [
      'Perakitan Komputer',
      'Sistem Operasi Jaringan',
      'Administrasi Infrastruktur Jaringan',
      'Administrasi Sistem Jaringan',
      'Teknologi Layanan Jaringan'
    ],
    prospek: [
      'Network Technician',
      'System Administrator',
      'IT Support',
      'Network Engineer',
      'CCTV Technician'
    ]
  }
];

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

export const fallbackHomepageSections = [
  { id: 'hero', label: 'Hero Section', component: 'HeroSection', order_index: 0, is_active: true },
  { id: 'sambutan', label: 'Sambutan Kepala Sekolah', component: 'SambutanSection', order_index: 1, is_active: true },
  { id: 'jurusan', label: 'Daftar Jurusan', component: 'JurusanSection', order_index: 2, is_active: true },
  { id: 'teaching_factory', label: 'Teaching Factory', component: 'TeachingFactorySection', order_index: 3, is_active: true },
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
  image_url: '/images/hero-bg.jpg',
  cta_text: 'Daftar Sekarang',
  cta_url: '/ppdb'
};
