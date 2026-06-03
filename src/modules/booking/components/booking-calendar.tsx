'use client'

import { useState, useCallback } from 'react'
import { format, addMonths, subMonths, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CalendarDay {
  date: string
  status: 'AVAILABLE' | 'PARTIAL' | 'FULL' | 'BLOCKED'
  minPrice?: number
  availableRooms: number
  isHighSeason: boolean
  isHoliday: boolean
}

interface BookingCalendarProps {
  availabilityData?: {
    month: number
    year: number
    days: CalendarDay[]
  }
  selectedCheckIn: Date | null
  selectedCheckOut: Date | null
  onDateSelect: (date: Date) => void
  onMonthChange?: (month: number, year: number) => void
  minDate?: Date
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Mock data para demonstração
const generateMockAvailability = (month: number, year: number): CalendarDay[] => {
  const days: CalendarDay[] = []
  const daysInMonth = new Date(year, month, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayOfWeek = new Date(year, month - 1, day).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Simular disponibilidade aleatória
    const rand = Math.random()
    let status: CalendarDay['status'] = 'AVAILABLE'
    if (rand > 0.85) status = 'FULL'
    else if (rand > 0.7) status = 'PARTIAL'
    else if (rand > 0.95) status = 'BLOCKED'
    
    days.push({
      date,
      status,
      minPrice: isWeekend ? 450 : 350,
      availableRooms: status === 'FULL' ? 0 : Math.floor(Math.random() * 8) + 1,
      isHighSeason: month === 12 || month === 1 || month === 7,
      isHoliday: day === 25 && month === 12,
    })
  }
  
  return days
}

export function BookingCalendar({
  availabilityData,
  selectedCheckIn,
  selectedCheckOut,
  onDateSelect,
  onMonthChange,
  minDate = new Date(),
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  // Usar dados mockados se não houver dados reais
  const days = availabilityData?.days || generateMockAvailability(currentMonth, currentYear)

  const handlePreviousMonth = useCallback(() => {
    const newDate = subMonths(currentDate, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate.getMonth() + 1, newDate.getFullYear())
  }, [currentDate, onMonthChange])

  const handleNextMonth = useCallback(() => {
    const newDate = addMonths(currentDate, 1)
    setCurrentDate(newDate)
    onMonthChange?.(newDate.getMonth() + 1, newDate.getFullYear())
  }, [currentDate, onMonthChange])

  // Calcular primeiro dia do mês
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()

  const handleDateClick = (day: CalendarDay) => {
    if (day.status === 'BLOCKED' || day.status === 'FULL') return
    
    const clickedDate = new Date(day.date + 'T12:00:00')
    if (isBefore(clickedDate, startOfDay(minDate))) return
    
    onDateSelect(clickedDate)
  }

  const isInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false
    return isAfter(date, selectedCheckIn) && isBefore(date, selectedCheckOut)
  }

  const isCheckIn = (date: Date) => selectedCheckIn && isSameDay(date, selectedCheckIn)
  const isCheckOut = (date: Date) => selectedCheckOut && isSameDay(date, selectedCheckOut)

  return (
    <div className="w-full rounded-xl border bg-card p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          disabled={currentMonth === new Date().getMonth() + 1 && currentYear === new Date().getFullYear()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-serif text-lg font-semibold capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekdays */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayDate = new Date(day.date + 'T12:00:00')
          const dayNumber = index + 1
          const isPast = isBefore(dayDate, startOfDay(minDate))
          const isDisabled = isPast || day.status === 'BLOCKED' || day.status === 'FULL'
          const isSelected = isCheckIn(dayDate) || isCheckOut(dayDate)
          const inRange = isInRange(dayDate)

          return (
            <button
              key={day.date}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg p-1 text-sm transition-all',
                // Base styles
                'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                // Disabled
                isDisabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                // Selected (check-in/out)
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                // In range
                inRange && !isSelected && 'bg-primary/20',
                // Status colors when not selected
                !isSelected && !inRange && day.status === 'PARTIAL' && 'bg-yellow-50',
                !isSelected && !inRange && day.status === 'AVAILABLE' && 'bg-green-50/50',
                // High season indicator
                day.isHighSeason && !isSelected && 'ring-1 ring-inset ring-accent/50'
              )}
            >
              <span className={cn('font-medium', isSelected && 'text-primary-foreground')}>
                {dayNumber}
              </span>
              {day.minPrice && !isDisabled && (
                <span
                  className={cn(
                    'text-[10px]',
                    isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}
                >
                  R${day.minPrice}
                </span>
              )}
              {/* Holiday indicator */}
              {day.isHoliday && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-green-50 ring-1 ring-green-200" />
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-yellow-50 ring-1 ring-yellow-200" />
          <span>Poucas vagas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-muted opacity-40" />
          <span>Indisponível</span>
        </div>
      </div>
    </div>
  )
}
