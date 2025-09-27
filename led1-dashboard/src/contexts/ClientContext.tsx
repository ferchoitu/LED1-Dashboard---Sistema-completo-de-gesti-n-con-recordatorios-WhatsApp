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

interface ClientContextType {
  clients: Client[]
  expenses: Expense[]
  addClient: (client: Omit<Client, 'id'>) => void
  updateClient: (id: number, client: Partial<Client>) => void
  deleteClient: (id: number) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: number, expense: Partial<Expense>) => void
  deleteExpense: (id: number) => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

// Datos iniciales realistas
const initialClients: Client[] = [
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
    startDate: '2023-09-01',
    endDate: null,
    status: 'active',
    plan: 'Básico'
  },
  {
    id: 3,
    name: 'Gimnasio Fitness Plus',
    businessName: 'Fitness Plus Gym',
    email: 'info@fitnessplus.com',
    phone: '+54 11 5555-0000',
    address: 'Av. Santa Fe 890, CABA',
    monthlyAmount: 4600,
    billingDay: 26,
    startDate: '2023-07-20',
    endDate: null,
    status: 'active',
    plan: 'Premium'
  },
  {
    id: 4,
    name: 'Bar La Esquina',
    businessName: 'La Esquina Bar',
    email: 'bar@laesquina.com',
    phone: '+54 11 9999-1111',
    address: 'Defensa 456, San Telmo',
    monthlyAmount: 2800,
    billingDay: 20,
    startDate: '2023-06-10',
    endDate: null,
    status: 'active',
    plan: 'Básico'
  },
  {
    id: 5,
    name: 'Panadería Don José',
    businessName: 'Panadería Don José',
    email: 'donjose@panaderia.com',
    phone: '+54 11 7777-2222',
    address: 'Rivadavia 123, Flores',
    monthlyAmount: 1800,
    billingDay: 15,
    startDate: '2023-10-05',
    endDate: null,
    status: 'active',
    plan: 'Básico'
  }
]

const initialExpenses: Expense[] = [
  {
    id: 1,
    name: 'Alquiler oficina',
    amount: 25000,
    frequency: 'monthly',
    category: 'fixed',
    description: 'Alquiler mensual de oficina'
  },
  {
    id: 2,
    name: 'Internet y servicios',
    amount: 8500,
    frequency: 'monthly',
    category: 'fixed',
    description: 'Internet, luz, agua'
  },
  {
    id: 3,
    name: 'Seguro equipos',
    amount: 3200,
    frequency: 'monthly',
    category: 'fixed',
    description: 'Seguro pantallas LED'
  },
  {
    id: 4,
    name: 'Video Restaurant El Buen Sabor',
    amount: 4500,
    client: 'Restaurant El Buen Sabor',
    date: '2024-01-15',
    category: 'video',
    description: 'Creación contenido publicitario mensual'
  },
  {
    id: 5,
    name: 'Video Farmacia Central',
    amount: 3200,
    client: 'Farmacia Central',
    date: '2024-01-20',
    category: 'video',
    description: 'Video promocional productos'
  }
]

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)

  // Cargar datos del localStorage si existen
  useEffect(() => {
    const savedClients = localStorage.getItem('led1-clients')
    const savedExpenses = localStorage.getItem('led1-expenses')

    if (savedClients) {
      setClients(JSON.parse(savedClients))
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])

  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    localStorage.setItem('led1-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem('led1-expenses', JSON.stringify(expenses))
  }, [expenses])

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

  return (
    <ClientContext.Provider value={{
      clients,
      expenses,
      addClient,
      updateClient,
      deleteClient,
      addExpense,
      updateExpense,
      deleteExpense
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