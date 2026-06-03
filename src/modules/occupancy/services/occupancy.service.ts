import api from '@/core/api/axios'
import type {
  OccupancyDashboardResponse,
  GovernanceStatusResponse,
  UpdateRoomStatusRequest,
  CheckInRequest,
  CheckOutRequest,
} from '../schemas/occupancy.schema'
import {
  OccupancyDashboardResponseSchema,
  GovernanceStatusResponseSchema,
} from '../schemas/occupancy.schema'

// ========================================
// SERVIÇOS HTTP - ÉPICO 5: PAINEL DE OCUPAÇÃO
// ========================================

/**
 * Busca dados do dashboard de ocupação para uma data específica
 * RF16: Dashboard de Fluxo - check-ins/check-outs do dia
 */
export async function getOccupancyDashboard(date: string): Promise<OccupancyDashboardResponse> {
  const response = await api.get(`/occupancy/dashboard`, {
    params: { date },
  })
  return OccupancyDashboardResponseSchema.parse(response.data)
}

/**
 * Busca status de governança de todos os quartos
 * RF17: Status de Governança - estado de cada quarto para limpeza
 */
export async function getGovernanceStatus(): Promise<GovernanceStatusResponse> {
  const response = await api.get(`/occupancy/governance`)
  return GovernanceStatusResponseSchema.parse(response.data)
}

/**
 * Atualiza o status de um quarto específico
 */
export async function updateRoomStatus(data: UpdateRoomStatusRequest): Promise<void> {
  await api.patch(`/rooms/${data.roomId}/status`, {
    status: data.status,
    notes: data.notes,
  })
}

/**
 * Registra o check-in de uma reserva
 */
export async function performCheckIn(data: CheckInRequest): Promise<void> {
  await api.post(`/reservations/${data.reservationId}/check-in`, {
    actualCheckInTime: data.actualCheckInTime,
    notes: data.notes,
  })
}

/**
 * Registra o check-out de uma reserva
 */
export async function performCheckOut(data: CheckOutRequest): Promise<void> {
  await api.post(`/reservations/${data.reservationId}/check-out`, {
    actualCheckOutTime: data.actualCheckOutTime,
    notes: data.notes,
    roomCondition: data.roomCondition,
  })
}

/**
 * Marca quarto como limpo (ação da governança)
 */
export async function markRoomAsCleaned(roomId: string, cleanedBy?: string): Promise<void> {
  await api.post(`/rooms/${roomId}/cleaned`, { cleanedBy })
}
