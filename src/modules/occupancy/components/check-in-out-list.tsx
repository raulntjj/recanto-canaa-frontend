'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  LogIn,
  LogOut,
  User,
  Clock,
  MoreHorizontal,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { OccupancyReservation } from '../schemas/occupancy.schema'

interface CheckInOutListProps {
  checkIns: OccupancyReservation[]
  checkOuts: OccupancyReservation[]
  onCheckIn?: (reservationId: string) => void
  onCheckOut?: (reservationId: string) => void
}

function ReservationCard({
  reservation,
  type,
  onAction,
}: {
  reservation: OccupancyReservation
  type: 'checkin' | 'checkout'
  onAction?: (id: string) => void
}) {
  const actionTime = type === 'checkin' ? reservation.checkIn : reservation.checkOut
  const isCompleted =
    type === 'checkin'
      ? reservation.status === 'CHECKED_IN'
      : reservation.status === 'CHECKED_OUT'

  return (
    <div className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/5">
      {/* Icon */}
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
          type === 'checkin' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}
      >
        {type === 'checkin' ? <LogIn className="h-5 w-5" /> : <LogOut className="h-5 w-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-foreground truncate">{reservation.guest.name}</h4>
            <p className="text-sm text-muted-foreground">{reservation.room.name}</p>
          </div>
          {isCompleted ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Concluído
            </Badge>
          ) : (
            <Badge variant="outline">
              <Clock className="mr-1 h-3 w-3" />
              {format(new Date(actionTime), 'HH:mm', { locale: ptBR })}
            </Badge>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {reservation.totalGuests} hóspede{reservation.totalGuests > 1 ? 's' : ''}
          </span>
          {reservation.guest.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {reservation.guest.email}
            </span>
          )}
          {reservation.guest.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {reservation.guest.phone}
            </span>
          )}
        </div>

        {reservation.specialRequests.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">
              Pedidos especiais: {reservation.specialRequests.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isCompleted && onAction && (
            <DropdownMenuItem onClick={() => onAction(reservation.id)}>
              {type === 'checkin' ? 'Registrar Check-in' : 'Registrar Check-out'}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
          <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function CheckInOutList({
  checkIns,
  checkOuts,
  onCheckIn,
  onCheckOut,
}: CheckInOutListProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Check-ins */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <LogIn className="h-4 w-4 text-green-600" />
            </div>
            Check-ins do Dia
            <Badge variant="secondary" className="ml-auto">
              {checkIns.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checkIns.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum check-in previsto para hoje
            </p>
          ) : (
            checkIns.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                type="checkin"
                onAction={onCheckIn}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Check-outs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <LogOut className="h-4 w-4 text-blue-600" />
            </div>
            Check-outs do Dia
            <Badge variant="secondary" className="ml-auto">
              {checkOuts.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checkOuts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum check-out previsto para hoje
            </p>
          ) : (
            checkOuts.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                type="checkout"
                onAction={onCheckOut}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
