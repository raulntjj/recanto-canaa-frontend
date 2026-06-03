'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatePicker } from './date-picker'
import { OccupancyStats } from './occupancy-stats'
import { CheckInOutList } from './check-in-out-list'
import { GovernanceBoard } from './governance-board'
import type { OccupancyDashboardResponse, RoomStatus } from '../schemas/occupancy.schema'

// Dados mockados para demonstração (serão substituídos pela API)
const mockDashboardData: OccupancyDashboardResponse = {
  date: new Date().toISOString().split('T')[0],
  summary: {
    totalRooms: 12,
    occupiedRooms: 5,
    availableRooms: 4,
    needsCleaningRooms: 2,
    maintenanceRooms: 1,
    blockedRooms: 0,
    occupancyRate: 42,
  },
  checkIns: [
    {
      id: '1',
      room: {
        id: 'r1',
        name: 'Chalé das Palmeiras',
        type: 'CHALE',
        capacity: 4,
        status: 'AVAILABLE',
        amenities: ['Varanda', 'Lareira', 'Banheira'],
      },
      guest: {
        id: 'g1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '(11) 98765-4321',
      },
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      totalGuests: 2,
      specialRequests: ['Decoração romântica', 'Late check-out'],
    },
    {
      id: '2',
      room: {
        id: 'r2',
        name: 'Suíte Master',
        type: 'SUITE',
        capacity: 2,
        status: 'AVAILABLE',
        amenities: ['Jacuzzi', 'Vista montanha'],
      },
      guest: {
        id: 'g2',
        name: 'João Oliveira',
        email: 'joao@email.com',
        phone: '(21) 99876-5432',
      },
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      totalGuests: 2,
      specialRequests: [],
    },
  ],
  checkOuts: [
    {
      id: '3',
      room: {
        id: 'r3',
        name: 'Quarto Girassol',
        type: 'QUARTO',
        capacity: 3,
        status: 'OCCUPIED',
        amenities: ['Ar condicionado', 'Frigobar'],
      },
      guest: {
        id: 'g3',
        name: 'Ana Costa',
        email: 'ana@email.com',
      },
      checkIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date().toISOString(),
      status: 'CHECKED_IN',
      totalGuests: 1,
      specialRequests: [],
    },
  ],
  currentGuests: [],
}

const mockGovernanceRooms = [
  {
    id: 'r1',
    name: 'Chalé das Palmeiras',
    type: 'CHALE' as const,
    capacity: 4,
    status: 'AVAILABLE' as const,
    amenities: ['Varanda', 'Lareira'],
  },
  {
    id: 'r2',
    name: 'Suíte Master',
    type: 'SUITE' as const,
    capacity: 2,
    status: 'OCCUPIED' as const,
    amenities: ['Jacuzzi'],
  },
  {
    id: 'r3',
    name: 'Quarto Girassol',
    type: 'QUARTO' as const,
    capacity: 3,
    status: 'NEEDS_CLEANING' as const,
    amenities: [],
    assignedTo: 'Joana',
    priority: 'HIGH' as const,
  },
  {
    id: 'r4',
    name: 'Quarto Lavanda',
    type: 'QUARTO' as const,
    capacity: 2,
    status: 'NEEDS_CLEANING' as const,
    amenities: [],
    assignedTo: 'Maria',
    priority: 'MEDIUM' as const,
  },
  {
    id: 'r5',
    name: 'Chalé do Lago',
    type: 'CHALE' as const,
    capacity: 6,
    status: 'OCCUPIED' as const,
    amenities: ['Deck', 'Churrasqueira'],
  },
  {
    id: 'r6',
    name: 'Quarto Ipê',
    type: 'QUARTO' as const,
    capacity: 2,
    status: 'MAINTENANCE' as const,
    amenities: [],
  },
  {
    id: 'r7',
    name: 'Suíte Jardim',
    type: 'SUITE' as const,
    capacity: 2,
    status: 'AVAILABLE' as const,
    amenities: ['Jardim privativo'],
  },
  {
    id: 'r8',
    name: 'Quarto Orquídea',
    type: 'QUARTO' as const,
    capacity: 2,
    status: 'AVAILABLE' as const,
    amenities: [],
  },
]

export function OccupancyDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Em produção, usar os hooks do React Query:
  // const { data, isLoading, refetch } = useOccupancyDashboard(format(selectedDate, 'yyyy-MM-dd'))
  // const { data: governanceData } = useGovernanceStatus()

  const data = mockDashboardData
  const governanceRooms = mockGovernanceRooms

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Em produção: await refetch()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleCheckIn = (reservationId: string) => {
    console.log('[v0] Check-in para reserva:', reservationId)
    // Em produção: useCheckIn mutation
  }

  const handleCheckOut = (reservationId: string) => {
    console.log('[v0] Check-out para reserva:', reservationId)
    // Em produção: useCheckOut mutation
  }

  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    console.log('[v0] Atualizar status do quarto:', roomId, status)
    // Em produção: useUpdateRoomStatus mutation
  }

  const handleMarkCleaned = (roomId: string) => {
    console.log('[v0] Marcar quarto como limpo:', roomId)
    // Em produção: useMarkRoomCleaned mutation
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
            Painel de Ocupação
          </h1>
          <p className="mt-1 text-muted-foreground">
            {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DatePicker
            date={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            className="w-[200px]"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <OccupancyStats summary={data.summary} />

      {/* Check-ins / Check-outs */}
      <CheckInOutList
        checkIns={data.checkIns}
        checkOuts={data.checkOuts}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />

      {/* Governance Board */}
      <GovernanceBoard
        rooms={governanceRooms}
        onUpdateStatus={handleUpdateRoomStatus}
        onMarkCleaned={handleMarkCleaned}
      />
    </div>
  )
}
