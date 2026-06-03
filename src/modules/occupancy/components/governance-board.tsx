'use client'

import {
  BedDouble,
  Sparkles,
  Wrench,
  Ban,
  Check,
  Users,
  MoreHorizontal,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Room, RoomStatus } from '../schemas/occupancy.schema'

interface RoomWithGovernance extends Room {
  lastCleaned?: string
  assignedTo?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

interface GovernanceBoardProps {
  rooms: RoomWithGovernance[]
  onUpdateStatus?: (roomId: string, status: RoomStatus) => void
  onMarkCleaned?: (roomId: string) => void
}

const statusConfig: Record<
  RoomStatus,
  { label: string; icon: typeof BedDouble; bgClass: string; textClass: string }
> = {
  AVAILABLE: {
    label: 'Disponível',
    icon: Check,
    bgClass: 'bg-green-100 border-green-200',
    textClass: 'text-green-700',
  },
  OCCUPIED: {
    label: 'Ocupado',
    icon: Users,
    bgClass: 'bg-blue-100 border-blue-200',
    textClass: 'text-blue-700',
  },
  NEEDS_CLEANING: {
    label: 'Limpeza',
    icon: Sparkles,
    bgClass: 'bg-yellow-100 border-yellow-200',
    textClass: 'text-yellow-700',
  },
  MAINTENANCE: {
    label: 'Manutenção',
    icon: Wrench,
    bgClass: 'bg-orange-100 border-orange-200',
    textClass: 'text-orange-700',
  },
  BLOCKED: {
    label: 'Bloqueado',
    icon: Ban,
    bgClass: 'bg-red-100 border-red-200',
    textClass: 'text-red-700',
  },
}

const priorityConfig = {
  LOW: { label: 'Baixa', class: 'bg-slate-100 text-slate-600' },
  MEDIUM: { label: 'Média', class: 'bg-blue-100 text-blue-600' },
  HIGH: { label: 'Alta', class: 'bg-orange-100 text-orange-600' },
  URGENT: { label: 'Urgente', class: 'bg-red-100 text-red-600' },
}

function RoomCard({
  room,
  onUpdateStatus,
  onMarkCleaned,
}: {
  room: RoomWithGovernance
  onUpdateStatus?: (roomId: string, status: RoomStatus) => void
  onMarkCleaned?: (roomId: string) => void
}) {
  const config = statusConfig[room.status]
  const Icon = config.icon
  const priority = room.priority || 'MEDIUM'

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 p-4 transition-all hover:shadow-md',
        config.bgClass
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('rounded-lg p-2', config.bgClass)}>
            <BedDouble className={cn('h-5 w-5', config.textClass)} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{room.name}</h4>
            <p className="text-xs text-muted-foreground capitalize">
              {room.type.toLowerCase()} - {room.capacity} pessoas
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {room.status === 'NEEDS_CLEANING' && onMarkCleaned && (
              <>
                <DropdownMenuItem onClick={() => onMarkCleaned(room.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Marcar como limpo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => onUpdateStatus?.(room.id, 'AVAILABLE')}
              disabled={room.status === 'AVAILABLE'}
            >
              Disponível
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateStatus?.(room.id, 'OCCUPIED')}
              disabled={room.status === 'OCCUPIED'}
            >
              Ocupado
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateStatus?.(room.id, 'NEEDS_CLEANING')}
              disabled={room.status === 'NEEDS_CLEANING'}
            >
              Necessita Limpeza
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateStatus?.(room.id, 'MAINTENANCE')}
              disabled={room.status === 'MAINTENANCE'}
            >
              Manutenção
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateStatus?.(room.id, 'BLOCKED')}
              disabled={room.status === 'BLOCKED'}
            >
              Bloqueado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Badge */}
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="secondary" className={cn('gap-1', config.bgClass, config.textClass)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
        {room.status === 'NEEDS_CLEANING' && (
          <Badge variant="secondary" className={priorityConfig[priority].class}>
            {priorityConfig[priority].label}
          </Badge>
        )}
      </div>

      {/* Assigned To */}
      {room.assignedTo && room.status === 'NEEDS_CLEANING' && (
        <p className="mt-2 text-xs text-muted-foreground">
          Responsável: <span className="font-medium">{room.assignedTo}</span>
        </p>
      )}
    </div>
  )
}

export function GovernanceBoard({
  rooms,
  onUpdateStatus,
  onMarkCleaned,
}: GovernanceBoardProps) {
  // Agrupar quartos por status
  const groupedRooms = {
    NEEDS_CLEANING: rooms.filter((r) => r.status === 'NEEDS_CLEANING'),
    OCCUPIED: rooms.filter((r) => r.status === 'OCCUPIED'),
    AVAILABLE: rooms.filter((r) => r.status === 'AVAILABLE'),
    MAINTENANCE: rooms.filter((r) => r.status === 'MAINTENANCE'),
    BLOCKED: rooms.filter((r) => r.status === 'BLOCKED'),
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <BedDouble className="h-4 w-4 text-primary" />
          </div>
          Status de Governança
          <Badge variant="secondary" className="ml-auto">
            {rooms.length} quartos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Grid de Quartos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Primeiro os que precisam de atenção */}
          {groupedRooms.NEEDS_CLEANING.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onUpdateStatus={onUpdateStatus}
              onMarkCleaned={onMarkCleaned}
            />
          ))}
          {/* Depois ocupados */}
          {groupedRooms.OCCUPIED.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onUpdateStatus={onUpdateStatus}
              onMarkCleaned={onMarkCleaned}
            />
          ))}
          {/* Disponíveis */}
          {groupedRooms.AVAILABLE.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onUpdateStatus={onUpdateStatus}
              onMarkCleaned={onMarkCleaned}
            />
          ))}
          {/* Manutenção e Bloqueados */}
          {[...groupedRooms.MAINTENANCE, ...groupedRooms.BLOCKED].map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onUpdateStatus={onUpdateStatus}
              onMarkCleaned={onMarkCleaned}
            />
          ))}
        </div>

        {rooms.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            Nenhum quarto cadastrado
          </p>
        )}
      </CardContent>
    </Card>
  )
}
