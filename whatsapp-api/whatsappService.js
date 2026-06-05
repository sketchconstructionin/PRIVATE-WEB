// WhatsApp Cloud API Service Handler
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Initialize configuration
dotenv.config();

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  META_ACCESS_TOKEN,
  META_PHONE_NUMBER_ID,
  BUSINESS_OWNER_NUMBER
} = process.env;

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const META_GRAPH_URL = `https://graph.facebook.com/v18.0/${META_PHONE_NUMBER_ID}/messages`;

/**
 * Log message transaction into Supabase
 */
async function logMessage(from, to, text, direction, status = 'sent') {
  try {
    const { error } = await supabase
      .from('whatsapp_logs')
      .insert([
        {
          from_number: from,
          to_number: to,
          message_body: text,
          direction: direction,
          status: status
        }
      ]);
    if (error) console.error('Error logging WhatsApp message to DB:', error.message);
  } catch (err) {
    console.error('Error in logMessage database task:', err);
  }
}

/**
 * Helper to make HTTP POST requests to Meta Graph API
 */
async function sendMetaRequest(payload) {
  if (!META_ACCESS_TOKEN || META_ACCESS_TOKEN.includes('PLACEHOLDER')) {
    console.warn('⚠️ [WhatsApp API] Meta Access Token is not configured. Simulating API call.');
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(META_GRAPH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [WhatsApp API] Meta API Error:', JSON.stringify(data));
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (err) {
    console.error('❌ [WhatsApp API] Connection Error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send a simple text message
 */
export async function sendTextMessage(to, text) {
  console.log(`💬 Sending WhatsApp Text to ${to}: "${text}"`);
  
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'text',
    text: { body: text }
  };

  const result = await sendMetaRequest(payload);
  
  // Log inside database
  await logMessage('System', to, text, 'outbound', result.success ? 'sent' : 'failed');
  
  return result;
}

/**
 * Send an approved Meta WhatsApp template message (Required to initiate user chats)
 */
export async function sendTemplateMessage(to, templateName, languageCode = 'en_US', components = []) {
  console.log(`📋 Sending WhatsApp Template (${templateName}) to ${to}`);

  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: components
    }
  };

  const result = await sendMetaRequest(payload);
  await logMessage('System', to, `[Template: ${templateName}]`, 'outbound', result.success ? 'sent' : 'failed');
  return result;
}

/**
 * Send a document/PDF via WhatsApp
 */
export async function sendDocumentMessage(to, documentUrl, fileName, caption) {
  console.log(`📄 Sending WhatsApp Document (${fileName}) to ${to}`);

  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'document',
    document: {
      link: documentUrl,
      filename: fileName,
      caption: caption
    }
  };

  const result = await sendMetaRequest(payload);
  await logMessage('System', to, `[File: ${fileName}] ${caption || ''}`, 'outbound', result.success ? 'sent' : 'failed');
  return result;
}

/**
 * Notify the Business Owner (Vikky Sharma) of a new site inquiry/lead
 */
export async function sendLeadNotificationToOwner(lead) {
  if (!BUSINESS_OWNER_NUMBER) {
    console.warn('⚠️ BUSINESS_OWNER_NUMBER not configured. Cannot send lead alert.');
    return;
  }

  const notificationText = `🔔 *New Lead Alert: Sketch Construction* 🔔\n\n` +
    `👤 *Name:* ${lead.name}\n` +
    `📞 *Phone:* ${lead.phone}\n` +
    `✉️ *Email:* ${lead.email || 'N/A'}\n` +
    `🏗️ *Project:* ${lead.project_type || 'N/A'}\n` +
    `💰 *Budget:* ${lead.budget || 'N/A'}\n` +
    `📝 *Brief:* ${lead.description || 'N/A'}\n` +
    `📎 *Attachment:* ${lead.attachment_url || 'None'}`;

  return await sendTextMessage(BUSINESS_OWNER_NUMBER, notificationText);
}
