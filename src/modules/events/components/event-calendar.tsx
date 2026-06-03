'use client'

import { useState, useCallback, useEffect } from 'react'
import { format, addMonths, subMonths, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CalendarDay {
  date: string
  status: 'AVAILABLE' | 'PARTIAL' | 'BLOCKED'
}

interface EventCalendarProps {
  selectedStart: Date | null
  selectedEnd: Date | null
  onDateSelect: (date: Date) => void
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

const getInitialDate = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1, 12, 0, 0)
}

const generateMockAvailability = (month: number, year: number): CalendarDay[] => {
  const days: CalendarDay[] = []
  const daysInMonth = new Date(year, month, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const seed = year * 10000 + month * 100 + day
    const rand = seededRandom(seed)
    
    let status: CalendarDay['status'] = 'AVAILABLE'
    if (rand > 0.9) status = 'BLOCKED'
    else if (rand > 0.8) status = 'PARTIAL'
    
    days.push({ date, status })
  }
  
  return days
}

export function EventCalendar({
  selectedStart,
  selectedEnd,
  onDateSelect,
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(getInitialDate)
  const [today, setToday] = useState<Date | null>(null)
  
  useEffect(() => {
    setToday(new Date())
  }, [])
  
  const effectiveMinDate = today || getInitialDate()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const days = generateMockAvailability(currentMonth, currentYear)

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(subMonths(currentDate, 1))
  }, [currentDate])

  const handleNextMonth = useCallback(() => {
    setCurrentDate(addMonths(currentDate, 1))
  }, [currentDate])

  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay()

  const handleDateClick = (day: CalendarDay) => {
    if (day.status === 'BLOCKED') return
    
    const clickedDate = new Date(day.date + 'T12:00:00')
    if (isBefore(clickedDate, startOfDay(effectiveMinDate))) return
    
    onDateSelect(clickedDate)
  }

  const isInRange = (date: Date) => {
    if (!selectedStart || !selectedEnd) return false
    return isAfter(date, selectedStart) && isBefore(date, selectedEnd)
  }

  const isStart = (date: Date) => selectedStart && isSameDay(date, selectedStart)
  const isEnd = (date: Date) => selectedEnd && isSameDay(date, selectedEnd)

  const initialMonth = getInitialDate().getMonth() + 1
  const initialYear = getInitialDate().getFullYear()

  return (
    <div className="w-full rounded-xl border bg-card p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          disabled={currentMonth === initialMonth && currentYear === initialYear}
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
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map((day, index) => {
          const dayDate = new Date(day.date + 'T12:00:00')
          const dayNumber = index + 1
          const isPast = isBefore(dayDate, startOfDay(effectiveMinDate))
          const isDisabled = isPast || day.status === 'BLOCKED'
          const isSelected = isStart(dayDate) || isEnd(dayDate)
          const inRange = isInRange(dayDate)

          return (
            <button
              key={day.date}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg p-1 text-sm transition-all',
                'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isDisabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                inRange && !isSelected && 'bg-primary/20',
                !isSelected && !inRange && day.status === 'PARTIAL' && 'bg-yellow-50',
                !isSelected && !inRange && day.status === 'AVAILABLE' && 'bg-green-50/50'
              )}
            >
              <span className={cn('font-medium', isSelected && 'text-primary-foreground')}>
                {dayNumber}
              </span>
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
          <span>Consultar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-muted opacity-40" />
          <span>Reservado</span>
        </div>
      </div>
    </div>
  )
}
