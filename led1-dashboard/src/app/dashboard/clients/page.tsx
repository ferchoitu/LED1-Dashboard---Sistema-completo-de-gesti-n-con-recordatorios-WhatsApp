'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Menu,
  Monitor,
  Home,
  Settings,
  LogOut,
  Eye,
  X,
  Save
} from 'lucide-react'

// Mock data para clientes
const mockClients = [
  {
    id: 1,
    name: 'Restaurant El Buen Sabor',
    businessName: 'El Buen Sabor S.R.L.',
    email: 'contacto@elbuensabor.com',
    phone: '+54 11 1234-5678',
    address: 'Av. Corrientes 1234, CABA',
    monthlyAmount: 4500,
    billingDay: 26,
    startDate: '2023-08-15',
    endDate: null,
    status: 'active',
    plan: 'Premium'
  },
  {
    id: 2,
    name: 'Farmacia Central',
    businessName: 'Farmacia Central',
    email: 'admin@farmaciacentral.com',
    phone: '+54 11 8765-4321',
    address: 'San Martín 567, CABA',
    monthlyAmount: 3200,
    billingDay: 26,
    startDate: '2023-06-01',
    endDate: null,
    status: 'active',
    plan: 'Standard'
  },
  {
    id: 3,
    name: 'Gimnasio Fitness Plus',
    businessName: 'Fitness Plus S.A.',
    email: 'info@fitnessplus.com',
    phone: '+54 11 5555-0000',
    address: 'Belgrano 890, CABA',
    monthlyAmount: 4600,
    billingDay: 26,
    startDate: '2023-09-01',
    endDate: null,
    status: 'active',
    plan: 'Premium'
  },
  {
    id: 4,
    name: 'Bar La Esquina',
    businessName: 'La Esquina Bar',
    email: 'laesquina@gmail.com',
    phone: '+54 11 9999-1111',
    address: 'Rivadavia 2345, CABA',
    monthlyAmount: 2800,
    billingDay: 20,
    startDate: '2023-04-10',
    endDate: null,
    status: 'active',
    plan: 'Basic'
  },
  {
    id: 5,
    name: 'Panadería Don José',
    businessName: 'Panadería Don José',
    email: 'donjose@panaderia.com',
    phone: '+54 11 7777-2222',
    address: 'Independencia 456, CABA',
    monthlyAmount: 600,
    billingDay: 15,
    startDate: '2023-03-01',
    endDate: '2024-01-15',
    status: 'inactive',
    plan: 'Basic'
  }
]

export default function ClientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [clients, setClients] = useState(mockClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Activo</span>
    }
    return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Inactivo</span>
  }

  const getPlanBadge = (plan: string) => {
    const colors = {
      Basic: 'bg-gray-100 text-gray-800',
      Standard: 'bg-blue-100 text-blue-800',
      Premium: 'bg-purple-100 text-purple-800'
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[plan as keyof typeof colors]}`}>{plan}</span>
  }

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setShowViewModal(true)
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setShowEditModal(true)
  }

  const handleDeleteClient = (clientId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.')) {
      setClients(prev => prev.filter(client => client.id !== clientId))
      alert('Cliente eliminado exitosamente')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="nexus-card p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
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
            <a href="/dashboard" className="nexus-sidebar-item">
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a href="/dashboard/clients" className="nexus-sidebar-item active">
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="nexus-btn nexus-btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Cliente
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Clientes Activos</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{clients.filter(c => c.status === 'active').length}</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Ingresos Totales</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(clients.filter(c => c.status === 'active').reduce((sum, c) => sum + c.monthlyAmount, 0))}
              </p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Promedio Mensual</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(Math.round(clients.filter(c => c.status === 'active').reduce((sum, c) => sum + c.monthlyAmount, 0) / clients.filter(c => c.status === 'active').length))}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="nexus-card p-6 mb-8 fade-in">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="nexus-card fade-in overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facturación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.businessName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPlanBadge(client.plan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(client.monthlyAmount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Día {client.billingDay}</div>
                        <div className="text-sm text-gray-500">Inicio: {formatDate(client.startDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(client.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClient(client)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Editar cliente"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Eliminar cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nexus-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Cliente</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Cliente *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: Restaurant El Buen Sabor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ej: El Buen Sabor S.R.L."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="contacto@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Av. Corrientes 1234, CABA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar plan</option>
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Mensual *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Día de Facturación *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar día</option>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>Día {day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="nexus-btn nexus-btn-primary flex-1 py-3"
                  >
                    Crear Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Client Modal */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nexus-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Cliente</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Información General</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Nombre:</span>
                        <p className="font-medium text-gray-900">{selectedClient.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Razón Social:</span>
                        <p className="font-medium text-gray-900">{selectedClient.businessName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Estado:</span>
                        <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Contacto</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium text-gray-900">{selectedClient.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Teléfono:</span>
                        <p className="font-medium text-gray-900">{selectedClient.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Dirección:</span>
                        <p className="font-medium text-gray-900">{selectedClient.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Plan y Facturación</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Plan:</span>
                        <div className="mt-1">{getPlanBadge(selectedClient.plan)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Monto Mensual:</span>
                        <p className="font-medium text-green-600 text-lg">{formatCurrency(selectedClient.monthlyAmount)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Día de Facturación:</span>
                        <p className="font-medium text-gray-900">Día {selectedClient.billingDay}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fechas</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Fecha de Inicio:</span>
                        <p className="font-medium text-gray-900">{formatDate(selectedClient.startDate)}</p>
                      </div>
                      {selectedClient.endDate && (
                        <div>
                          <span className="text-sm text-gray-600">Fecha de Fin:</span>
                          <p className="font-medium text-gray-900">{formatDate(selectedClient.endDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      handleEditClient(selectedClient)
                    }}
                    className="nexus-btn nexus-btn-primary flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Cliente
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nexus-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Editar Cliente</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                alert('Cliente actualizado exitosamente')
                setShowEditModal(false)
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Cliente *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedClient.name}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedClient.businessName}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      defaultValue={selectedClient.email}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      defaultValue={selectedClient.phone}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedClient.address}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan *
                    </label>
                    <select
                      defaultValue={selectedClient.plan}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Mensual *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedClient.monthlyAmount}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Día de Facturación *
                    </label>
                    <select
                      defaultValue={selectedClient.billingDay}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>Día {day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      defaultValue={selectedClient.status}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedClient.startDate}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin (opcional)
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedClient.endDate || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="nexus-btn nexus-btn-primary flex-1 py-3"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}