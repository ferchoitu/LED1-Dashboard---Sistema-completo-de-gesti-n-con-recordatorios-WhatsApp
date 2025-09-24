import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWhatsAppText, formatReminderMessage } from '@/lib/whatsapp'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sendNotificationSchema = z.object({
  client_id: z.string().uuid('ID de cliente inválido'),
  message_override: z.string().optional(), // Mensaje personalizado opcional
})

// POST /api/notifications/send - Send WhatsApp reminder to specific client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sendNotificationSchema.parse(body)

    // Get client information
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', validatedData.client_id)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    if (!client.whatsapp_opt_in) {
      return NextResponse.json(
        { error: 'Cliente no tiene WhatsApp habilitado' },
        { status: 400 }
      )
    }

    // Prepare message
    const message = validatedData.message_override ||
      formatReminderMessage(client.name, client.ticket_amount, client.currency)

    let notificationStatus = 'pending'
    let providerMessageId: string | null = null
    let errorMessage: string | null = null

    try {
      // Send WhatsApp message
      const response = await sendWhatsAppText(client.phone_e164, message)
      notificationStatus = 'sent'
      providerMessageId = response.messages?.[0]?.id || null
    } catch (whatsappError) {
      console.error('WhatsApp sending error:', whatsappError)
      notificationStatus = 'failed'
      errorMessage = whatsappError instanceof Error ? whatsappError.message : 'Unknown error'
    }

    // Log notification
    const { data: notificationLog, error: logError } = await supabase
      .from('notifications_log')
      .insert({
        client_id: validatedData.client_id,
        status: notificationStatus,
        provider_message_id: providerMessageId,
        message_body: message,
        error_message: errorMessage,
      })
      .select()
      .single()

    if (logError) {
      console.error('Error logging notification:', logError)
    }

    if (notificationStatus === 'failed') {
      return NextResponse.json(
        {
          error: 'Error sending WhatsApp message',
          details: errorMessage,
          notification_log: notificationLog
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Mensaje enviado exitosamente',
      client: {
        id: client.id,
        name: client.name,
        phone: client.phone_e164
      },
      provider_message_id: providerMessageId,
      notification_log: notificationLog
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}