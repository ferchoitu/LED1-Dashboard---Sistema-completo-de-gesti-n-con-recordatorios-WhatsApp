export async function sendWhatsAppText(toE164: string, text: string) {
  if (process.env.WHATSAPP_PROVIDER === 'cloud') {
    const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_CLOUD_PHONE_ID}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_TOKEN}`,
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

  // TODO: soporte Twilio si WHATSAPP_PROVIDER=twilio
  throw new Error('WhatsApp provider not configured or unsupported');
}

export function formatReminderMessage(
  clientName: string,
  amount: number,
  currency: string = 'ARS'
): string {
  const formattedAmount = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return `Hola ${clientName}, ¿cómo va? Te escribimos de LED1 para recordarte el abono de este mes: ${formattedAmount}. Podés responder a este WhatsApp ante cualquier duda. ¡Gracias!`;
}