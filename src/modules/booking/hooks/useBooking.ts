'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  searchAvailability,
  getCalendarAvailability,
  calculatePrice,
  getUpgradeServices,
  createBooking,
  getBookingByCode,
  cancelBooking,
} from '../services/booking.service'
import type {
  SearchAvailabilityRequest,
  CreateBookingRequest,
} from '../schemas/booking.schema'

// ========================================
// REACT QUERY HOOKS - ÉPICO 2: MOTOR DE RESERVAS
// ========================================

// Query Keys para invalidação consistente
export const bookingKeys = {
  all: ['booking'] as const,
  availability: (params: SearchAvailabilityRequest) =>
    [...bookingKeys.all, 'availability', params] as const,
  calendar: (month: number, year: number) =>
    [...bookingKeys.all, 'calendar', month, year] as const,
  price: (roomId: string, checkIn: string, checkOut: string, upgradeIds?: string[]) =>
    [...bookingKeys.all, 'price', roomId, checkIn, checkOut, upgradeIds] as const,
  upgrades: () => [...bookingKeys.all, 'upgrades'] as const,
  reservation: (code: string) => [...bookingKeys.all, 'reservation', code] as const,
}

/**
 * Hook para buscar disponibilidade de quartos
 * RF06: Calendário Interativo
 */
export function useRoomAvailability(params: SearchAvailabilityRequest | null) {
  return useQuery({
    queryKey: params ? bookingKeys.availability(params) : ['disabled'],
    queryFn: () => searchAvailability(params!),
    enabled: !!params && !!params.checkIn && !!params.checkOut,
    staleTime: 2 * 60 * 1000, // 2 minutos (disponibilidade muda com frequência)
  })
}

/**
 * Hook para buscar calendário mensal
 * RF06: Visualização de disponibilidade no calendário
 */
export function useCalendarAvailability(month: number, year: number) {
  return useQuery({
    queryKey: bookingKeys.calendar(month, year),
    queryFn: () => getCalendarAvailability(month, year),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para calcular preço dinâmico
 * RF07: Precificação Dinâmica
 * RF08: Upgrades no Checkout
 */
export function useCalculatePrice(params: {
  roomId: string
  checkIn: string
  checkOut: string
  upgradeIds?: string[]
} | null) {
  return useQuery({
    queryKey: params
      ? bookingKeys.price(params.roomId, params.checkIn, params.checkOut, params.upgradeIds)
      : ['disabled'],
    queryFn: () => calculatePrice(params!),
    enabled: !!params && !!params.roomId && !!params.checkIn && !!params.checkOut,
    staleTime: 1 * 60 * 1000, // 1 minuto (preços podem variar)
  })
}

/**
 * Hook para buscar serviços de upgrade
 * RF08: Venda de Upgrades no Checkout
 */
export function useUpgradeServices() {
  return useQuery({
    queryKey: bookingKeys.upgrades(),
    queryFn: getUpgradeServices,
    staleTime: 30 * 60 * 1000, // 30 minutos (upgrades mudam raramente)
  })
}

/**
 * Hook para criar reserva
 * RF09: Aceite obrigatório de políticas
 */
export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: () => {
      // Invalidar cache de disponibilidade após reserva
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}

/**
 * Hook para buscar reserva por código
 */
export function useBookingByCode(confirmationCode: string | null) {
  return useQuery({
    queryKey: confirmationCode ? bookingKeys.reservation(confirmationCode) : ['disabled'],
    queryFn: () => getBookingByCode(confirmationCode!),
    enabled: !!confirmationCode,
  })
}

/**
 * Hook para cancelar reserva
 */
export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reservationId, reason }: { reservationId: string; reason?: string }) =>
      cancelBooking(reservationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}
