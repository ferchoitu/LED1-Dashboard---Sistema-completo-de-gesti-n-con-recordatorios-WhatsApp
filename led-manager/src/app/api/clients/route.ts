import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  business_name: z.string().optional(),
  phone_e164: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Formato de teléfono inválido (debe ser E.164, ej: +5491134567890)'),
  whatsapp_opt_in: z.boolean().default(true),
  status: z.enum(['active', 'paused', 'ended']).default('active'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  ticket_amount: z.number().positive('El monto debe ser positivo'),
  currency: z.string().default('ARS'),
  billing_frequency: z.enum(['monthly', 'custom']).default('monthly'),
  billing_day: z.number().min(1).max(28, 'El día de cobro debe estar entre 1 y 28'),
  notes: z.string().optional(),
})

// GET /api/clients - List all clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,business_name.ilike.%${search}%,phone_e164.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching clients:', error)
      return NextResponse.json(
        { error: 'Error fetching clients' },
        { status: 500 }
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

// POST /api/clients - Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = clientSchema.parse(body)

    // Check if phone number already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('phone_e164', validatedData.phone_e164)
      .single()

    if (existingClient) {
      return NextResponse.json(
        { error: 'Ya existe un cliente con este número de teléfono' },
        { status: 400 }
      )
    }

    // Create client
    const { data, error } = await supabase
      .from('clients')
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      return NextResponse.json(
        { error: 'Error creating client' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
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