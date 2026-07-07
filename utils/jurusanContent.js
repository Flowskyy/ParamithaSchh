export const createDefaultJurusanContent = (name = 'Jurusan') => ({
  hero_title: `Program Keahlian ${name}`,
  hero_description: `Program keahlian ${name} di SMK Paramitha 2 dirancang untuk mencetak lulusan yang siap kerja dan kompeten. Kurikulum kami disesuaikan dengan kebutuhan industri terkini, didukung fasilitas modern dan pengajar praktisi.`,
  about_title: `Mengapa Memilih ${name}?`,
  about_description: `Program keahlian ${name} di SMK Paramitha 2 dirancang untuk mencetak lulusan yang siap kerja dan kompeten. Kurikulum kami disesuaikan dengan kebutuhan industri terkini, didukung fasilitas modern dan pengajar praktisi.`,
  about_highlight: 'Siswa tidak hanya belajar teori, tetapi juga praktik langsung melalui Project Based Learning dan program magang di perusahaan mitra terkemuka.',
  benefits_title: 'Kenapa siswa memilih jurusan ini?',
  benefits_items: [
    {
      title: 'Kurikulum Industri',
      description: 'Materi pembelajaran update sesuai standar industri.'
    },
    {
      title: 'Pengajar Praktisi',
      description: 'Diajar langsung oleh ahli di bidangnya.'
    },
    {
      title: 'Sertifikasi Kompetensi',
      description: 'Lulusan dibekali sertifikat BNSP yang diakui.'
    }
  ],
  learning_title: 'Apa yang Dipelajari?',
  learning_description: `Materi dan kompetensi utama jurusan ${name}`,
  learning_items: [
    {
      title: 'Supply Chain',
      description: 'Menguasai keahlian supply chain secara mendalam dengan praktik intensif.'
    },
    {
      title: 'Warehouse Management',
      description: 'Menguasai keahlian warehouse management secara mendalam dengan praktik intensif.'
    },
    {
      title: 'Distribution',
      description: 'Menguasai keahlian distribution secara mendalam dengan praktik intensif.'
    },
    {
      title: 'Inventory Control',
      description: 'Menguasai keahlian inventory control secara mendalam dengan praktik intensif.'
    },
    {
      title: 'Logistics IT',
      description: 'Menguasai keahlian logistics it secara mendalam dengan praktik intensif.'
    }
  ],
  career_title: 'Peluang Karir',
  career_description: `Lulusan ${name} memiliki kesempatan luas untuk bekerja di berbagai sektor industri.`,
  career_items: [],
  cta_title: 'Siap Bergabung?',
  cta_description: `Jadilah bagian dari ${name} SMK Paramitha 2 dan raih masa depan gemilangmu sekarang juga.`,
  cta_primary_text: 'Daftar PPDB Online',
  cta_primary_url: '/ppdb',
  cta_secondary_text: 'Hubungi Kami',
  cta_secondary_url: '/contact'
});

export const normalizeJurusanContent = (content, name = 'Jurusan') => {
  const defaults = createDefaultJurusanContent(name);

  if (!content || typeof content !== 'object') return defaults;

  if (typeof content === 'string') {
    try {
      return normalizeJurusanContent(JSON.parse(content), name);
    } catch (err) {
      console.error('JSON parse error in normalizeJurusanContent:', err.message);
      console.error('Content being parsed (first 200 chars):', content.substring(0, 200));
      return defaults;
    }
  }

  return {
    ...defaults,
    ...content,
    benefits_items: Array.isArray(content.benefits_items)
      ? content.benefits_items
      : defaults.benefits_items,
    learning_items: Array.isArray(content.learning_items)
      ? content.learning_items
      : defaults.learning_items,
    career_items: Array.isArray(content.career_items)
      ? content.career_items
      : defaults.career_items,
  };
};
