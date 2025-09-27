'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  Eye,
  Plus,
  Search,
  Filter,
  Menu,
  Monitor,
  Home,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react'

// Mock data para el demo
const mockData = {
  kpis: {
    clientesActivos: 24,
    ingresoMensual: 48750,
    porCobrarHoy: 12300,
    vencidos: 3400
  },
  clientesToday: [
    {
      id: 1,
      name: 'Restaurant El Buen Sabor',
      amount: 4500,
      billingDay: 26,
      phone: '+54 11 1234-5678'
    },
    {
      id: 2,
      name: 'Farmacia Central',
      amount: 3200,
      billingDay: 26,
      phone: '+54 11 8765-4321'
    },
    {
      id: 3,
      name: 'Gimnasio Fitness Plus',
      amount: 4600,
      billingDay: 26,
      phone: '+54 11 5555-0000'
    }
  ],
  overdueClients: [
    {
      id: 4,
      name: 'Bar La Esquina',
      amount: 2800,
      billingDay: 20,
      phone: '+54 11 9999-1111',
      daysPastDue: 6
    },
    {
      id: 5,
      name: 'Panadería Don José',
      amount: 600,
      billingDay: 15,
      phone: '+54 11 7777-2222',
      daysPastDue: 11
    }
  ]
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => setLoading(false), 800)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const markAsPaid = (clientId: number, amount: number) => {
    alert(`Cliente ${clientId} marcado como pagado: ${formatCurrency(amount)}`)
  }

  const sendReminder = (clientId: number, phone: string) => {
    alert(`Recordatorio enviado al ${phone}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="nexus-card p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`nexus-sidebar fixed inset-y-0 left-0 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-30`}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <img src="/logo-led1.png" alt="LED1" className="h-8" />
          </div>

          <nav className="space-y-2">
            <a href="/dashboard" className="nexus-sidebar-item active">
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a href="/dashboard/clients" className="nexus-sidebar-item">
              <Users className="w-5 h-5 mr-3" />
              Clientes
            </a>
            <a href="/dashboard/reports" className="nexus-sidebar-item">
              <TrendingUp className="w-5 h-5 mr-3" />
              Reportes
            </a>
            <a href="/dashboard/expenses" className="nexus-sidebar-item">
              <DollarSign className="w-5 h-5 mr-3" />
              Gastos
            </a>
            <a href="/dashboard/settings" className="nexus-sidebar-item">
              <Settings className="w-5 h-5 mr-3" />
              Configuración
            </a>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="nexus-sidebar-item w-full justify-start text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="text-sm text-gray-600">
              Hoy: {new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Clientes Activos</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{mockData.kpis.clientesActivos}</p>
              <p className="text-sm text-green-600 mt-1">+2 este mes</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Ingreso Mensual</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(mockData.kpis.ingresoMensual)}</p>
              <p className="text-sm text-green-600 mt-1">+8.2% vs mes anterior</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Por Cobrar Hoy</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(mockData.kpis.porCobrarHoy)}</p>
              <p className="text-sm text-gray-600 mt-1">{mockData.clientesToday.length} clientes</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Vencidos</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(mockData.kpis.vencidos)}</p>
              <p className="text-sm text-red-600 mt-1">{mockData.overdueClients.length} clientes atrasados</p>
            </div>
          </div>

          {/* Clients to collect today */}
          {mockData.clientesToday.length > 0 && (
            <div className="nexus-card p-6 mb-8 fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Por Cobrar Hoy</h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {mockData.clientesToday.length} clientes
                </span>
              </div>

              <div className="space-y-4">
                {mockData.clientesToday.map((client) => (
                  <div key={client.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">Día de facturación: {client.billingDay}</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(client.amount)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendReminder(client.id, client.phone)}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          📱 Recordatorio
                        </button>
                        <button
                          onClick={() => markAsPaid(client.id, client.amount)}
                          className="nexus-btn nexus-btn-primary px-4 py-2 text-sm"
                        >
                          Marcar Pagado
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overdue clients */}
          {mockData.overdueClients.length > 0 && (
            <div className="nexus-card p-6 mb-8 fade-in border-red-200 bg-red-50/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Clientes Vencidos</h2>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {mockData.overdueClients.length} clientes
                </span>
              </div>

              <div className="space-y-4">
                {mockData.overdueClients.map((client) => (
                  <div key={client.id} className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <p className="text-sm text-red-600">Vencido hace {client.daysPastDue} días (día {client.billingDay})</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(client.amount)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendReminder(client.id, client.phone)}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          📱 Recordatorio
                        </button>
                        <button
                          onClick={() => markAsPaid(client.id, client.amount)}
                          className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Marcar Pagado
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="nexus-card p-6 fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="nexus-btn nexus-btn-primary p-4 justify-start">
                <Plus className="w-5 h-5 mr-3" />
                Agregar Cliente
              </button>
              <button className="p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Search className="w-5 h-5 mr-3" />
                Buscar Cliente
              </button>
              <a href="/dashboard/reports" className="p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Filter className="w-5 h-5 mr-3" />
                Ver Reportes
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}