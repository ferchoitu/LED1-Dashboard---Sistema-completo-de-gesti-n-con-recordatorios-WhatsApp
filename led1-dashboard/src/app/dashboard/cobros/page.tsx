'use client'

import { useState, useEffect, useRef } from 'react'
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Menu,
  Home,
  Users,
  DollarSign,
  Settings,
  LogOut,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { useClients } from '@/contexts/ClientContext'
import { useAuth } from '@/contexts/AuthContext'

interface InvoiceData {
  clientId: number
  clientName: string
  businessName: string
  email: string
  phone: string
  address: string
  monthlyAmount: number
  billingDay: number
  month: number
  year: number
  invoiceNumber: string
  dueDate: string
  issueDate: string
}

export default function CobrosPage() {
  const { clients, payments } = useClients()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [searchTerm, setSearchTerm] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceData | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const generateInvoiceNumber = (clientId: number, month: number, year: number) => {
    return `LED1-${year}${month.toString().padStart(2, '0')}-${clientId.toString().padStart(3, '0')}`
  }

  const calculateDueDate = (billingDay: number, month: number, year: number) => {
    // Fecha de vencimiento: día de facturación + 10 días
    const dueDate = new Date(year, month - 1, billingDay + 10)
    return dueDate.toISOString().split('T')[0]
  }

  const generateInvoices = () => {
    const activeClients = clients.filter(client => client.status === 'active')

    return activeClients
      .filter(client =>
        searchTerm === '' ||
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(client => {
        const invoiceNumber = generateInvoiceNumber(client.id, selectedMonth, selectedYear)
        const issueDate = new Date(selectedYear, selectedMonth - 1, client.billingDay).toISOString().split('T')[0]
        const dueDate = calculateDueDate(client.billingDay, selectedMonth, selectedYear)

        return {
          clientId: client.id,
          clientName: client.name,
          businessName: client.businessName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          monthlyAmount: client.monthlyAmount,
          billingDay: client.billingDay,
          month: selectedMonth,
          year: selectedYear,
          invoiceNumber,
          issueDate,
          dueDate
        }
      })
  }

  const invoices = generateInvoices()

  const handlePreview = (invoice: InvoiceData) => {
    setPreviewInvoice(invoice)
    setShowPreview(true)
  }

  const handleDownload = async (invoice: InvoiceData) => {
    setIsGeneratingPDF(true)
    try {
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      // Crear un elemento temporal con la factura
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.width = '210mm' // A4 width
      tempDiv.style.backgroundColor = 'white'
      tempDiv.style.padding = '20mm'
      tempDiv.style.fontFamily = 'Arial, sans-serif'

      tempDiv.innerHTML = `
        <div style="max-width: 170mm; margin: 0 auto;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
            <div>
              <svg width="120" height="40" style="margin-bottom: 16px;" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="40" fill="#6366f1" rx="4"/>
                <text x="60" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">LED1</text>
              </svg>
              <div style="color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">Pantallas LED Publicitarias</p>
                <p style="margin: 0;">Gestión Digital de Contenidos</p>
              </div>
            </div>
            <div style="text-align: right;">
              <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0;">FACTURA</h1>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">N° ${invoice.invoiceNumber}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Fecha: ${new Date(invoice.issueDate).toLocaleDateString('es-AR')}</p>
            </div>
          </div>

          <!-- Client Info -->
          <div style="margin-bottom: 40px;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Facturado a:</h3>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
              <p style="font-weight: 600; margin: 0 0 4px 0;">${invoice.businessName}</p>
              <p style="margin: 0 0 8px 0;">${invoice.clientName}</p>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">📍 ${invoice.address}</p>
              <div style="display: flex; gap: 20px; color: #6b7280; font-size: 14px;">
                <span>✉️ ${invoice.email}</span>
                <span>📞 ${invoice.phone}</span>
              </div>
            </div>
          </div>

          <!-- Services Table -->
          <div style="margin-bottom: 40px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Descripción</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Período</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Cant.</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Precio Unit.</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
                    <div>
                      <p style="font-weight: 500; margin: 0 0 4px 0;">Servicio de Pantalla LED</p>
                      <p style="color: #6b7280; font-size: 14px; margin: 0;">Gestión y exhibición de contenido publicitario</p>
                    </div>
                  </td>
                  <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
                    ${months.find(m => m.value === invoice.month)?.label} ${invoice.year}
                  </td>
                  <td style="padding: 16px 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">1</td>
                  <td style="padding: 16px 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency(invoice.monthlyAmount)}</td>
                  <td style="padding: 16px 12px; text-align: right; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${formatCurrency(invoice.monthlyAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
            <div style="width: 250px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #e5e7eb;">
                <span style="font-weight: 600;">Subtotal:</span>
                <span>${formatCurrency(invoice.monthlyAmount)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="font-weight: 600;">IVA (21%):</span>
                <span>${formatCurrency(invoice.monthlyAmount * 0.21)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #1f2937; font-size: 18px; font-weight: bold;">
                <span>TOTAL:</span>
                <span>${formatCurrency(invoice.monthlyAmount * 1.21)}</span>
              </div>
            </div>
          </div>

          <!-- Payment Info -->
          <div style="background: #dbeafe; padding: 16px; border-radius: 8px;">
            <h4 style="font-weight: 600; color: #1e3a8a; margin: 0 0 8px 0;">Información de Pago</h4>
            <p style="margin: 0 0 4px 0; color: #1e40af; font-size: 14px;">
              <strong>Fecha de Vencimiento:</strong> ${new Date(invoice.dueDate).toLocaleDateString('es-AR')}
            </p>
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Día de Facturación:</strong> ${invoice.billingDay} de cada mes
            </p>
          </div>
        </div>
      `

      document.body.appendChild(tempDiv)

      // Generar el canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      document.body.removeChild(tempDiv)

      // Crear el PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // Descargar el PDF
      pdf.save(`Factura_${invoice.invoiceNumber}_${invoice.clientName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar el PDF. Por favor intenta de nuevo.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const downloadAllInvoices = () => {
    alert(`Descargando ${invoices.length} facturas del mes ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="nexus-card p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resúmenes de cobro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-800 flex">
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
            <a href="/dashboard/cobros" className="nexus-sidebar-item active">
              <FileText className="w-5 h-5 mr-3" />
              Cobros
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
        <header className="nexus-header px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-primary">Resúmenes de Cobro</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Facturas</h2>
              <p className="text-sm text-gray-600 mt-1">
                Genera y gestiona las facturas mensuales de tus clientes
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadAllInvoices}
                disabled={invoices.length === 0}
                className="nexus-btn nexus-btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Todo
              </button>
              <button className="nexus-btn nexus-btn-primary px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                Nueva Factura
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="nexus-card p-6 mb-6 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Cliente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o empresa..."
                    className="nexus-input w-full pl-10 pr-4 py-2.5 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="nexus-select w-full px-3 py-2.5 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="nexus-select w-full px-3 py-2.5 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Facturas</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{invoices.length}</p>
              <p className="text-sm text-blue-600 mt-1">
                {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monto Total</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(invoices.reduce((total, invoice) => total + invoice.monthlyAmount, 0))}
              </p>
              <p className="text-sm text-green-600 mt-1">A facturar</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Período</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {months.find(m => m.value === selectedMonth)?.label}
              </p>
              <p className="text-sm text-purple-600 mt-1">{selectedYear}</p>
            </div>
          </div>

          {/* Invoices List */}
          <div className="nexus-card fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Facturas del Período</h3>
                <div className="flex gap-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100">
                    <Filter className="w-4 h-4 mr-1 inline" />
                    Filtros
                  </button>
                </div>
              </div>
            </div>

            {invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factura
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((invoice) => (
                      <tr key={invoice.invoiceNumber} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">#{invoice.invoiceNumber.split('-').pop()}</div>
                            <div className="text-xs text-gray-500">{new Date(invoice.issueDate).toLocaleDateString('es-AR')}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                            <div className="text-xs text-gray-500">{invoice.businessName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900">Pantalla LED</div>
                            <div className="text-xs text-gray-500">
                              {months.find(m => m.value === invoice.month)?.label} {invoice.year}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-semibold text-gray-900">{formatCurrency(invoice.monthlyAmount)}</div>
                          <div className="text-xs text-gray-500">+ IVA</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendiente
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handlePreview(invoice)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Vista previa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(invoice)}
                              disabled={isGeneratingPDF}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={isGeneratingPDF ? "Generando PDF..." : "Descargar PDF"}
                            >
                              {isGeneratingPDF ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Enviar por email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? 'No hay facturas que coincidan' : 'No hay clientes activos'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? 'Prueba ajustando el término de búsqueda o el período seleccionado.'
                      : 'Agrega clientes activos para generar facturas automáticamente.'
                    }
                  </p>
                  {!searchTerm && (
                    <a
                      href="/dashboard/clients"
                      className="nexus-btn nexus-btn-primary inline-flex items-center"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Gestionar Clientes
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {showPreview && previewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nexus-modal nexus-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Vista Previa - {previewInvoice.invoiceNumber}</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FileText className="w-6 h-6" />
                </button>
              </div>

              {/* Invoice Preview */}
              <div className="bg-white p-8 rounded-lg border">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="mb-4">
                      <svg width="120" height="40" viewBox="0 0 120 40" className="h-12">
                        <rect width="120" height="40" fill="#6366f1" rx="4"/>
                        <text x="60" y="25" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">LED1</text>
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Pantallas LED Publicitarias</p>
                      <p>Gestión Digital de Contenidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">FACTURA</h1>
                    <p className="text-sm text-gray-600">N° {previewInvoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">Fecha: {new Date(previewInvoice.issueDate).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturado a:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">{previewInvoice.businessName}</p>
                    <p className="text-gray-700">{previewInvoice.clientName}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{previewInvoice.address}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{previewInvoice.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{previewInvoice.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Descripción</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Período</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Cantidad</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Precio Unit.</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">Servicio de Pantalla LED</p>
                            <p className="text-sm text-gray-600">Gestión y exhibición de contenido publicitario</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {months.find(m => m.value === previewInvoice.month)?.label} {previewInvoice.year}
                        </td>
                        <td className="px-4 py-4 text-right text-gray-700">1</td>
                        <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(previewInvoice.monthlyAmount)}</td>
                        <td className="px-4 py-4 text-right font-semibold text-gray-900">{formatCurrency(previewInvoice.monthlyAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Subtotal:</span>
                      <span className="text-gray-900">{formatCurrency(previewInvoice.monthlyAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-gray-900">IVA (21%):</span>
                      <span className="text-gray-900">{formatCurrency(previewInvoice.monthlyAmount * 0.21)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t-2 border-gray-800">
                      <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(previewInvoice.monthlyAmount * 1.21)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Información de Pago</h4>
                  <p className="text-sm text-blue-800">
                    <strong>Fecha de Vencimiento:</strong> {new Date(previewInvoice.dueDate).toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Día de Facturación:</strong> {previewInvoice.billingDay} de cada mes
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewInvoice)
                    setShowPreview(false)
                  }}
                  disabled={isGeneratingPDF}
                  className="nexus-btn nexus-btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingPDF ? 'Generando PDF...' : 'Descargar PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}