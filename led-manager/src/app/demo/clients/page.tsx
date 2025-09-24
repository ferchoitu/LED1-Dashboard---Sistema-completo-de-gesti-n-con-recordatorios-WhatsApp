'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateForDisplay } from '@/lib/date-utils'
import { mockClients } from '@/lib/demo-data'
import type { Client } from '@/lib/types'

const statusLabels = {
  active: { label: 'Activo', variant: 'success' as const },
  paused: { label: 'Pausado', variant: 'warning' as const },
  ended: { label: 'Finalizado', variant: 'secondary' as const },
}

export default function DemoClientsPage() {
  const [clients] = useState<Client[]>(mockClients)
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [message, setMessage] = useState<string>('')

  const filterClients = () => {
    let filtered = clients

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.business_name?.toLowerCase().includes(term) ||
        client.phone_e164.includes(term)
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter)
    }

    setFilteredClients(filtered)
  }

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setTimeout(filterClients, 0)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setTimeout(filterClients, 0)
  }

  const exportToCSV = () => {
    showMessage('CSV exportado exitosamente (DEMO)')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes - Demo</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gestión completa de clientes LED1
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              🎭 MODO DEMO
            </div>
            <Button onClick={exportToCSV} variant="outline">
              📊 Exportar CSV
            </Button>
            <Button onClick={() => showMessage('Formulario de cliente abierto (DEMO)')}>
              ➕ Nuevo Cliente
            </Button>
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
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Nombre, empresa o teléfono..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activos</option>
                    <option value="paused">Pausados</option>
                    <option value="ended">Finalizados</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Mostrando {filteredClients.length} de {clients.length} clientes
              </div>
            </CardContent>
          </Card>

          {/* Clients list */}
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {client.name}
                        </h3>
                        <Badge variant={statusLabels[client.status].variant}>
                          {statusLabels[client.status].label}
                        </Badge>
                      </div>

                      {client.business_name && (
                        <p className="text-gray-600 mb-1">{client.business_name}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>📱 {client.phone_e164}</span>
                        <span>📅 Día {client.billing_day} de cada mes</span>
                        <span>💰 {formatCurrency(client.ticket_amount)}</span>
                        <span>📆 Desde {formatDateForDisplay(client.start_date)}</span>
                      </div>

                      {client.notes && (
                        <p className="mt-2 text-sm text-gray-500 italic">
                          📝 {client.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {client.status === 'active' && client.whatsapp_opt_in && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showMessage(`Recordatorio enviado a ${client.name} (DEMO)`)}
                        >
                          📱 Recordatorio
                        </Button>
                      )}

                      {client.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showMessage(`Cliente ${client.name} pausado (DEMO)`)}
                        >
                          ⏸️ Pausar
                        </Button>
                      )}

                      {client.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showMessage(`Cliente ${client.name} activado (DEMO)`)}
                        >
                          ▶️ Activar
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showMessage(`Editando ${client.name} (DEMO)`)}
                      >
                        ✏️ Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>🎭 Demo - Gestión de Clientes</CardTitle>
              <CardDescription>
                Funcionalidades disponibles en la versión completa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Funcionalidades Implementadas:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>✅ Lista completa con filtros</li>
                    <li>✅ Búsqueda por nombre/empresa/teléfono</li>
                    <li>✅ Filtros por estado</li>
                    <li>✅ Botones de acción por cliente</li>
                    <li>✅ Información detallada</li>
                    <li>✅ Export CSV</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Con Base de Datos Real:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Formulario completo de alta/edición</li>
                    <li>• Cambios de estado persistentes</li>
                    <li>• Envío real de recordatorios WhatsApp</li>
                    <li>• Validaciones con Zod</li>
                    <li>• Historial de cambios</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}