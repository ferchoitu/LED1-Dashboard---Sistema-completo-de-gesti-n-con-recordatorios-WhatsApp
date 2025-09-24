import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Client {
  id: string;
  name: string;
  phone_e164: string;
  ticket_amount: number;
  currency: string;
  billing_day: number;
  whatsapp_opt_in: boolean;
}

interface WhatsAppResponse {
  messages?: Array<{ id: string }>;
}

async function sendWhatsAppText(toE164: string, text: string): Promise<WhatsAppResponse> {
  const whatsappProvider = Deno.env.get('WHATSAPP_PROVIDER') || 'cloud';

  if (whatsappProvider === 'cloud') {
    const token = Deno.env.get('WHATSAPP_CLOUD_TOKEN');
    const phoneId = Deno.env.get('WHATSAPP_CLOUD_PHONE_ID');

    if (!token || !phoneId) {
      throw new Error('WhatsApp Cloud API credentials not configured');
    }

    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toE164,
        type: 'text',
        text: { body: text },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WhatsApp error ${response.status}: ${error}`);
    }

    return response.json();
  }

  // TODO: Add Twilio support if needed
  throw new Error('WhatsApp provider not configured or unsupported');
}

function formatReminderMessage(clientName: string, amount: number, currency: string = 'ARS'): string {
  const formattedAmount = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return `Hola ${clientName}, ¿cómo va? Te escribimos de LED1 para recordarte el abono de este mes: ${formattedAmount}. Podés responder a este WhatsApp ante cualquier duda. ¡Gracias!`;
}

function getTodayInArgentina(): { day: number; month: number; year: number } {
  // Get current date in Argentina timezone
  const now = new Date();
  const argentinaOffset = -3; // UTC-3 for Argentina
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const argentinaTime = new Date(utc + (argentinaOffset * 3600000));

  return {
    day: argentinaTime.getDate(),
    month: argentinaTime.getMonth() + 1,
    year: argentinaTime.getFullYear(),
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const today = getTodayInArgentina();

    console.log(`Running WhatsApp reminders for ${today.year}-${today.month.toString().padStart(2, '0')}-${today.day.toString().padStart(2, '0')}`);

    // Get clients who should be charged today and haven't paid yet
    const { data: clientsToCharge, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('status', 'active')
      .eq('billing_day', today.day)
      .eq('whatsapp_opt_in', true)
      .or('end_date.is.null,end_date.gte.' + new Date().toISOString().split('T')[0]);

    if (clientsError) {
      throw new Error(`Error fetching clients: ${clientsError.message}`);
    }

    if (!clientsToCharge || clientsToCharge.length === 0) {
      console.log('No clients to charge today');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No clients to charge today',
          processed: 0,
          sent: 0,
          failed: 0,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check which clients have already paid this month
    const clientIds = clientsToCharge.map((c: Client) => c.id);
    const { data: existingPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('client_id')
      .in('client_id', clientIds)
      .eq('period_year', today.year)
      .eq('period_month', today.month);

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
    }

    const paidClientIds = new Set((existingPayments || []).map(p => p.client_id));
    const unpaidClients = clientsToCharge.filter((client: Client) => !paidClientIds.has(client.id));

    console.log(`Found ${unpaidClients.length} clients to send reminders to`);

    const results = {
      processed: unpaidClients.length,
      sent: 0,
      failed: 0,
      details: [] as Array<{ client_id: string; name: string; status: string; error?: string }>
    };

    // Send reminders to unpaid clients
    for (const client of unpaidClients) {
      const message = formatReminderMessage(client.name, client.ticket_amount, client.currency);

      let notificationStatus = 'pending';
      let providerMessageId: string | null = null;
      let errorMessage: string | null = null;

      try {
        console.log(`Sending WhatsApp to ${client.name} (${client.phone_e164})`);
        const response = await sendWhatsAppText(client.phone_e164, message);
        notificationStatus = 'sent';
        providerMessageId = response.messages?.[0]?.id || null;
        results.sent++;
        results.details.push({
          client_id: client.id,
          name: client.name,
          status: 'sent'
        });
      } catch (error) {
        console.error(`Failed to send WhatsApp to ${client.name}:`, error);
        notificationStatus = 'failed';
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.failed++;
        results.details.push({
          client_id: client.id,
          name: client.name,
          status: 'failed',
          error: errorMessage
        });
      }

      // Log the notification attempt
      const { error: logError } = await supabase
        .from('notifications_log')
        .insert({
          client_id: client.id,
          status: notificationStatus,
          provider_message_id: providerMessageId,
          message_body: message,
          error_message: errorMessage,
        });

      if (logError) {
        console.error(`Error logging notification for ${client.name}:`, logError);
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Reminders completed: ${results.sent} sent, ${results.failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.processed} clients`,
        ...results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Edge Function error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});