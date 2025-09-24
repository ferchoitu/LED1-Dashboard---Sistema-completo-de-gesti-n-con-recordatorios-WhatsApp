import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const paymentSchema = z.object({
  client_id: z.string().uuid('ID de cliente inválido'),
  period_year: z.number().min(2020).max(2030),
  period_month: z.number().min(1).max(12),
  amount: z.number().positive('El monto debe ser positivo'),
  paid_at: z.string().datetime('Fecha de pago inválida'),
  notes: z.string().optional(),
})

// GET /api/payments - List payments with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    let query = supabase
      .from('payments')
      .select(`
        *,
        client:clients(name, business_name, phone_e164)
      `)
      .order('paid_at', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (year) {
      query = query.eq('period_year', parseInt(year))
    }

    if (month) {
      query = query.eq('period_month', parseInt(month))
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json(
        { error: 'Error fetching payments' },
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

// POST /api/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = paymentSchema.parse(body)

    // Check if client exists
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, name')
      .eq('id', validatedData.client_id)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Check if payment already exists for this client and period
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('client_id', validatedData.client_id)
      .eq('period_year', validatedData.period_year)
      .eq('period_month', validatedData.period_month)
      .single()

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Ya existe un pago registrado para este cliente en este período' },
        { status: 400 }
      )
    }

    // Create payment
    const { data, error } = await supabase
      .from('payments')
      .insert(validatedData)
      .select(`
        *,
        client:clients(name, business_name, phone_e164)
      `)
      .single()

    if (error) {
      console.error('Error creating payment:', error)
      return NextResponse.json(
        { error: 'Error creating payment' },
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