import { supabase } from '../services/supabase';

export async function seedDatabase() {
  console.log('Seeding disabled. Use Admin Panel to manage content.');
  return { success: true, message: 'Seeding skipped.' };
}
