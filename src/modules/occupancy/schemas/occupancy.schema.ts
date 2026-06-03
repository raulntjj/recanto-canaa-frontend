import { z } from 'zod'

// ========================================
// CONTRATOS DE API - ÉPICO 5: PAINEL DE OCUPAÇÃO
// ========================================

// Enum de status de quartos para governança
export const RoomStatusEnum = z.enum([
  'AVAILABLE',      // Disponível para reserva
  'OCCUPIED',       // Ocupado por hóspede
  'NEEDS_CLEANING', // Necessita limpeza
  'MAINTENANCE',    // Em manutenção
  'BLOCKED',        // Bloqueado (evento exclusivo)
])

export type RoomStatus = z.infer<typeof RoomStatusEnum>

// Schema de Quarto/Chalé
export const RoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(['QUARTO', 'CHALE', 'SUITE']),
  capacity: z.number().int().positive(),
  status: RoomStatusEnum,
  floor: z.number().int().optional(),
  amenities: z.array(z.string()).default([]),
})

export type Room = z.infer<typeof RoomSchema>

// Schema de Hóspede
export const GuestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  document: z.string().optional(), // CPF ou passaporte
})

export type Guest = z.infer<typeof GuestSchema>

// Schema de Reserva (visão painel de ocupação)
export const OccupancyReservationSchema = z.object({
  id: z.string().uuid(),
  room: RoomSchema,
  guest: GuestSchema,
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  status: z.enum(['PENDING', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW']),
  totalGuests: z.number().int().positive(),
  notes: z.string().optional(),
  specialRequests: z.array(z.string()).default([]),
})

export type OccupancyReservation = z.infer<typeof OccupancyReservationSchema>

// ========================================
// RESPONSES DA API
// ========================================

// Response do Dashboard de Ocupação (RF16)
export const OccupancyDashboardResponseSchema = z.object({
  date: z.string(), // Data de referência (YYYY-MM-DD)
  summary: z.object({
    totalRooms: z.number().int(),
    occupiedRooms: z.number().int(),
    availableRooms: z.number().int(),
    needsCleaningRooms: z.number().int(),
    maintenanceRooms: z.number().int(),
    blockedRooms: z.number().int(),
    occupancyRate: z.number().min(0).max(100), // Percentual
  }),
  checkIns: z.array(OccupancyReservationSchema),
  checkOuts: z.array(OccupancyReservationSchema),
  currentGuests: z.array(OccupancyReservationSchema),
})

export type OccupancyDashboardResponse = z.infer<typeof OccupancyDashboardResponseSchema>

// Response de Status de Governança (RF17)
export const GovernanceStatusResponseSchema = z.object({
  rooms: z.array(
    RoomSchema.extend({
      lastCleaned: z.string().datetime().optional(),
      assignedTo: z.string().optional(), // Nome da camareira
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    })
  ),
  stats: z.object({
    pendingCleaning: z.number().int(),
    inProgress: z.number().int(),
    completed: z.number().int(),
  }),
})

export type GovernanceStatusResponse = z.infer<typeof GovernanceStatusResponseSchema>

// ========================================
// REQUESTS PARA API (MUTATIONS)
// ========================================

// Atualizar status do quarto
export const UpdateRoomStatusRequestSchema = z.object({
  roomId: z.string().uuid(),
  status: RoomStatusEnum,
  notes: z.string().optional(),
})

export type UpdateRoomStatusRequest = z.infer<typeof UpdateRoomStatusRequestSchema>

// Registrar check-in
export const CheckInRequestSchema = z.object({
  reservationId: z.string().uuid(),
  actualCheckInTime: z.string().datetime().optional(),
  notes: z.string().optional(),
})

export type CheckInRequest = z.infer<typeof CheckInRequestSchema>

// Registrar check-out
export const CheckOutRequestSchema = z.object({
  reservationId: z.string().uuid(),
  actualCheckOutTime: z.string().datetime().optional(),
  notes: z.string().optional(),
  roomCondition: z.enum(['GOOD', 'NEEDS_CLEANING', 'NEEDS_MAINTENANCE']).default('NEEDS_CLEANING'),
})

export type CheckOutRequest = z.infer<typeof CheckOutRequestSchema>
