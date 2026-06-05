'use client'

import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarDays,
  Users,
  BedDouble,
  Tag,
  Receipt,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { RoomAvailability, UpgradeService, Pricing } from '../schemas/booking.schema'

interface SelectedUpgrade {
  service: UpgradeService
  quantity: number
}

interface BookingSummaryProps {
  checkIn: Date | null
  checkOut: Date | null
  guests: number
  room: RoomAvailability | null
  upgrades: SelectedUpgrade[]
  pricing?: Pricing | null
  compact?: boolean
}

export function BookingSummary({
  checkIn,
  checkOut,
  guests,
  room,
  upgrades,
  pricing,
  compact = false,
}: BookingSummaryProps) {
  const nights = pricing?.nights || (checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0)
  const subtotal = pricing?.subtotal || (room?.basePrice || 0) * nights
  const upgradesTotal = upgrades.reduce(
    (acc, u) => acc + u.service.price * u.quantity,
    0
  )
  const taxes = pricing?.taxes || 0
  const grandTotal = subtotal + upgradesTotal + taxes

  if (compact) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total da reserva</p>
            <p className="font-serif text-2xl font-bold text-foreground">
              R$ {grandTotal.toLocaleString('pt-BR')}
            </p>
          </div>
          {nights > 0 && (
            <Badge variant="secondary">
              {nights} noite{nights > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          Resumo da Reserva
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dates */}
        {checkIn && checkOut && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 animate-fade-in-up">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {format(checkIn, "d 'de' MMM", { locale: ptBR })}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {format(checkOut, "d 'de' MMM", { locale: ptBR })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {nights} noite{nights > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Guests */}
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">
            {guests} hóspede{guests > 1 ? 's' : ''}
          </span>
        </div>

        {/* Room */}
        {room && (
          <div className="animate-fade-in-up">
            <Separator className="my-4" />
            <div className="flex items-start gap-3">
              <BedDouble className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{room.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {room.type.toLowerCase()} - até {room.capacity} pessoas
                </p>
              </div>
              <p className="text-sm font-medium">
                R$ {subtotal.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {/* Upgrades */}
        {upgrades.length > 0 && (
          <div className="animate-fade-in-up">
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Extras
              </div>
              {upgrades.map((upgrade) => (
                <div
                  key={upgrade.service.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {upgrade.service.name}
                    {upgrade.quantity > 1 && ` (x${upgrade.quantity})`}
                  </span>
                  <span>
                    R$ {(upgrade.service.price * upgrade.quantity).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Totals */}
        <Separator />
        <div className="space-y-2">
          {room && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Hospedagem</span>
              <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
            </div>
          )}
          {upgradesTotal > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Extras</span>
              <span>R$ {upgradesTotal.toLocaleString('pt-BR')}</span>
            </div>
          )}
          {taxes > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Taxas</span>
              <span>R$ {taxes.toLocaleString('pt-BR')}</span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-serif text-2xl font-bold text-primary">
              R$ {grandTotal.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Pricing breakdown */}
        {pricing?.breakdown && pricing.breakdown.length > 0 && (
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <Tag className="h-3 w-3" />
              Ver detalhamento de diárias
            </summary>
            <div className="mt-2 space-y-1 rounded-lg bg-muted/50 p-2">
              {pricing.breakdown.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">
                    {format(new Date(day.date), "EEE, d 'de' MMM", { locale: ptBR })}
                    {day.dayType !== 'WEEKDAY' && (
                      <Badge variant="outline" className="ml-1 text-[10px]">
                        {day.dayType === 'WEEKEND'
                          ? 'Fim de semana'
                          : day.dayType === 'HOLIDAY'
                            ? 'Feriado'
                            : 'Alta temporada'}
                      </Badge>
                    )}
                  </span>
                  <span>R$ {day.price.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
