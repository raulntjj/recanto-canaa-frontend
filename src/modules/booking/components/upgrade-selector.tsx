'use client'

import { Plus, Minus, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { UpgradeService } from '../schemas/booking.schema'

interface UpgradeCardProps {
  service: UpgradeService
  quantity: number
  onAdd: () => void
  onRemove: () => void
  onQuantityChange: (quantity: number) => void
}

const categoryLabels: Record<UpgradeService['category'], string> = {
  BREAKFAST: 'Café da Manhã',
  DECORATION: 'Decoração',
  EXPERIENCE: 'Experiência',
  AMENITY: 'Amenidade',
  TRANSFER: 'Transfer',
}

const categoryColors: Record<UpgradeService['category'], string> = {
  BREAKFAST: 'bg-orange-100 text-orange-700',
  DECORATION: 'bg-pink-100 text-pink-700',
  EXPERIENCE: 'bg-blue-100 text-blue-700',
  AMENITY: 'bg-green-100 text-green-700',
  TRANSFER: 'bg-purple-100 text-purple-700',
}

function UpgradeCard({
  service,
  quantity,
  onAdd,
  onRemove,
  onQuantityChange,
}: UpgradeCardProps) {
  const isSelected = quantity > 0
  const total = service.price * quantity

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 p-4 transition-all',
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
      )}
    >
      <div className="flex gap-4">
        {/* Image */}
        {service.image && (
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={service.image}
              alt={service.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-foreground">{service.name}</h4>
              <Badge
                variant="secondary"
                className={cn('mt-1 text-xs', categoryColors[service.category])}
              >
                {categoryLabels[service.category]}
              </Badge>
            </div>
            <p className="font-semibold text-foreground">
              R$ {service.price.toLocaleString('pt-BR')}
            </p>
          </div>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>

          {/* Quantity Controls */}
          <div className="mt-3 flex items-center justify-between">
            {isSelected ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onRemove}
                >
                  {quantity === 1 ? <X className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onQuantityChange(quantity + 1)}
                  disabled={quantity >= service.maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onAdd}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            )}

            {isSelected && (
              <p className="text-sm font-medium text-primary">
                Total: R$ {total.toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface UpgradeSelectorProps {
  services: UpgradeService[]
  selectedUpgrades: { service: UpgradeService; quantity: number }[]
  onAddUpgrade: (service: UpgradeService) => void
  onRemoveUpgrade: (serviceId: string) => void
  onUpdateQuantity: (serviceId: string, quantity: number) => void
  isLoading?: boolean
}

export function UpgradeSelector({
  services,
  selectedUpgrades,
  onAddUpgrade,
  onRemoveUpgrade,
  onUpdateQuantity,
  isLoading,
}: UpgradeSelectorProps) {
  const getQuantity = (serviceId: string) =>
    selectedUpgrades.find((u) => u.service.id === serviceId)?.quantity || 0

  const totalUpgrades = selectedUpgrades.reduce(
    (acc, u) => acc + u.service.price * u.quantity,
    0
  )

  // Agrupar por categoria
  const groupedServices = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = []
      }
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, UpgradeService[]>
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com total */}
      {selectedUpgrades.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {selectedUpgrades.length} upgrade{selectedUpgrades.length > 1 ? 's' : ''} selecionado
              {selectedUpgrades.length > 1 ? 's' : ''}
            </p>
            <p className="font-serif text-xl font-bold text-primary">
              + R$ {totalUpgrades.toLocaleString('pt-BR')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedUpgrades.forEach((u) => onRemoveUpgrade(u.service.id))}
          >
            Limpar todos
          </Button>
        </div>
      )}

      {/* Lista por categoria */}
      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category}>
          <h3 className="mb-3 font-medium text-foreground">
            {categoryLabels[category as UpgradeService['category']]}
          </h3>
          <div className="space-y-3">
            {categoryServices.map((service) => (
              <UpgradeCard
                key={service.id}
                service={service}
                quantity={getQuantity(service.id)}
                onAdd={() => onAddUpgrade(service)}
                onRemove={() => {
                  const qty = getQuantity(service.id)
                  if (qty === 1) {
                    onRemoveUpgrade(service.id)
                  } else {
                    onUpdateQuantity(service.id, qty - 1)
                  }
                }}
                onQuantityChange={(qty) => onUpdateQuantity(service.id, qty)}
              />
            ))}
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          Nenhum upgrade disponível para esta reserva.
        </p>
      )}
    </div>
  )
}
