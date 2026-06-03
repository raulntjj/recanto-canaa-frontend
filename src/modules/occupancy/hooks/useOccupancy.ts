'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOccupancyDashboard,
  getGovernanceStatus,
  updateRoomStatus,
  performCheckIn,
  performCheckOut,
  markRoomAsCleaned,
} from '../services/occupancy.service'
import type {
  UpdateRoomStatusRequest,
  CheckInRequest,
  CheckOutRequest,
} from '../schemas/occupancy.schema'

// ========================================
// REACT QUERY HOOKS - ÉPICO 5: PAINEL DE OCUPAÇÃO
// ========================================

// Query Keys para invalidação consistente
export const occupancyKeys = {
  all: ['occupancy'] as const,
  dashboard: (date: string) => [...occupancyKeys.all, 'dashboard', date] as const,
  governance: () => [...occupancyKeys.all, 'governance'] as const,
}

/**
 * Hook para buscar dados do dashboard de ocupação
 * - Refetch automático a cada 30 segundos (operação em tempo real)
 * - Stale time de 10 segundos para dados sempre atualizados
 */
export function useOccupancyDashboard(date: string) {
  return useQuery({
    queryKey: occupancyKeys.dashboard(date),
    queryFn: () => getOccupancyDashboard(date),
    staleTime: 10 * 1000, // 10 segundos
    refetchInterval: 30 * 1000, // Refetch a cada 30s
    refetchOnWindowFocus: true, // Atualizar ao focar janela
  })
}

/**
 * Hook para buscar status de governança
 * - Refetch mais frequente para equipe de limpeza
 */
export function useGovernanceStatus() {
  return useQuery({
    queryKey: occupancyKeys.governance(),
    queryFn: getGovernanceStatus,
    staleTime: 5 * 1000, // 5 segundos
    refetchInterval: 15 * 1000, // Refetch a cada 15s
  })
}

/**
 * Hook para atualizar status do quarto
 * - Optimistic update para feedback instantâneo
 */
export function useUpdateRoomStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRoomStatus,
    onSuccess: () => {
      // Invalidar cache de governança e dashboard
      queryClient.invalidateQueries({ queryKey: occupancyKeys.all })
    },
  })
}

/**
 * Hook para realizar check-in
 */
export function useCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CheckInRequest) => performCheckIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: occupancyKeys.all })
    },
  })
}

/**
 * Hook para realizar check-out
 */
export function useCheckOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CheckOutRequest) => performCheckOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: occupancyKeys.all })
    },
  })
}

/**
 * Hook para marcar quarto como limpo
 */
export function useMarkRoomCleaned() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roomId, cleanedBy }: { roomId: string; cleanedBy?: string }) =>
      markRoomAsCleaned(roomId, cleanedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: occupancyKeys.governance() })
    },
  })
}
