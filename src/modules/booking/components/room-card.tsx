'use client'

import { Users, Maximize2, Wifi, Car, Coffee, Bath, Flame, Mountain } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RoomAvailability } from '../schemas/booking.schema'

interface RoomCardProps {
  room: RoomAvailability
  isSelected?: boolean
  onSelect: (room: RoomAvailability) => void
  nights?: number
}

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  estacionamento: Car,
  'café da manhã': Coffee,
  banheira: Bath,
  lareira: Flame,
  'vista montanha': Mountain,
}

const getAmenityIcon = (amenity: string) => {
  const key = amenity.toLowerCase()
  for (const [keyword, icon] of Object.entries(amenityIcons)) {
    if (key.includes(keyword)) return icon
  }
  return null
}

export function RoomCard({ room, isSelected, onSelect, nights = 1 }: RoomCardProps) {
  const totalPrice = room.basePrice * nights

  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden transition-all hover:shadow-lg',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={() => onSelect(room)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {room.images[0] ? (
          <img
            src={room.images[0]}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <Mountain className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Type Badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm"
        >
          {room.type === 'CHALE' ? 'Chalé' : room.type === 'SUITE' ? 'Suíte' : 'Quarto'}
        </Badge>

        {/* Availability Badge */}
        {!room.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
            <Badge variant="destructive" className="text-sm">
              Indisponível
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title & Capacity */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground">{room.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{room.capacity}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{room.description}</p>

        {/* Amenities */}
        <div className="mt-3 flex flex-wrap gap-2">
          {room.amenities.slice(0, 4).map((amenity) => {
            const Icon = getAmenityIcon(amenity)
            return (
              <Badge key={amenity} variant="outline" className="gap-1 text-xs">
                {Icon && <Icon className="h-3 w-3" />}
                {amenity}
              </Badge>
            )
          })}
          {room.amenities.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{room.amenities.length - 4}
            </Badge>
          )}
        </div>

        {/* Price & CTA */}
        <div className="mt-4 flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {nights > 1 ? `${nights} noites` : 'por noite'}
            </p>
            <p className="font-serif text-2xl font-bold text-foreground">
              R$ {totalPrice.toLocaleString('pt-BR')}
            </p>
          </div>
          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            disabled={!room.available}
          >
            {isSelected ? 'Selecionado' : 'Selecionar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface RoomListProps {
  rooms: RoomAvailability[]
  selectedRoomId?: string
  onSelectRoom: (room: RoomAvailability) => void
  nights?: number
  isLoading?: boolean
}

export function RoomList({
  rooms,
  selectedRoomId,
  onSelectRoom,
  nights = 1,
  isLoading,
}: RoomListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <CardContent className="space-y-3 p-4">
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/50 py-12 text-center">
        <Maximize2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 font-medium text-foreground">
          Nenhum quarto disponível
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente selecionar outras datas para ver as opções disponíveis.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          isSelected={room.id === selectedRoomId}
          onSelect={onSelectRoom}
          nights={nights}
        />
      ))}
    </div>
  )
}
