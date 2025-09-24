import type { Client, KPIs } from './types'

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    business_name: 'Panadería El Buen Pan',
    phone_e164: '+5491134567890',
    whatsapp_opt_in: true,
    status: 'active',
    start_date: '2024-01-15',
    end_date: undefined,
    ticket_amount: 150000,
    currency: 'ARS',
    billing_frequency: 'monthly',
    billing_day: 15,
    notes: 'Cliente fundador, siempre paga a tiempo',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'María González',
    business_name: 'Farmacia Central',
    phone_e164: '+5491145678901',
    whatsapp_opt_in: true,
    status: 'active',
    start_date: '2024-02-01',
    end_date: undefined,
    ticket_amount: 180000,
    currency: 'ARS',
    billing_frequency: 'monthly',
    billing_day: 1,
    notes: 'Ubicación premium, muy visible',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z'
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    business_name: 'Taller Mecánico Rodriguez',
    phone_e164: '+5491156789012',
    whatsapp_opt_in: true,
    status: 'active',
    start_date: '2024-01-20',
    end_date: undefined,
    ticket_amount: 120000,
    currency: 'ARS',
    billing_frequency: 'monthly',
    billing_day: 20,
    notes: 'Descuento por pago anual',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-20T11:00:00Z'
  },
  {
    id: '4',
    name: 'Ana López',
    business_name: 'Inmobiliaria López & Asoc.',
    phone_e164: '+5491167890123',
    whatsapp_opt_in: true,
    status: 'active',
    start_date: '2024-03-05',
    end_date: undefined,
    ticket_amount: 200000,
    currency: 'ARS',
    billing_frequency: 'monthly',
    billing_day: 5,
    notes: 'Cliente VIP, múltiples propiedades',
    created_at: '2024-03-05T14:00:00Z',
    updated_at: '2024-03-05T14:00:00Z'
  },
  {
    id: '5',
    name: 'Roberto Silva',
    business_name: 'Restaurante La Esquina',
    phone_e164: '+5491178901234',
    whatsapp_opt_in: true,
    status: 'active',
    start_date: '2024-02-10',
    end_date: undefined,
    ticket_amount: 150000,
    currency: 'ARS',
    billing_frequency: 'monthly',
    billing_day: 10,
    notes: 'Horarios especiales de publicidad',
    created_at: '2024-02-10T16:00:00Z',
    updated_at: '2024-02-10T16:00:00Z'
  },
  {
    id: '6',
    name: 'Laura Martínez',
    business_name: 'Clínica Dental Sonrisas',
    phone_e164: '+5491189012345',
    whatsapp_opt_in: true,
    status: 'paused',
    start_date: '2024-01-25',
    end_date: undefined,
    ticket_amount: 175000,
    currency: 'ARS',
    billing_frequency: 'monthly',
    billing_day: 25,
    notes: 'Pausado temporalmente por renovaciones',
    created_at: '2024-01-25T13:00:00Z',
    updated_at: '2024-08-15T10:00:00Z'
  }
]

export const mockKPIs: KPIs = {
  active_clients_count: 5,
  mrr_amount: 800000,
  to_collect_today_count: 2,
  to_collect_today_amount: 350000,
  overdue_count: 1,
  overdue_amount: 180000
}

export const mockClientsToCollectToday: Client[] = [
  mockClients[0], // Juan Pérez - billing_day 15
  mockClients[3]  // Ana López - billing_day 5
]

export const mockOverdueClients: Client[] = [
  mockClients[1] // María González - billing_day 1
]