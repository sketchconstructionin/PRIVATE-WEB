// Local Validation and Diagnostic Script for WhatsApp API and Supabase Database Integration
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { sendTextMessage, sendLeadNotificationToOwner } from './whatsappService.js';

// Load variables
dotenv.config();

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  META_ACCESS_TOKEN,
  META_PHONE_NUMBER_ID,
  BUSINESS_OWNER_NUMBER
} = process.env;

console.log('🏁 Starting WhatsApp Integration Diagnostic Tool...');
console.log('--------------------------------------------------');

// 1. Verify Configuration variables
console.log('📋 Diagnostics 1: Checking Environment Config...');
console.log(`- Supabase Project URL: ${SUPABASE_URL ? 'Loaded (OK)' : '❌ MISSING'}`);
console.log(`- Supabase Service Role Key: ${SUPABASE_SERVICE_ROLE_KEY ? 'Loaded (OK)' : '❌ MISSING'}`);
console.log(`- Meta Phone Number ID: ${META_PHONE_NUMBER_ID ? 'Loaded (OK)' : '⚠️ MISSING (Will run in simulation mode)'}`);
console.log(`- Meta Access Token: ${META_ACCESS_TOKEN ? 'Loaded (OK)' : '⚠️ MISSING (Will run in simulation mode)'}`);
console.log(`- Owner WhatsApp Number: ${BUSINESS_OWNER_NUMBER || '⚠️ MISSING'}`);
console.log('--------------------------------------------------');

async function runDiagnostics() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Diagnostic aborted: Supabase credentials are not configured.');
    process.exit(1);
  }

  // 2. Test Supabase Connectivity
  console.log('🔌 Diagnostics 2: Testing Supabase DB Connection...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Attempt a simple select from the leads table
    const { data, error } = await supabase.from('leads').select('id').limit(1);

    if (error) {
      console.warn(`⚠️ Connected to Supabase, but schema tables might not exist yet: "${error.message}"`);
      console.log('💡 Note: Remember to run the SQL migration query from schema.sql in your Supabase SQL Editor.');
    } else {
      console.log('✅ Supabase Connection: SUCCESS. Table structure is ready.');
    }
  } catch (err) {
    console.error('❌ Supabase Connection Failed:', err.message);
  }
  console.log('--------------------------------------------------');

  // 3. Test Lead Pipeline Simulation
  console.log('🏗️ Diagnostics 3: Simulating Website Lead Intake...');
  const mockLead = {
    name: 'Vikky Test Client',
    phone: BUSINESS_OWNER_NUMBER || '918349886687',
    email: 'test@sketchconstruction.in',
    project_type: 'Luxury Duplex (Diagnostics)',
    budget: '₹40L - ₹50L',
    description: 'Automated diagnostic pipeline validation test. Verify WhatsApp and DB logs.',
    attachment_url: 'design_blueprint_sketch.dwg'
  };

  try {
    console.log(`👉 Simulating new lead alert for "${mockLead.name}"`);
    
    // Save to Database (simulation or actual)
    const { data: leadData, error: leadErr } = await supabase
      .from('leads')
      .insert([mockLead])
      .select();

    if (leadErr) {
      console.warn('⚠️ Could not insert mock lead to Supabase (check RLS policies):', leadErr.message);
    } else {
      console.log('✅ Mock Lead saved in Supabase database successfully.');
    }

    // Trigger WhatsApp notification
    const result = await sendLeadNotificationToOwner(mockLead);
    
    if (result.success) {
      console.log('✅ Lead WhatsApp Notification: SUCCESS.');
      if (result.simulated) {
        console.log('ℹ️ Note: Message was SIMULATED because Meta tokens are placeholders.');
      } else {
        console.log('🎉 Actual WhatsApp message dispatched via Meta API.');
      }
    } else {
      console.error('❌ Lead WhatsApp Notification FAILED:', result.error);
    }

  } catch (err) {
    console.error('❌ Lead Intake Pipeline crashed:', err);
  }

  console.log('--------------------------------------------------');
  console.log('🏁 Diagnostics Completed.');
}

runDiagnostics();
