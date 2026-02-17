import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'exists' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  const adminEmail = 'gregory.demeulenaere@gmail.com';
  const adminPassword = 'rztXq479Q3eC2D';
  const fullName = 'Gregory Demeulenaere';

  try {
    console.log('Creating admin user...');

    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: fullName,
          role: 'admin'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('Admin user already exists:', adminEmail);
        console.log('You can log in with the provided credentials.');
        return;
      }
      console.error('Error creating admin user:', error);
      throw error;
    }

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('User ID:', data.user?.id);
    console.log('\nYou can now log in with:');
    console.log('Email:', adminEmail);
    console.log('Password: rztXq479Q3eC2D');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
