'use client'

import { useState, useEffect } from 'react'
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Menu,
  Home,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Save,
  X,
  Calendar,
  Video,
  Zap,
  Filter,
  ChevronDown,
  Download
} from 'lucide-react'
import { useClients } from '@/contexts/ClientContext'
import { useAuth } from '@/contexts/AuthContext'

export default function ExpensesPage() {
  const { expenses, clients, addExpense, updateExpense, deleteExpense } = useClients()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fixed')
  const [showModal, setShowModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [filterPeriod, setFilterPeriod] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showFilters, setShowFilters] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    client: '',
    date: '',
    category: 'fixed',
    description: ''
  })
  const [config, setConfig] = useState({
    showTotals: true,
    groupByClient: false,
    showPercentages: true,
    currency: 'ARS'
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: config.currency
    }).format(amount)
  }

  const filterExpensesByDate = (expenses: any[]) => {
    if (filterPeriod === 'year') {
      return expenses.filter(expense => {
        if (expense.category === 'fixed') return true // Fixed costs apply to all months
        const expenseDate = new Date(expense.date)
        return expenseDate.getFullYear() === selectedYear
      })
    } else {
      return expenses.filter(expense => {
        if (expense.category === 'fixed') return true // Fixed costs apply to all months
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() + 1 === selectedMonth && expenseDate.getFullYear() === selectedYear
      })
    }
  }

  const getFilteredFixedCosts = () => {
    const fixedExpenses = expenses.filter(expense => expense.category === 'fixed')
    return filterExpensesByDate(fixedExpenses)
  }

  const getFilteredVideoCosts = () => {
    const videoExpenses = expenses.filter(expense => expense.category === 'video')
    return filterExpensesByDate(videoExpenses)
  }

  const getTotalFixedCosts = () => {
    return getFilteredFixedCosts().reduce((total, expense) => total + expense.amount, 0)
  }

  const getTotalVideoCosts = () => {
    return getFilteredVideoCosts().reduce((total, expense) => total + expense.amount, 0)
  }

  const getMonthName = (month: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return months[month - 1]
  }

  const exportExpenses = () => {
    const periodText = filterPeriod === 'year' ? selectedYear : `${getMonthName(selectedMonth)} ${selectedYear}`
    alert(`Exportando gastos de ${periodText}...`)
  }

  const openModal = (type: 'add' | 'edit', expense?: any) => {
    setModalType(type)
    setSelectedExpense(expense)
    if (type === 'edit' && expense) {
      setFormData({
        name: expense.name,
        amount: expense.amount.toString(),
        frequency: expense.frequency || 'monthly',
        client: expense.client || '',
        date: expense.date || '',
        category: expense.category,
        description: expense.description
      })
    } else {
      setFormData({
        name: '',
        amount: '',
        frequency: 'monthly',
        client: '',
        date: '',
        category: activeTab,
        description: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedExpense(null)
    setFormData({
      name: '',
      amount: '',
      frequency: 'monthly',
      client: '',
      date: '',
      category: 'fixed',
      description: ''
    })
  }

  const handleSave = () => {
    if (!formData.name || !formData.amount) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    const expenseData = {
      name: formData.name,
      amount: Number(formData.amount),
      frequency: formData.frequency as 'monthly' | 'yearly' | 'quarterly',
      client: formData.client,
      date: formData.date,
      category: formData.category as 'fixed' | 'video',
      description: formData.description
    }

    if (modalType === 'add') {
      addExpense(expenseData)
    } else if (selectedExpense) {
      updateExpense(selectedExpense.id, expenseData)
    }

    closeModal()
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el gasto "${name}"?`)) {
      deleteExpense(id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="nexus-card p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando gastos...</p>
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
            <a href="/dashboard/clients" className="nexus-sidebar-item">
              <Users className="w-5 h-5 mr-3" />
              Clientes
            </a>
            <a href="/dashboard/reports" className="nexus-sidebar-item">
              <TrendingUp className="w-5 h-5 mr-3" />
              Reportes
            </a>
            <a href="/dashboard/expenses" className="nexus-sidebar-item active">
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
          <button
            onClick={logout}
            className="nexus-sidebar-item w-full justify-start text-red-600 hover:bg-red-50"
          >
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Gastos</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="nexus-btn nexus-btn-secondary flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filterPeriod === 'year' ? selectedYear : `${getMonthName(selectedMonth)} ${selectedYear}`}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-64 nexus-card p-4 z-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Período
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setFilterPeriod('month')}
                            className={`px-3 py-2 text-sm rounded-lg border ${
                              filterPeriod === 'month'
                                ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                : 'bg-gray-50 border-gray-300 text-gray-700'
                            }`}
                          >
                            Por Mes
                          </button>
                          <button
                            onClick={() => setFilterPeriod('year')}
                            className={`px-3 py-2 text-sm rounded-lg border ${
                              filterPeriod === 'year'
                                ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                : 'bg-gray-50 border-gray-300 text-gray-700'
                            }`}
                          >
                            Por Año
                          </button>
                        </div>
                      </div>

                      {filterPeriod === 'month' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mes
                          </label>
                          <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {getMonthName(i + 1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Año
                        </label>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full nexus-btn nexus-btn-primary text-sm"
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowConfigModal(true)}
                className="nexus-btn nexus-btn-secondary"
              >
                <Settings className="w-4 h-4 mr-2" />
                Config
              </button>

              <button
                onClick={exportExpenses}
                className="nexus-btn nexus-btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>

              <button
                onClick={() => openModal('add')}
                className="nexus-btn nexus-btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Gasto
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Costos Fijos {filterPeriod === 'year' ? `${selectedYear}` : `${getMonthName(selectedMonth)} ${selectedYear}`}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(getTotalFixedCosts())}</p>
              <p className="text-sm text-gray-600 mt-1">{getFilteredFixedCosts().length} gastos fijos</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Costos de Videos {filterPeriod === 'year' ? `${selectedYear}` : `${getMonthName(selectedMonth)} ${selectedYear}`}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(getTotalVideoCosts())}</p>
              <p className="text-sm text-gray-600 mt-1">{getFilteredVideoCosts().length} videos creados</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Gastos {filterPeriod === 'year' ? `${selectedYear}` : `${getMonthName(selectedMonth)} ${selectedYear}`}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(getTotalFixedCosts() + getTotalVideoCosts())}</p>
              <p className="text-sm text-red-600 mt-1">Impacto en ganancias netas</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="nexus-card p-6 fade-in">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('fixed')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'fixed'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Costos Fijos
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'video'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Video className="w-4 h-4 inline mr-2" />
                  Costos de Videos
                </button>
              </nav>
            </div>

            {/* Fixed Costs Tab */}
            {activeTab === 'fixed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Costos Fijos Mensuales</h2>
                  <span className="text-sm text-gray-600">Total: {formatCurrency(getTotalFixedCosts())}</span>
                </div>
                {getFilteredFixedCosts().map((expense) => (
                  <div key={expense.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{expense.name}</h3>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-gray-500">Frecuencia: {expense.frequency === 'monthly' ? 'Mensual' : expense.frequency}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('edit', expense)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id, expense.name)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Video Costs Tab */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Costos de Creación de Videos</h2>
                  <span className="text-sm text-gray-600">Total: {formatCurrency(getTotalVideoCosts())}</span>
                </div>
                {getFilteredVideoCosts().map((expense) => (
                  <div key={expense.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{expense.name}</h3>
                        <p className="text-sm text-gray-600">Cliente: {expense.client}</p>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                        <p className="text-lg font-bold text-purple-600">{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-gray-500">Fecha: {new Date(expense.date).toLocaleDateString('es-AR')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('edit', expense)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id, expense.name)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="nexus-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'add' ? 'Agregar Gasto' : 'Editar Gasto'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Gasto
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="fixed">Costo Fijo</option>
                  <option value="video">Costo de Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Gasto
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: Alquiler oficina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {formData.category === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                    <option value="quarterly">Trimestral</option>
                  </select>
                </div>
              )}

              {formData.category === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente
                    </label>
                    <select
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar cliente</option>
                      {clients.filter(client => client.status === 'active').map(client => (
                        <option key={client.id} value={client.name}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Descripción del gasto..."
                />
              </div>
            </form>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="nexus-btn nexus-btn-primary flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </button>
              <button
                onClick={closeModal}
                className="nexus-btn nexus-btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="nexus-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Configuración de Vista</h2>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Mostrar totales en resumen
                </label>
                <input
                  type="checkbox"
                  checked={config.showTotals}
                  onChange={(e) => setConfig({ ...config, showTotals: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Agrupar por cliente
                </label>
                <input
                  type="checkbox"
                  checked={config.groupByClient}
                  onChange={(e) => setConfig({ ...config, groupByClient: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Mostrar porcentajes
                </label>
                <input
                  type="checkbox"
                  checked={config.showPercentages}
                  onChange={(e) => setConfig({ ...config, showPercentages: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  value={config.currency}
                  onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="ARS">Peso Argentino (ARS)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  alert('Configuración guardada')
                  setShowConfigModal(false)
                }}
                className="nexus-btn nexus-btn-primary flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="nexus-btn nexus-btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}