'use client'

import { useState } from 'react'
import { KpiCard } from '@/components/kpi-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateForDisplay } from '@/lib/date-utils'
import { mockKPIs, mockClientsToCollectToday, mockOverdueClients } from '@/lib/demo-data'

export default function DemoPage() {
  const [message, setMessage] = useState<string>('')

  const mockMarkAsPaid = (clientId: string) => {
    setMessage(`Cliente ${clientId} marcado como pagado (DEMO)`)
    setTimeout(() => setMessage(''), 3000)
  }

  const mockSendReminder = (clientId: string) => {
    setMessage(`Recordatorio enviado a cliente ${clientId} (DEMO)`)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LED1 - Panel Demo</h1>
            <p className="text-sm text-gray-600 mt-1">
              Hoy: {formatDateForDisplay(new Date())}
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            🎭 MODO DEMO
          </div>
        </div>
      </div>

      {/* Demo Message */}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4">
          <p className="text-green-700">{message}</p>
        </div>
      )}

      {/* Main content */}
      <main className="py-10">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <KpiCard
              title="Clientes Activos"
              value={mockKPIs.active_clients_count}
              icon="👥"
              description="Clientes con contratos vigentes"
            />

            <KpiCard
              title="MRR Esperado"
              value={mockKPIs.mrr_amount}
              icon="💰"
              description="Ingresos mensuales recurrentes"
              format="currency"
            />

            <KpiCard
              title="A Cobrar Hoy"
              value={mockKPIs.to_collect_today_amount}
              icon="📅"
              description={`${mockKPIs.to_collect_today_count} clientes`}
              format="currency"
            />

            <KpiCard
              title="Vencidos"
              value={mockKPIs.overdue_amount}
              icon="⚠️"
              description={`${mockKPIs.overdue_count} clientes atrasados`}
              format="currency"
            />
          </div>

          {/* Clients to collect today */}
          {mockClientsToCollectToday.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>A Cobrar Hoy</CardTitle>
                <CardDescription>
                  Clientes con vencimiento hoy ({formatDateForDisplay(new Date())})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClientsToCollectToday.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{client.name}</p>
                          <Badge variant="default">Día {client.billing_day}</Badge>
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
                          onClick={() => mockSendReminder(client.id)}
                        >
                          📱 Recordatorio
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => mockMarkAsPaid(client.id)}
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
          {mockOverdueClients.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Clientes Vencidos</CardTitle>
                <CardDescription>
                  Clientes con pagos atrasados de este mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOverdueClients.map((client) => (
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
                          onClick={() => mockSendReminder(client.id)}
                        >
                          📱 Recordatorio
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => mockMarkAsPaid(client.id)}
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

          {/* Demo Info */}
          <Card>
            <CardHeader>
              <CardTitle>🎭 Información del Demo</CardTitle>
              <CardDescription>
                Esta es una versión de demostración del Panel LED1
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Funcionalidades Demo:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>✅ Dashboard con KPIs visuales</li>
                    <li>✅ Lista de clientes a cobrar hoy</li>
                    <li>✅ Clientes vencidos con alertas</li>
                    <li>✅ Botones de acción (sin backend)</li>
                    <li>✅ Diseño responsive</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Datos de Prueba:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 6 clientes de ejemplo</li>
                    <li>• KPIs calculados dinámicamente</li>
                    <li>• Diferentes estados de clientes</li>
                    <li>• Montos en pesos argentinos</li>
                    <li>• Fechas de cobro variadas</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Nota:</strong> Este demo muestra la interfaz sin conexión a base de datos.
                  Los botones muestran mensajes de confirmación pero no realizan acciones reales.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}