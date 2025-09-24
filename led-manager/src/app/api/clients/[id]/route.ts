import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updateClientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  business_name: z.string().optional().nullable(),
  phone_e164: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Formato de teléfono inválido (debe ser E.164, ej: +5491134567890)').optional(),
  whatsapp_opt_in: z.boolean().optional(),
  status: z.enum(['active', 'paused', 'ended']).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  ticket_amount: z.number().positive('El monto debe ser positivo').optional(),
  currency: z.string().optional(),
  billing_frequency: z.enum(['monthly', 'custom']).optional(),
  billing_day: z.number().min(1).max(28, 'El día de cobro debe estar entre 1 y 28').optional(),
  notes: z.string().optional().nullable(),
})

// GET /api/clients/[id] - Get single client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = updateClientSchema.parse(body)

    // Check if client exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('id', params.id)
      .single()

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // If updating phone, check for duplicates
    if (validatedData.phone_e164) {
      const { data: duplicatePhone } = await supabase
        .from('clients')
        .select('id')
        .eq('phone_e164', validatedData.phone_e164)
        .neq('id', params.id)
        .single()

      if (duplicatePhone) {
        return NextResponse.json(
          { error: 'Ya existe otro cliente con este número de teléfono' },
          { status: 400 }
        )
      }
    }

    // Update client
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating client:', error)
      return NextResponse.json(
        { error: 'Error updating client' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
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

// DELETE /api/clients/[id] - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if client exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('id', params.id)
      .single()

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Check if client has associated payments
    const { data: payments } = await supabase
      .from('payments')
      .select('id')
      .eq('client_id', params.id)
      .limit(1)

    if (payments && payments.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un cliente que tiene pagos registrados' },
        { status: 400 }
      )
    }

    // Delete client
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting client:', error)
      return NextResponse.json(
        { error: 'Error deleting client' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}