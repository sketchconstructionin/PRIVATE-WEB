// Express API Server with WhatsApp Business Webhook and Chatbot Auto-Responder
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  sendTextMessage,
  sendLeadNotificationToOwner
} from './whatsappService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  META_VERIFY_TOKEN
} = process.env;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Sketch Construction API is running.' });
});

/**
 * Endpoint to receive website lead form submissions
 * Stores lead in Supabase and triggers WhatsApp alerts
 */
app.post('/api/lead', async (req, res) => {
  console.log('📥 Received lead submission:', req.body);
  const { name, email, phone, project_type, budget, description, attachment_url } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and Phone number are required fields.' });
  }

  try {
    // 1. Insert Lead into Supabase DB
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          project_type,
          budget,
          description,
          attachment_url,
          whatsapp_status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Database insertion error:', error.message);
      return res.status(500).json({ success: false, error: 'Failed to save lead in database.' });
    }

    const insertedLead = data[0];

    // 2. Send WhatsApp Notification to the Business Owner (Vikky Sharma)
    const ownerNotifyResult = await sendLeadNotificationToOwner(insertedLead);

    // 3. Send automated Welcome/Acknowledgement text to the client
    const clientMessage = `Hello *${name}*,\n\n` +
      `Thank you for reaching out to *Sketch Construction & Civil Engineers Raipur*! 🏗️\n\n` +
      `We have received your inquiry regarding the *${project_type || 'Civil construction'}* project scale. Our engineer will review your brief and contact you shortly to schedule an on-site technical inspection.\n\n` +
      `For instant material estimations, feel free to use our online calculator: https://sketchconstruction.in/calculator.html\n\n` +
      `Best Regards,\n` +
      `*Vikky Sharma*\n` +
      `Lead Civil Engineer | Sketch Construction`;

    const clientNotifyResult = await sendTextMessage(phone.replace(/\D/g, ''), clientMessage);

    // 4. Update WhatsApp status in database if sent successfully
    if (clientNotifyResult.success) {
      await supabase
        .from('leads')
        .update({ whatsapp_status: 'sent' })
        .eq('id', insertedLead.id);
    } else {
      await supabase
        .from('leads')
        .update({ whatsapp_status: 'failed' })
        .eq('id', insertedLead.id);
    }

    res.status(200).json({
      success: true,
      message: 'Lead registered and WhatsApp notifications initiated.',
      leadId: insertedLead.id,
      simulated: clientNotifyResult.simulated || false
    });

  } catch (err) {
    console.error('Error handling lead workflow:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Verification Webhook Endpoint for Meta Developers portal setup
 */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully by Meta.');
      res.status(200).send(challenge);
    } else {
      console.warn('❌ Webhook verification failed. Tokens mismatch.');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

/**
 * Webhook handler for incoming WhatsApp Events (User responses)
 * Interactive Auto-Responder Chatbot Logic
 */
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Validate webhook payload
  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const fromNumber = message.from; // Sender phone number
      const contactInfo = body.entry[0].changes[0].value.contacts[0];
      const senderName = contactInfo ? contactInfo.profile.name : 'Client';

      // Capture message content type text
      if (message.type === 'text') {
        const textVal = message.text.body.trim();
        const textLower = textVal.toLowerCase();

        console.log(`✉️ Incoming WhatsApp message from ${senderName} (${fromNumber}): "${textVal}"`);

        // Insert inbound message log to database
        try {
          await supabase.from('whatsapp_logs').insert([
            {
              from_number: fromNumber,
              to_number: 'System',
              message_body: textVal,
              direction: 'inbound',
              status: 'delivered'
            }
          ]);
        } catch (dbErr) {
          console.error('Failed logging inbound message to DB:', dbErr.message);
        }

        // ========================================================
        // Chatbot Auto-Response Decision Tree
        // ========================================================
        let responseMessage = '';

        if (textLower === '1' || textLower.includes('estimat') || textLower.includes('calculat')) {
          // Send Calculator Link
          responseMessage = `📊 *Sketch Material Estimator* 📊\n\n` +
            `Hello ${senderName}, you can calculate cement, sand, aggregates, and brick quantities instantly using our custom calculator module:\n\n` +
            `🔗 https://sketchconstruction.in/calculator.html\n\n` +
            `Simply insert your plot size and floor configurations to generate a structural estimation report.`;
            
        } else if (textLower === '2' || textLower.includes('portfolio') || textLower.includes('work') || textLower.includes('project')) {
          // Send Portfolio details
          responseMessage = `🏗️ *Active Site Portfolio | Raipur* 🏗️\n\n` +
            `Here are some of our ongoing premium structural construction projects:\n\n` +
            `1️⃣ *VIP Road Duplex Shells*\n` +
            `   - Member mixes: M25 concrete deck shells.\n` +
            `   - Stage: Curing and layout completion.\n\n` +
            `2️⃣ *Sadar Bazar Complex*\n` +
            `   - Turnkey commercial foundation, centerline mapping.\n\n` +
            `Explore detailed blueprints online:\n` +
            `🔗 https://sketchconstruction.in/blueprint-viewer.html`;

        } else if (textLower === '3' || textLower.includes('cure') || textLower.includes('curing') || textLower.includes('log')) {
          // Send Curing log links
          responseMessage = `💧 *Concrete Curing Log Monitor* 💧\n\n` +
            `We maintain active quality check logs on-site for M25 grade columns and beams. Check structural signoff registers here:\n\n` +
            `🔗 https://sketchconstruction.in/curing-log.html`;

        } else if (textLower === '4' || textLower.includes('contact') || textLower.includes('talk') || textLower.includes('engineer') || textLower.includes('vikky')) {
          // Contact Owner Alert
          responseMessage = `📞 *Connecting with Engineer Vikky Sharma* 📞\n\n` +
            `Hi ${senderName}, I have notified our lead engineer about your request. Vikky Sharma will contact you shortly on this number.\n\n` +
            `For direct queries, call us at:\n` +
            `📱 +91 8349886687 / +91 6263898315`;

          // Trigger background alert message to Vikky
          if (process.env.BUSINESS_OWNER_NUMBER) {
            const ownerAlert = `🚨 *WhatsApp Chatbot Alert* 🚨\n\n` +
              `Client *${senderName}* (${fromNumber}) requested contact call-back. Please call them directly.`;
            sendTextMessage(process.env.BUSINESS_OWNER_NUMBER, ownerAlert).catch(console.error);
          }

        } else {
          // Default Welcome Menu message
          responseMessage = `Welcome to *Sketch Construction Raipur* Chat Assistant! 🏗️\n\n` +
            `Hi *${senderName}*, I am the WhatsApp bot. How can we help you build today?\n\n` +
            `Reply with the number (or type the word):\n` +
            `1️⃣ *Calculator* — Material Cost Estimator\n` +
            `2️⃣ *Portfolio* — View Active Construction Projects\n` +
            `3️⃣ *Curing* — Concrete Curing Quality Logs\n` +
            `4️⃣ *Contact* — Talk to Civil Engineer Vikky Sharma\n\n` +
            `Sketching your future with structural integrity. Standard-compliant structures.`;
        }

        // Send response message back to client via Meta WhatsApp API
        await sendTextMessage(fromNumber, responseMessage);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Sketch Construction WhatsApp API server running on port: ${PORT}`);
});
