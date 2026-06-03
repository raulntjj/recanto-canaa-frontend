import api from '@/core/api/axios'
import type {
  SearchAvailabilityRequest,
  SearchAvailabilityResponse,
  CalculatePriceResponse,
  CreateBookingRequest,
  BookingConfirmation,
  CalendarAvailabilityResponse,
  UpgradeService,
} from '../schemas/booking.schema'
import {
  SearchAvailabilityResponseSchema,
  CalculatePriceResponseSchema,
  BookingConfirmationSchema,
  CalendarAvailabilityResponseSchema,
} from '../schemas/booking.schema'
import { z } from 'zod'

// ========================================
// SERVIÇOS HTTP - ÉPICO 2: MOTOR DE RESERVAS
// ========================================

/**
 * Busca disponibilidade de quartos para período selecionado
 * RF06: Calendário Interativo - disponibilidade em tempo real
 */
export async function searchAvailability(
  params: SearchAvailabilityRequest
): Promise<SearchAvailabilityResponse> {
  const response = await api.get('/booking/availability', { params })
  return SearchAvailabilityResponseSchema.parse(response.data)
}

/**
 * Busca calendário mensal de disponibilidade
 * RF06: Visualização mensal para seleção de datas
 */
export async function getCalendarAvailability(
  month: number,
  year: number
): Promise<CalendarAvailabilityResponse> {
  const response = await api.get('/booking/calendar', {
    params: { month, year },
  })
  return CalendarAvailabilityResponseSchema.parse(response.data)
}

/**
 * Calcula preço total da reserva incluindo upgrades
 * RF07: Precificação Dinâmica
 * RF08: Venda de Upgrades no Checkout
 */
export async function calculatePrice(params: {
  roomId: string
  checkIn: string
  checkOut: string
  upgradeIds?: string[]
}): Promise<CalculatePriceResponse> {
  const response = await api.post('/booking/calculate', params)
  return CalculatePriceResponseSchema.parse(response.data)
}

/**
 * Lista serviços de upgrade disponíveis
 * RF08: Upgrades no Checkout
 */
export async function getUpgradeServices(): Promise<UpgradeService[]> {
  const response = await api.get('/booking/upgrades')
  return z.array(z.any()).parse(response.data) as UpgradeService[]
}

/**
 * Cria uma nova reserva
 * RF09: Políticas de Cancelamento - aceite obrigatório
 */
export async function createBooking(
  data: CreateBookingRequest
): Promise<BookingConfirmation> {
  const response = await api.post('/booking/reservations', data)
  return BookingConfirmationSchema.parse(response.data)
}

/**
 * Busca detalhes de uma reserva pelo código de confirmação
 */
export async function getBookingByCode(
  confirmationCode: string
): Promise<BookingConfirmation> {
  const response = await api.get(`/booking/reservations/${confirmationCode}`)
  return BookingConfirmationSchema.parse(response.data)
}

/**
 * Cancela uma reserva existente
 */
export async function cancelBooking(
  reservationId: string,
  reason?: string
): Promise<{ refundAmount: number; refundPercentage: number }> {
  const response = await api.post(`/booking/reservations/${reservationId}/cancel`, {
    reason,
  })
  return response.data
}
