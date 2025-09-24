'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { KpiCard } from '@/components/kpi-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { formatCurrency, formatDateForDisplay, getCurrentPeriod, getTodayInArgentina } from '@/lib/date-utils'
import type { KPIs, Client, Payment } from '@/lib/types'

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [clientsToCollectToday, setClientsToCollectToday] = useState<Client[]>([])
  const [overdueClients, setOverdueClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseClient()
  const today = getTodayInArgentina()
  const currentPeriod = getCurrentPeriod()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load KPIs
      const { data: kpisData } = await supabase
        .from('v_kpis')
        .select('*')
        .single()

      if (kpisData) {
        setKpis(kpisData)
      }

      // Load clients to collect today
      const { data: todayClients } = await supabase
        .from('clients')
        .select('*')
        .eq('status', 'active')
        .eq('billing_day', today.day)
        .is('end_date', null)
        .or(`end_date.gte.${new Date().toISOString().split('T')[0]}`)

      if (todayClients) {
        // Filter out clients who already paid this month
        const { data: existingPayments } = await supabase
          .from('payments')
          .select('client_id')
          .in('client_id', todayClients.map(c => c.id))
          .eq('period_year', currentPeriod.year)
          .eq('period_month', currentPeriod.month)

        const paidClientIds = new Set(existingPayments?.map(p => p.client_id) || [])
        const unpaidClients = todayClients.filter(c => !paidClientIds.has(c.id))
        setClientsToCollectToday(unpaidClients)
      }

      // Load overdue clients
      const { data: potentialOverdueClients } = await supabase
        .from('clients')
        .select('*')
        .eq('status', 'active')
        .lt('billing_day', today.day)
        .is('end_date', null)
        .or(`end_date.gte.${new Date().toISOString().split('T')[0]}`)

      if (potentialOverdueClients) {
        // Filter out clients who already paid this month
        const { data: existingPayments } = await supabase
          .from('payments')
          .select('client_id')
          .in('client_id', potentialOverdueClients.map(c => c.id))
          .eq('period_year', currentPeriod.year)
          .eq('period_month', currentPeriod.month)

        const paidClientIds = new Set(existingPayments?.map(p => p.client_id) || [])
        const actualOverdueClients = potentialOverdueClients.filter(c => !paidClientIds.has(c.id))
        setOverdueClients(actualOverdueClients)
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsPaid = async (clientId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          client_id: clientId,
          period_year: currentPeriod.year,
          period_month: currentPeriod.month,
          amount,
          paid_at: new Date().toISOString(),
          notes: 'Marcado como pagado desde dashboard'
        })

      if (error) throw error

      // Refresh data
      loadDashboardData()
    } catch (error) {
      console.error('Error marking as paid:', error)
      alert('Error al marcar como pagado')
    }
  }

  const sendWhatsAppReminder = async (clientId: string) => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_id: clientId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error enviando mensaje')
      }

      alert('¡Recordatorio enviado por WhatsApp!')
    } catch (error) {
      console.error('Error sending reminder:', error)
      alert(error instanceof Error ? error.message : 'Error enviando recordatorio')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
            <MobileNav />
            <h1 className="text-xl font-semibold text-gray-900 lg:hidden">Dashboard</h1>
          </div>
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:pl-72">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
          <MobileNav />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <div className="text-sm text-gray-600">
                Hoy: {formatDateForDisplay(new Date())}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <KpiCard
                title="Clientes Activos"
                value={kpis?.active_clients_count || 0}
                icon="👥"
                description="Clientes con contratos vigentes"
              />

              <KpiCard
                title="MRR Esperado"
                value={kpis?.mrr_amount || 0}
                icon="💰"
                description="Ingresos mensuales recurrentes"
                format="currency"
              />

              <KpiCard
                title="A Cobrar Hoy"
                value={kpis?.to_collect_today_amount || 0}
                icon="📅"
                description={`${kpis?.to_collect_today_count || 0} clientes`}
                format="currency"
              />

              <KpiCard
                title="Vencidos"
                value={kpis?.overdue_amount || 0}
                icon="⚠️"
                description={`${kpis?.overdue_count || 0} clientes atrasados`}
                format="currency"
              />
            </div>

            {/* Clients to collect today */}
            {clientsToCollectToday.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>A Cobrar Hoy</CardTitle>
                  <CardDescription>
                    Clientes con vencimiento hoy ({formatDateForDisplay(new Date())})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientsToCollectToday.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{client.name}</p>
                            <Badge variant="warning">Día {client.billing_day}</Badge>
                          </div>
                          {client.business_name && (
                            <p className="text-sm text-gray-600">{client.business_name}</p>
                          )}
                          <p className="text-sm font-semibold text-green-600">
                            {formatCurrency(client.ticket_amount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendWhatsAppReminder(client.id)}
                          >
                            📱 Recordatorio
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => markAsPaid(client.id, client.ticket_amount)}
                          >
                            Marcar Cobrado
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overdue clients */}
            {overdueClients.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Clientes Vencidos</CardTitle>
                  <CardDescription>
                    Clientes con pagos atrasados de este mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overdueClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{client.name}</p>
                            <Badge variant="destructive">
                              Vencido día {client.billing_day}
                            </Badge>
                          </div>
                          {client.business_name && (
                            <p className="text-sm text-gray-600">{client.business_name}</p>
                          )}
                          <p className="text-sm font-semibold text-red-600">
                            {formatCurrency(client.ticket_amount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendWhatsAppReminder(client.id)}
                          >
                            📱 Recordatorio
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsPaid(client.id, client.ticket_amount)}
                          >
                            Marcar Cobrado
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty states */}
            {clientsToCollectToday.length === 0 && overdueClients.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¡Todo al día!
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    No hay pagos pendientes para hoy. Todos los clientes están al día con sus pagos.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}