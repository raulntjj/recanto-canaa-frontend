'use client'

import { BedDouble, Users, Sparkles, Wrench, Ban, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface OccupancySummary {
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  needsCleaningRooms: number
  maintenanceRooms: number
  blockedRooms: number
  occupancyRate: number
}

interface OccupancyStatsProps {
  summary: OccupancySummary
}

const stats = [
  {
    key: 'occupiedRooms',
    label: 'Ocupados',
    icon: Users,
    bgClass: 'bg-primary/10',
    iconClass: 'text-primary',
  },
  {
    key: 'availableRooms',
    label: 'Disponíveis',
    icon: BedDouble,
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600',
  },
  {
    key: 'needsCleaningRooms',
    label: 'Limpeza',
    icon: Sparkles,
    bgClass: 'bg-yellow-100',
    iconClass: 'text-yellow-600',
  },
  {
    key: 'maintenanceRooms',
    label: 'Manutenção',
    icon: Wrench,
    bgClass: 'bg-orange-100',
    iconClass: 'text-orange-600',
  },
  {
    key: 'blockedRooms',
    label: 'Bloqueados',
    icon: Ban,
    bgClass: 'bg-red-100',
    iconClass: 'text-red-600',
  },
] as const

export function OccupancyStats({ summary }: OccupancyStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* Taxa de Ocupação */}
      <Card className="col-span-2 sm:col-span-1 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{summary.occupancyRate}%</p>
              <p className="text-xs text-muted-foreground">Taxa de Ocupação</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outras estatísticas */}
      {stats.map((stat) => (
        <Card key={stat.key}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bgClass)}>
                <stat.icon className={cn('h-5 w-5', stat.iconClass)} />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary[stat.key]}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
