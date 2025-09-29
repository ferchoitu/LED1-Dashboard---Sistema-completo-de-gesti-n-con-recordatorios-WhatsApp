'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Client {
  id: number
  name: string
  businessName: string
  email: string
  phone: string
  address: string
  monthlyAmount: number
  billingDay: number
  startDate: string
  endDate: string | null
  status: 'active' | 'inactive' | 'suspended'
  plan: string
  includeIVA: boolean
}

export interface Expense {
  id: number
  name: string
  amount: number
  frequency?: 'monthly' | 'yearly' | 'quarterly'
  client?: string
  date?: string
  category: 'fixed' | 'video'
  description: string
}

export interface Payment {
  id: number
  clientId: number
  clientName: string
  amount: number
  date: string
  month: number
  year: number
  status: 'paid' | 'pending' | 'overdue'
  billingDay: number
}

interface ClientContextType {
  clients: Client[]
  expenses: Expense[]
  payments: Payment[]
  addClient: (client: Omit<Client, 'id'>) => void
  updateClient: (id: number, client: Partial<Client>) => void
  deleteClient: (id: number) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: number, expense: Partial<Expense>) => void
  deleteExpense: (id: number) => void
  markAsPaid: (clientId: number, amount: number, month?: number, year?: number) => void
  getClientPayments: (clientId: number, month?: number, year?: number) => Payment[]
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

// Sistema limpio - sin datos iniciales
const initialClients: Client[] = []

const initialExpenses: Expense[] = []

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [payments, setPayments] = useState<Payment[]>([])

  // Cargar datos del localStorage si existen
  useEffect(() => {
    const savedClients = localStorage.getItem('led1-clients')
    const savedExpenses = localStorage.getItem('led1-expenses')
    const savedPayments = localStorage.getItem('led1-payments')

    if (savedClients) {
      const parsedClients = JSON.parse(savedClients)
      // Migrar clientes existentes agregando el campo includeIVA si no existe
      const migratedClients = parsedClients.map((client: any) => ({
        ...client,
        includeIVA: client.includeIVA !== undefined ? client.includeIVA : false
      }))
      setClients(migratedClients)
    } else {
      // Si no hay datos guardados, usar arrays vacíos
      setClients([])
    }

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    } else {
      setExpenses([])
    }

    if (savedPayments) {
      setPayments(JSON.parse(savedPayments))
    } else {
      setPayments([])
    }
  }, [])

  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    localStorage.setItem('led1-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem('led1-expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('led1-payments', JSON.stringify(payments))
  }, [payments])

  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient = {
      ...clientData,
      id: Math.max(...clients.map(c => c.id), 0) + 1
    }
    setClients(prev => [...prev, newClient])
  }

  const updateClient = (id: number, updates: Partial<Client>) => {
    setClients(prev => prev.map(client =>
      client.id === id ? { ...client, ...updates } : client
    ))
  }

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id))
  }

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expenseData,
      id: Math.max(...expenses.map(e => e.id), 0) + 1
    }
    setExpenses(prev => [...prev, newExpense])
  }

  const updateExpense = (id: number, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense =>
      expense.id === id ? { ...expense, ...updates } : expense
    ))
  }

  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const markAsPaid = (clientId: number, amount: number, month?: number, year?: number) => {
    const now = new Date()
    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const paymentMonth = month || now.getMonth() + 1
    const paymentYear = year || now.getFullYear()

    const newPayment: Payment = {
      id: Math.max(...payments.map(p => p.id), 0) + 1,
      clientId,
      clientName: client.name,
      amount,
      date: now.toISOString().split('T')[0],
      month: paymentMonth,
      year: paymentYear,
      status: 'paid',
      billingDay: client.billingDay
    }

    setPayments(prev => [...prev, newPayment])
  }

  const getClientPayments = (clientId: number, month?: number, year?: number) => {
    return payments.filter(payment => {
      if (payment.clientId !== clientId) return false
      if (month && payment.month !== month) return false
      if (year && payment.year !== year) return false
      return true
    })
  }

  return (
    <ClientContext.Provider value={{
      clients,
      expenses,
      payments,
      addClient,
      updateClient,
      deleteClient,
      addExpense,
      updateExpense,
      deleteExpense,
      markAsPaid,
      getClientPayments
    }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider')
  }
  return context
}