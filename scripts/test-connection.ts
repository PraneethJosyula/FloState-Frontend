/**
 * Test script to verify Supabase connection
 * Run with: npx tsx scripts/test-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uxqblifpyggjjisamtih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4cWJsaWZweWdnamppc2FtdGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDc4MjQsImV4cCI6MjA4Mjg4MzgyNH0.m9ktnQNWcgGihxe9wTnb6H_NWsA8UluHr9J7GeMg4iM';

async function testConnection() {
  console.log('🔌 Testing Supabase connection...\n');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test 1: Check if we can connect
  console.log('1️⃣ Testing basic connection...');
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
      console.log(`   📝 Error code: ${error.code}`);
      
      if (error.code === '42P01') {
        console.log('\n   ⚠️  The "profiles" table does not exist.');
        console.log('   📋 You need to run the database migrations first.');
        console.log('   🔗 Go to Supabase Dashboard → SQL Editor → Run the migration files');
      }
    } else {
      console.log('   ✅ Connected successfully!');
    }
  } catch (e) {
    console.log(`   ❌ Unexpected error: ${e}`);
  }
  
  // Test 2: Check auth service
  console.log('\n2️⃣ Testing auth service...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.log(`   ❌ Auth error: ${error.message}`);
    } else {
      console.log('   ✅ Auth service is working!');
      console.log(`   📝 Current session: ${session ? 'Active' : 'None (not logged in)'}`);
    }
  } catch (e) {
    console.log(`   ❌ Unexpected error: ${e}`);
  }
  
  // Test 3: Check tables exist
  console.log('\n3️⃣ Checking database tables...');
  const tables = ['profiles', 'activities', 'likes', 'comments', 'follows'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: exists`);
      }
    } catch (e) {
      console.log(`   ❌ ${table}: error checking`);
    }
  }
  
  // Test 4: Check storage bucket (try to list files instead of buckets)
  console.log('\n4️⃣ Checking storage bucket...');
  try {
    // Try to list files in the bucket (empty list is fine)
    const { data, error } = await supabase.storage.from('evidence-images').list('', { limit: 1 });
    if (error) {
      console.log(`   ❌ Storage error: ${error.message}`);
    } else {
      console.log('   ✅ evidence-images bucket exists and is accessible!');
      console.log(`   📝 Files in bucket: ${data?.length || 0}`);
    }
  } catch (e) {
    console.log(`   ❌ Unexpected error: ${e}`);
  }
  
  console.log('\n✨ Connection test complete!\n');
}

testConnection();

