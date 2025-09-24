export interface Client {
  id: string
  name: string
  business_name?: string
  phone_e164: string
  whatsapp_opt_in: boolean
  status: 'active' | 'paused' | 'ended'
  start_date: string
  end_date?: string
  ticket_amount: number
  currency: string
  billing_frequency: 'monthly' | 'custom'
  billing_day: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  client_id: string
  period_year: number
  period_month: number
  amount: number
  paid_at: string
  notes?: string
  created_at: string
  client?: Client
}

export interface NotificationLog {
  id: string
  client_id: string
  sent_at: string
  status: 'sent' | 'failed' | 'pending'
  provider_message_id?: string
  message_body?: string
  error_message?: string
  created_at: string
  client?: Client
}

export interface KPIs {
  active_clients_count: number
  mrr_amount: number
  to_collect_today_count: number
  to_collect_today_amount: number
  overdue_count: number
  overdue_amount: number
}

export interface ExpectedMonthlyRevenue {
  charged_year: number
  charged_month: number
  client_id: string
  name: string
  business_name?: string
  amount: number
  billing_day: number
  phone_e164: string
}