'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarDays,
  Users,
  BedDouble,
  Sparkles,
  User,
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { BookingCalendar } from './booking-calendar'
import { RoomList } from './room-card'
import { UpgradeSelector } from './upgrade-selector'
import { GuestForm, type GuestFormData } from './guest-form'
import { BookingSummary } from './booking-summary'
import { useBookingStore, type CheckoutStep } from '../store'
import type { RoomAvailability, UpgradeService } from '../schemas/booking.schema'

// Mock data para demonstração
const mockRooms: RoomAvailability[] = [
  {
    id: '1',
    name: 'Chalé das Palmeiras',
    type: 'CHALE',
    capacity: 4,
    description: 'Chalé aconchegante com varanda privativa, lareira e vista para o lago. Perfeito para casais ou famílias pequenas.',
    amenities: ['Varanda', 'Lareira', 'Vista Lago', 'WiFi', 'Ar Condicionado'],
    images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800'],
    basePrice: 450,
    available: true,
  },
  {
    id: '2',
    name: 'Suíte Master',
    type: 'SUITE',
    capacity: 2,
    description: 'Nossa suíte mais luxuosa com jacuzzi privativa, cama king size e café da manhã incluso.',
    amenities: ['Jacuzzi', 'Cama King', 'Café Incluso', 'Vista Montanha', 'Frigobar'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    basePrice: 650,
    available: true,
  },
  {
    id: '3',
    name: 'Quarto Girassol',
    type: 'QUARTO',
    capacity: 3,
    description: 'Quarto confortável com decoração campestre e varanda com rede.',
    amenities: ['Varanda', 'Rede', 'Ar Condicionado', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
    basePrice: 350,
    available: true,
  },
  {
    id: '4',
    name: 'Chalé do Lago',
    type: 'CHALE',
    capacity: 6,
    description: 'Chalé espaçoso à beira do lago com deck privativo e churrasqueira.',
    amenities: ['Deck', 'Churrasqueira', 'Pier', 'Lareira', 'Cozinha Completa'],
    images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800'],
    basePrice: 850,
    available: false,
  },
]

const mockUpgrades: UpgradeService[] = [
  {
    id: 'u1',
    name: 'Cesta de Café da Manhã Premium',
    description: 'Frutas frescas, pães artesanais, queijos especiais e café colonial servido no quarto.',
    price: 120,
    category: 'BREAKFAST',
    maxQuantity: 4,
  },
  {
    id: 'u2',
    name: 'Decoração Romântica',
    description: 'Pétalas de rosa, velas aromáticas e espumante para uma noite especial.',
    price: 180,
    category: 'DECORATION',
    maxQuantity: 1,
  },
  {
    id: 'u3',
    name: 'Kit Lenha para Fogueira',
    description: 'Lenha selecionada, isqueiro longo e marshmallows para uma fogueira perfeita.',
    price: 45,
    category: 'AMENITY',
    maxQuantity: 3,
  },
  {
    id: 'u4',
    name: 'Passeio a Cavalo',
    description: 'Passeio guiado de 1 hora pelas trilhas da fazenda.',
    price: 150,
    category: 'EXPERIENCE',
    maxQuantity: 4,
  },
  {
    id: 'u5',
    name: 'Transfer Aeroporto',
    description: 'Transfer privativo do aeroporto até o Recanto Canaã.',
    price: 250,
    category: 'TRANSFER',
    maxQuantity: 1,
  },
]

const steps: { key: CheckoutStep; label: string; icon: typeof CalendarDays }[] = [
  { key: 'dates', label: 'Datas', icon: CalendarDays },
  { key: 'room', label: 'Acomodação', icon: BedDouble },
  { key: 'upgrades', label: 'Extras', icon: Sparkles },
  { key: 'guest', label: 'Dados', icon: User },
  { key: 'payment', label: 'Pagamento', icon: CreditCard },
]

export function BookingWidget() {
  const store = useBookingStore()
  const [mounted, setMounted] = useState(false)
  const [localCheckIn, setLocalCheckIn] = useState<Date | null>(null)
  const [localCheckOut, setLocalCheckOut] = useState<Date | null>(null)
  const [policyAccepted, setPolicyAccepted] = useState(false)

  // Hydration sync
  useEffect(() => {
    setMounted(true)
    if (store.checkIn) setLocalCheckIn(new Date(store.checkIn))
    if (store.checkOut) setLocalCheckOut(new Date(store.checkOut))
  }, [store.checkIn, store.checkOut])

  const nights =
    localCheckIn && localCheckOut
      ? differenceInDays(localCheckOut, localCheckIn)
      : 0

  const [renderedStep, setRenderedStep] = useState<CheckoutStep>(store.currentStep)
  const stepWrapperRef = useRef<HTMLDivElement>(null)
  const heightRef = useRef<number>(0)

  const currentStepIndex = steps.findIndex((s) => s.key === store.currentStep)


  // Step transition fade-out & scroll logic
  useEffect(() => {
    if (store.currentStep === renderedStep) return

    // Capture start height
    heightRef.current = stepWrapperRef.current?.offsetHeight || 0

    // Smooth scroll to top of booking container with GSAP (custom ease and timing)
    const targetElement = document.getElementById('booking-widget-container')
    if (targetElement && typeof window !== 'undefined') {
      const targetY = Math.max(0, targetElement.getBoundingClientRect().top + window.scrollY - 110)
      const obj = { y: window.scrollY }
      gsap.to(obj, {
        y: targetY,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          window.scrollTo(0, obj.y)
        }
      })
    }

    // Fade out old step
    gsap.to(stepWrapperRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        setRenderedStep(store.currentStep)
      }
    })
  }, [store.currentStep, renderedStep])

  // Step transition fade-in & height animation
  useEffect(() => {
    if (!stepWrapperRef.current) return

    const startHeight = heightRef.current || stepWrapperRef.current.offsetHeight

    // Temporarily set height to auto and opacity to 1 to measure natural height
    stepWrapperRef.current.style.height = 'auto'
    stepWrapperRef.current.style.opacity = '1'
    const endHeight = stepWrapperRef.current.offsetHeight

    // Animate height and fade in content
    gsap.fromTo(stepWrapperRef.current,
      { height: startHeight, opacity: 0, y: 12 },
      {
        height: endHeight,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'height,transform'
      }
    )
  }, [renderedStep])

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (!localCheckIn || (localCheckIn && localCheckOut)) {
        setLocalCheckIn(date)
        setLocalCheckOut(null)
      } else if (date > localCheckIn) {
        setLocalCheckOut(date)
        store.setDates(
          format(localCheckIn, 'yyyy-MM-dd'),
          format(date, 'yyyy-MM-dd')
        )
      } else {
        setLocalCheckIn(date)
        setLocalCheckOut(null)
      }
    },
    [localCheckIn, localCheckOut, store]
  )

  const canProceed = () => {
    switch (store.currentStep) {
      case 'dates':
        return localCheckIn && localCheckOut && nights > 0
      case 'room':
        return store.selectedRoom !== null
      case 'upgrades':
        return true // Upgrades são opcionais
      case 'guest':
        return store.guestInfo !== null
      case 'payment':
        return policyAccepted
      default:
        return false
    }
  }

  const handleNext = () => {
    if (store.currentStep === 'dates' && localCheckIn && localCheckOut) {
      store.setDates(
        format(localCheckIn, 'yyyy-MM-dd'),
        format(localCheckOut, 'yyyy-MM-dd')
      )
    }
    store.nextStep()
  }

  const handleGuestSubmit = (data: GuestFormData) => {
    store.setGuestInfo({
      name: data.name,
      email: data.email,
      phone: data.phone,
      document: data.document,
    })
    store.setSpecialRequests(data.specialRequests || '')
    store.nextStep()
  }

  const handleConfirmBooking = () => {
    console.log('[v0] Confirmar reserva:', {
      checkIn: store.checkIn,
      checkOut: store.checkOut,
      room: store.selectedRoom,
      upgrades: store.selectedUpgrades,
      guest: store.guestInfo,
    })
    // Em produção: usar useCreateBooking mutation
    store.goToStep('confirmation')
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        {/* Skeleton Progress Steps */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-32 bg-muted rounded-full" />
            ))}
          </div>
        </div>
        {/* Skeleton Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-[400px] bg-muted rounded-lg" />
          </div>
          <div className="h-[300px] bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div id="booking-widget-container" className="mx-auto max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max items-center justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = step.key === store.currentStep
            const isCompleted = index < currentStepIndex
            const Icon = step.icon

            return (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => isCompleted && store.goToStep(step.key)}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && 'bg-primary/20 text-primary hover:bg-primary/30',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div ref={stepWrapperRef} className="overflow-hidden">
            {/* Step: Dates */}
            {renderedStep === 'dates' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Selecione as datas
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Escolha o período da sua estadia no Recanto Canaã
                  </p>
                </div>

                {/* Guests selector */}
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Número de hóspedes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => store.setGuests(Math.max(1, store.guests - 1))}
                        disabled={store.guests <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{store.guests}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => store.setGuests(Math.min(10, store.guests + 1))}
                        disabled={store.guests >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <BookingCalendar
                  selectedCheckIn={localCheckIn}
                  selectedCheckOut={localCheckOut}
                  onDateSelect={handleDateSelect}
                />

                {localCheckIn && localCheckOut && (
                  <div className="rounded-lg bg-primary/10 p-4 text-center animate-fade-in-up">
                    <p className="text-sm text-muted-foreground">Período selecionado</p>
                    <p className="font-serif text-lg font-semibold text-foreground">
                      {format(localCheckIn, "d 'de' MMMM", { locale: ptBR })} -{' '}
                      {format(localCheckOut, "d 'de' MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-primary">
                      {nights} noite{nights > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step: Room */}
            {renderedStep === 'room' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Escolha sua acomodação
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Selecione o quarto ou chalé ideal para sua estadia
                  </p>
                </div>

                <RoomList
                  rooms={mockRooms}
                  selectedRoomId={store.selectedRoom?.id}
                  onSelectRoom={(room) => store.setSelectedRoom(room)}
                  nights={nights}
                />
              </div>
            )}

            {/* Step: Upgrades */}
            {renderedStep === 'upgrades' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Personalize sua experiência
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Adicione serviços extras para tornar sua estadia ainda mais especial
                  </p>
                </div>

                <UpgradeSelector
                  services={mockUpgrades}
                  selectedUpgrades={store.selectedUpgrades}
                  onAddUpgrade={(service) => store.addUpgrade(service)}
                  onRemoveUpgrade={(id) => store.removeUpgrade(id)}
                  onUpdateQuantity={(id, qty) => store.updateUpgradeQuantity(id, qty)}
                />
              </div>
            )}

            {/* Step: Guest */}
            {renderedStep === 'guest' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Seus dados
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Preencha os dados do hóspede principal
                  </p>
                </div>

                <GuestForm
                  initialData={store.guestInfo || undefined}
                  onSubmit={handleGuestSubmit}
                />
              </div>
            )}

            {/* Step: Payment */}
            {renderedStep === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Confirmar reserva
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Revise os detalhes e aceite as políticas para confirmar
                  </p>
                </div>

                {/* Policy acceptance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Política de Cancelamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                      <ul className="space-y-2">
                        <li>
                          <strong>Até 7 dias antes:</strong> Reembolso de 100% do valor
                        </li>
                        <li>
                          <strong>De 7 a 3 dias antes:</strong> Reembolso de 50% do valor
                        </li>
                        <li>
                          <strong>Menos de 3 dias:</strong> Sem reembolso
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="policy"
                        checked={policyAccepted}
                        onCheckedChange={(checked) => setPolicyAccepted(checked === true)}
                      />
                      <Label htmlFor="policy" className="text-sm leading-relaxed">
                        Li e aceito as políticas de cancelamento e os termos de uso do
                        Recanto Canaã.
                      </Label>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={!policyAccepted}
                      onClick={handleConfirmBooking}
                    >
                      Confirmar Reserva
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step: Confirmation */}
            {renderedStep === 'confirmation' && (
              <Card className="text-center">
                <CardContent className="py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Reserva Confirmada!
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Sua reserva foi realizada com sucesso. Você receberá um email com
                    todos os detalhes.
                  </p>
                  <div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Código da reserva</p>
                    <p className="font-mono text-2xl font-bold text-primary">
                      REC-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                    </p>
                  </div>
                  <Button
                    className="mt-6"
                    variant="outline"
                    onClick={() => store.reset()}
                  >
                    Fazer nova reserva
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navigation */}
          {renderedStep !== 'confirmation' && renderedStep !== 'guest' && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => store.previousStep()}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()}>
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="hidden lg:block">
          <BookingSummary
            checkIn={localCheckIn}
            checkOut={localCheckOut}
            guests={store.guests}
            room={store.selectedRoom}
            upgrades={store.selectedUpgrades}
          />
        </div>
      </div>
    </div>
  )
}
