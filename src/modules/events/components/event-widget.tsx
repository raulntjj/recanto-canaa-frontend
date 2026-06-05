'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarDays,
  Users,
  PartyPopper,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  BedDouble,
  Music,
  UtensilsCrossed,
  Camera,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { EventCalendar } from './event-calendar'
import { useEventStore, type EventStep } from '../store'

const eventTypes = [
  { id: 'casamento', label: 'Casamento', icon: Sparkles },
  { id: 'aniversario', label: 'Aniversário', icon: PartyPopper },
  { id: 'corporativo', label: 'Evento Corporativo', icon: Users },
  { id: 'confraternizacao', label: 'Confraternização', icon: Music },
  { id: 'outro', label: 'Outro', icon: CalendarDays },
]

const services = [
  // { id: 'buffet', label: 'Buffet Completo', icon: UtensilsCrossed },
  { id: 'decoracao', label: 'Decoração', icon: Sparkles },
  { id: 'som', label: 'Som e Iluminação', icon: Music },
  { id: 'foto', label: 'Fotografia', icon: Camera },
  { id: 'hospedagem', label: 'Hospedagem para Convidados', icon: BedDouble },
]

const steps: { key: EventStep; label: string; icon: typeof CalendarDays }[] = [
  { key: 'info', label: 'Tipo', icon: PartyPopper },
  { key: 'details', label: 'Detalhes', icon: CalendarDays },
  { key: 'contact', label: 'Contato', icon: MessageSquare },
]

export function EventWidget() {
  const store = useEventStore()
  const [localEventDate, setLocalEventDate] = useState<Date | null>(
    store.formData.eventDate ? new Date(store.formData.eventDate) : null
  )
  const [localEndDate, setLocalEndDate] = useState<Date | null>(
    store.formData.endDate ? new Date(store.formData.endDate) : null
  )

  const [renderedStep, setRenderedStep] = useState<EventStep>(store.currentStep)
  const stepWrapperRef = useRef<HTMLDivElement>(null)
  const heightRef = useRef<number>(0)

  const currentStepIndex = steps.findIndex((s) => s.key === store.currentStep)

  // Step transition fade-out & scroll logic
  useEffect(() => {
    if (store.currentStep === renderedStep) return

    // Capture start height
    heightRef.current = stepWrapperRef.current?.offsetHeight || 0

    // Smooth scroll to top of event container with GSAP (custom ease and timing)
    const targetElement = document.getElementById('event-widget-container')
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
      if (!localEventDate || (localEventDate && localEndDate)) {
        setLocalEventDate(date)
        setLocalEndDate(null)
      } else if (date > localEventDate) {
        setLocalEndDate(date)
        store.updateFormData({
          eventDate: format(localEventDate, 'yyyy-MM-dd'),
          endDate: format(date, 'yyyy-MM-dd'),
        })
      } else {
        setLocalEventDate(date)
        setLocalEndDate(null)
      }
    },
    [localEventDate, localEndDate, store]
  )

  const toggleService = (serviceId: string) => {
    const current = store.formData.services
    if (current.includes(serviceId)) {
      store.updateFormData({ services: current.filter((s) => s !== serviceId) })
    } else {
      store.updateFormData({ services: [...current, serviceId] })
    }
  }

  const canProceed = () => {
    switch (store.currentStep) {
      case 'info':
        return store.formData.eventType !== ''
      case 'details':
        return localEventDate !== null
      case 'contact':
        return (
          store.formData.name !== '' &&
          store.formData.email !== '' &&
          store.formData.phone !== ''
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (store.currentStep === 'details' && localEventDate) {
      store.updateFormData({
        eventDate: format(localEventDate, 'yyyy-MM-dd'),
        endDate: localEndDate ? format(localEndDate, 'yyyy-MM-dd') : null,
      })
    }
    store.nextStep()
  }

  const handleSubmit = () => {
    console.log('[v0] Solicitação de evento:', store.formData)
    store.nextStep()
  }

  const days = localEventDate && localEndDate ? differenceInDays(localEndDate, localEventDate) + 1 : 1

  return (
    <div id="event-widget-container" className="mx-auto max-w-4xl">
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
                  onClick={() => isCompleted && store.setCurrentStep(step.key)}
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

      <div ref={stepWrapperRef} className="overflow-hidden">
        {/* Step: Info - Event Type */}
        {renderedStep === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Qual tipo de evento?
              </h2>
              <p className="mt-1 text-muted-foreground">
                Selecione o tipo de evento que deseja realizar no Recanto Canaã
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventTypes.map((type) => {
                const Icon = type.icon
                const isSelected = store.formData.eventType === type.id

                return (
                  <button
                    key={type.id}
                    onClick={() => store.updateFormData({ eventType: type.id })}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="font-medium">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Details - Date, Guests, Services */}
        {renderedStep === 'details' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Detalhes do evento
              </h2>
              <p className="mt-1 text-muted-foreground">
                Selecione a data e informe os detalhes do seu evento
              </p>
            </div>

            {/* Guests selector */}
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Número de convidados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      store.updateFormData({
                        guestCount: Math.max(10, store.formData.guestCount - 10),
                      })
                    }
                    disabled={store.formData.guestCount <= 10}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {store.formData.guestCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      store.updateFormData({
                        guestCount: Math.min(500, store.formData.guestCount + 10),
                      })
                    }
                    disabled={store.formData.guestCount >= 500}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Overnight option */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BedDouble className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Hospedagem para convidados?</span>
                  </div>
                  <Checkbox
                    checked={store.formData.hasOvernight}
                    onCheckedChange={(checked) =>
                      store.updateFormData({ hasOvernight: checked === true })
                    }
                  />
                </div>
                {store.formData.hasOvernight && (
                  <div className="flex items-center justify-between pl-8 animate-fade-in-up">
                    <span className="text-sm text-muted-foreground">
                      Quantos hóspedes?
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          store.updateFormData({
                            overnightGuests: Math.max(
                              0,
                              store.formData.overnightGuests - 5
                            ),
                          })
                        }
                        disabled={store.formData.overnightGuests <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-medium">
                        {store.formData.overnightGuests}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          store.updateFormData({
                            overnightGuests: Math.min(
                              50,
                              store.formData.overnightGuests + 5
                            ),
                          })
                        }
                        disabled={store.formData.overnightGuests >= 50}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar */}
            <EventCalendar
              selectedStart={localEventDate}
              selectedEnd={localEndDate}
              onDateSelect={handleDateSelect}
            />

            {localEventDate && (
              <div className="rounded-lg bg-primary/10 p-4 text-center animate-fade-in-up">
                <p className="text-sm text-muted-foreground">Data selecionada</p>
                <p className="font-serif text-lg font-semibold text-foreground">
                  {format(localEventDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  {localEndDate &&
                    ` - ${format(localEndDate, "d 'de' MMMM", { locale: ptBR })}`}
                </p>
                {localEndDate && (
                  <p className="text-sm text-primary">
                    {days} dia{days > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {/* Services */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">
                Serviços de interesse (opcional)
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => {
                  const Icon = service.icon
                  const isSelected = store.formData.services.includes(service.id)

                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border p-4 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <span className="font-medium">{service.label}</span>
                      {isSelected && <Check className="ml-auto h-4 w-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step: Contact */}
        {renderedStep === 'contact' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Seus dados de contato
              </h2>
              <p className="mt-1 text-muted-foreground">
                Preencha seus dados para recebermos sua solicitação
              </p>
            </div>

            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={store.formData.name}
                    onChange={(e) => store.updateFormData({ name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={store.formData.email}
                      onChange={(e) => store.updateFormData({ email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={store.formData.phone}
                      onChange={(e) => store.updateFormData({ phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem (opcional)</Label>
                  <Textarea
                    id="message"
                    value={store.formData.message}
                    onChange={(e) => store.updateFormData({ message: e.target.value })}
                    placeholder="Conte mais sobre o seu evento..."
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                >
                  Enviar Solicitação
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
                Solicitação Enviada!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Recebemos sua solicitação de evento. Nossa equipe entrará em contato em
                até 48 horas com um orçamento personalizado.
              </p>
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Tipo de evento</p>
                <p className="font-serif text-lg font-semibold text-foreground capitalize">
                  {eventTypes.find((t) => t.id === store.formData.eventType)?.label ||
                    store.formData.eventType}
                </p>
              </div>
              <Button className="mt-6" variant="outline" onClick={() => store.reset()}>
                Fazer nova solicitação
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      {renderedStep !== 'confirmation' && renderedStep !== 'contact' && (
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
  )
}
