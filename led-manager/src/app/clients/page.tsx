'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { formatCurrency, formatDateForDisplay } from '@/lib/date-utils'
import { ClientFormDialog } from '@/components/client-form-dialog'
import type { Client } from '@/lib/types'

const statusLabels = {
  active: { label: 'Activo', variant: 'success' as const },
  paused: { label: 'Pausado', variant: 'warning' as const },
  ended: { label: 'Finalizado', variant: 'secondary' as const },
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showClientForm, setShowClientForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const supabase = createSupabaseClient()

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [clients, searchTerm, statusFilter])

  const loadClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const updateClientStatus = async (clientId: string, newStatus: Client['status']) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', clientId)

      if (error) throw error

      // Update local state
      setClients(prev => prev.map(client =>
        client.id === clientId ? { ...client, status: newStatus } : client
      ))
    } catch (error) {
      console.error('Error updating client status:', error)
      alert('Error al actualizar el estado del cliente')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Nombre',
      'Empresa',
      'Teléfono',
      'Estado',
      'Fecha Inicio',
      'Día Cobro',
      'Monto',
      'Moneda'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredClients.map(client => [
        `"${client.name}"`,
        `"${client.business_name || ''}"`,
        client.phone_e164,
        client.status,
        client.start_date,
        client.billing_day,
        client.ticket_amount,
        client.currency
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateClient = async (data: any) => {
    try {
      const { error } = await supabase
        .from('clients')
        .insert([data])

      if (error) throw error

      loadClients()
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  const handleUpdateClient = async (data: any) => {
    if (!editingClient) return

    try {
      const { error } = await supabase
        .from('clients')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingClient.id)

      if (error) throw error

      loadClients()
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  const handleCloseForm = () => {
    setShowClientForm(false)
    setEditingClient(null)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowClientForm(true)
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
            <h1 className="text-xl font-semibold text-gray-900 lg:hidden">Clientes</h1>
          </div>
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg" />
                ))}
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
              <h1 className="text-xl font-semibold text-gray-900">Clientes</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <Button onClick={exportToCSV} variant="outline">
                📊 Exportar CSV
              </Button>
              <Button onClick={() => setShowClientForm(true)}>
                ➕ Nuevo Cliente
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
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
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                      onChange={(e) => setStatusFilter(e.target.value)}
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
                    <div className="flex items-center justify-between">
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

                      <div className="flex items-center gap-2 ml-4">
                        {client.status === 'active' && client.whatsapp_opt_in && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendWhatsAppReminder(client.id)}
                          >
                            📱 Recordatorio
                          </Button>
                        )}

                        {client.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateClientStatus(client.id, 'paused')}
                          >
                            ⏸️ Pausar
                          </Button>
                        )}

                        {client.status === 'paused' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateClientStatus(client.id, 'active')}
                          >
                            ▶️ Activar
                          </Button>
                        )}

                        {(client.status === 'active' || client.status === 'paused') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateClientStatus(client.id, 'ended')}
                          >
                            🏁 Finalizar
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClient(client)}
                        >
                          ✏️ Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredClients.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No se encontraron clientes'
                        : 'No hay clientes registrados'
                      }
                    </h3>
                    <p className="text-gray-600 text-center max-w-md mb-4">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Comienza agregando tu primer cliente para gestionar los pagos'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Button onClick={() => setShowClientForm(true)}>
                        ➕ Agregar Primer Cliente
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Client Form Dialog */}
      <ClientFormDialog
        isOpen={showClientForm}
        onClose={handleCloseForm}
        onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
        initialData={editingClient ? {
          name: editingClient.name,
          business_name: editingClient.business_name,
          phone_e164: editingClient.phone_e164,
          whatsapp_opt_in: editingClient.whatsapp_opt_in,
          status: editingClient.status,
          start_date: editingClient.start_date,
          end_date: editingClient.end_date,
          ticket_amount: editingClient.ticket_amount,
          currency: editingClient.currency,
          billing_frequency: editingClient.billing_frequency,
          billing_day: editingClient.billing_day,
          notes: editingClient.notes
        } : undefined}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      />
    </div>
  )
}