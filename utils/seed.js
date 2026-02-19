import { supabase } from '../services/supabase';
import { fallbackJurusan, fallbackFasilitas, fallbackHero, fallbackTestimonials } from './fallbackData';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Seed Jurusan
    const { data: existingJurusan } = await supabase.from('jurusan').select('id');
    if (!existingJurusan || existingJurusan.length === 0) {
      console.log('Seeding Jurusan...');
      const { error } = await supabase.from('jurusan').insert(
        fallbackJurusan.map(item => ({
          name: item.name,
          slug: item.slug,
          short_desc: item.short_desc,
          icon: item.icon,
          image_url: item.image_url,
          content: `
            <p>${item.short_desc}</p>
            <h3>Prospek Karir:</h3>
            <ul>
              ${item.prospek ? item.prospek.map(p => `<li>${p}</li>`).join('') : ''}
            </ul>
          `,
          order_index: item.id
        }))
      );
      if (error) console.error('Error seeding Jurusan:', error);
    }

    // Seed Fasilitas
    const { data: existingFasilitas } = await supabase.from('fasilitas').select('id');
    if (!existingFasilitas || existingFasilitas.length === 0) {
      console.log('Seeding Fasilitas...');
      const { error } = await supabase.from('fasilitas').insert(
        fallbackFasilitas.map(item => ({
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          order_index: item.id
        }))
      );
      if (error) console.error('Error seeding Fasilitas:', error);
    }

    // Seed Hero (Optional, usually single row)
    const { data: existingHero } = await supabase.from('hero').select('id');
    if (!existingHero || existingHero.length === 0) {
      console.log('Seeding Hero...');
      const { error } = await supabase.from('hero').insert({
        title: fallbackHero.title,
        subtitle: fallbackHero.subtitle,
        image_url: fallbackHero.image_url
      });
      if (error) console.error('Error seeding Hero:', error);
    }

    // Seed Testimonials
    const { data: existingTestimonials } = await supabase.from('testimonial').select('id');
    if (!existingTestimonials || existingTestimonials.length === 0) {
      console.log('Seeding Testimonials...');
      const { error } = await supabase.from('testimonial').insert(
        fallbackTestimonials.map(item => ({
          name: item.name,
          role: item.role,
          message: item.message,
          image_url: item.image_url
        }))
      );
      if (error) console.error('Error seeding Testimonials:', error);
    }

    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Seeding failed:', error);
    return { success: false, message: error.message };
  }
}
