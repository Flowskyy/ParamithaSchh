import 'dotenv/config';
import { PrismaClient } from './lib/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  fallbackJurusan,
  fallbackHomepageSections,
  fallbackVisiMisi,
  fallbackHero,
  fallbackMottoMars
} from './utils/fallbackData.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  let jurusanCount = 0;
  let homepageSectionsCount = 0;
  let heroCount = 0;
  let sekolahInfoCount = 0;
  let mottoMarsCount = 0;

  try {
    // Seed Jurusan
    console.log('\n📚 Seeding jurusan...');
    for (const jurusan of fallbackJurusan) {
      await prisma.jurusan.upsert({
        where: { slug: jurusan.slug },
        update: {
          name: jurusan.name,
          description: jurusan.description,
          fasilitas: jurusan.fasilitas || [],
          gallery: jurusan.gallery || [],
          warna_primer: jurusan.warna_primer,
          warna_sekunder: jurusan.warna_sekunder,
          singkatan: jurusan.singkatan,
          aktif: jurusan.aktif,
          order_index: jurusan.order_index || 0,
          apa_yang_dipelajari: jurusan.apa_yang_dipelajari || [],
          peluang_karir: jurusan.peluang_karir || [],
          articles: jurusan.articles || [],
          updated_at: new Date()
        },
        create: {
          name: jurusan.name,
          slug: jurusan.slug,
          description: jurusan.description,
          fasilitas: jurusan.fasilitas || [],
          gallery: jurusan.gallery || [],
          warna_primer: jurusan.warna_primer,
          warna_sekunder: jurusan.warna_sekunder,
          singkatan: jurusan.singkatan,
          aktif: jurusan.aktif,
          order_index: jurusan.order_index || 0,
          apa_yang_dipelajari: jurusan.apa_yang_dipelajari || [],
          peluang_karir: jurusan.peluang_karir || [],
          articles: jurusan.articles || [],
          sekolah: 'paramitha2'
        }
      });
      jurusanCount++;
      console.log(`  ✓ ${jurusan.name} (${jurusan.slug})`);
    }

    // Seed Homepage Sections
    console.log('\n🏠 Seeding homepage sections...');
    for (const section of fallbackHomepageSections) {
      await prisma.homepage_sections.upsert({
        where: { id: section.id },
        update: {
          label: section.label,
          component: section.component,
          order_index: section.order_index,
          is_active: section.is_active
        },
        create: {
          id: section.id,
          label: section.label,
          component: section.component,
          order_index: section.order_index,
          is_active: section.is_active
        }
      });
      homepageSectionsCount++;
      console.log(`  ✓ ${section.label} (${section.id})`);
    }

    // Seed Hero
    console.log('\n🎯 Seeding hero...');
    const existingHero = await prisma.hero.findFirst();
    if (!existingHero) {
      await prisma.hero.create({
        data: {
          title: fallbackHero.title,
          subtitle: fallbackHero.subtitle,
          description: fallbackHero.description,
          cta_text: fallbackHero.cta_text,
          cta_url: fallbackHero.cta_url,
          image_url: fallbackHero.image_url
        }
      });
      heroCount = 1;
      console.log(`  ✓ Hero created`);
    } else {
      await prisma.hero.update({
        where: { id: existingHero.id },
        data: {
          title: fallbackHero.title,
          subtitle: fallbackHero.subtitle,
          description: fallbackHero.description,
          cta_text: fallbackHero.cta_text,
          cta_url: fallbackHero.cta_url,
          image_url: fallbackHero.image_url
        }
      });
      heroCount = 1;
      console.log(`  ✓ Hero updated`);
    }

    // Seed Visi Misi to sekolah_info
    console.log('\n🎓 Seeding visi & misi to sekolah_info...');
    const existingSekolahInfo = await prisma.sekolah_info.findFirst();
    if (existingSekolahInfo) {
      await prisma.sekolah_info.update({
        where: { id: existingSekolahInfo.id },
        data: {
          vision: fallbackVisiMisi.visi,
          mission: fallbackVisiMisi.misi || []
        }
      });
      sekolahInfoCount = 1;
      console.log(`  ✓ Sekolah info updated with vision & mission`);
    } else {
      await prisma.sekolah_info.create({
        data: {
          vision: fallbackVisiMisi.visi,
          mission: fallbackVisiMisi.misi || []
        }
      });
      sekolahInfoCount = 1;
      console.log(`  ✓ Sekolah info created with vision & mission`);
    }

    // Seed Motto & Mars
    console.log('\n🎵 Seeding motto & mars...');
    const existingMottoMars = await prisma.motto_mars.findFirst();
    if (!existingMottoMars) {
      await prisma.motto_mars.create({
        data: {
          pink_values: fallbackMottoMars.pink_values || [],
          jitu_values: fallbackMottoMars.jitu_values || [],
          mars_lyrics: fallbackMottoMars.mars_lyrics || [],
          mars_audio_url: fallbackMottoMars.mars_audio_url || null
        }
      });
      mottoMarsCount = 1;
      console.log(`  ✓ Motto & Mars created`);
    } else {
      await prisma.motto_mars.update({
        where: { id: existingMottoMars.id },
        data: {
          pink_values: fallbackMottoMars.pink_values || [],
          jitu_values: fallbackMottoMars.jitu_values || [],
          mars_lyrics: fallbackMottoMars.mars_lyrics || [],
          mars_audio_url: fallbackMottoMars.mars_audio_url || null
        }
      });
      mottoMarsCount = 1;
      console.log(`  ✓ Motto & Mars updated`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Jurusan: ${jurusanCount} records`);
    console.log(`  - Homepage Sections: ${homepageSectionsCount} records`);
    console.log(`  - Hero: ${heroCount} record`);
    console.log(`  - Sekolah Info (Vision & Mission): ${sekolahInfoCount} record`);
    console.log(`  - Motto & Mars: ${mottoMarsCount} record`);

  } catch (error) {
    console.error('\n❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
