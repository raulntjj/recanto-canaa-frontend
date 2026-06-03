import { z } from 'zod'

// ========================================
// CONTRATOS DE API - ÉPICO 2: MOTOR DE RESERVAS
// ========================================

// Tipos de acomodação
export const AccommodationTypeEnum = z.enum(['QUARTO', 'CHALE', 'SUITE'])
export type AccommodationType = z.infer<typeof AccommodationTypeEnum>

// Schema de disponibilidade de quarto
export const RoomAvailabilitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: AccommodationTypeEnum,
  capacity: z.number().int().positive(),
  description: z.string(),
  amenities: z.array(z.string()),
  images: z.array(z.string().url()),
  basePrice: z.number().positive(), // Preço base diária
  available: z.boolean(),
  availableDates: z.array(z.string()).optional(), // Datas disponíveis no período
})

export type RoomAvailability = z.infer<typeof RoomAvailabilitySchema>

// Schema de precificação dinâmica (RF07)
export const PricingSchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string(), // YYYY-MM-DD
  checkOut: z.string(), // YYYY-MM-DD
  nights: z.number().int().positive(),
  breakdown: z.array(z.object({
    date: z.string(),
    dayType: z.enum(['WEEKDAY', 'WEEKEND', 'HOLIDAY', 'HIGH_SEASON']),
    price: z.number().positive(),
  })),
  subtotal: z.number().positive(),
  taxes: z.number().min(0),
  total: z.number().positive(),
})

export type Pricing = z.infer<typeof PricingSchema>

// Schema de upgrade/serviço adicional (RF08)
export const UpgradeServiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  category: z.enum([
    'BREAKFAST',     // Café da manhã premium
    'DECORATION',    // Decoração romântica
    'EXPERIENCE',    // Experiências (passeio a cavalo, etc.)
    'AMENITY',       // Amenidades (kit lenha, etc.)
    'TRANSFER',      // Transfer
  ]),
  image: z.string().url().optional(),
  maxQuantity: z.number().int().positive().default(1),
})

export type UpgradeService = z.infer<typeof UpgradeServiceSchema>

// Schema de políticas de cancelamento (RF09)
export const CancellationPolicySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  rules: z.array(z.object({
    daysBeforeCheckIn: z.number().int().min(0),
    refundPercentage: z.number().min(0).max(100),
  })),
  termsUrl: z.string().url().optional(),
})

export type CancellationPolicy = z.infer<typeof CancellationPolicySchema>

// ========================================
// REQUESTS PARA API
// ========================================

// Request de busca de disponibilidade (RF06)
export const SearchAvailabilityRequestSchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  guests: z.number().int().positive().max(20),
  roomType: AccommodationTypeEnum.optional(),
})

export type SearchAvailabilityRequest = z.infer<typeof SearchAvailabilityRequestSchema>

// Request de criação de reserva
export const CreateBookingRequestSchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().positive(),
  guestInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    document: z.string().min(11), // CPF
  }),
  upgrades: z.array(z.object({
    serviceId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).default([]),
  specialRequests: z.string().optional(),
  policyAccepted: z.literal(true, {
    errorMap: () => ({ message: 'É obrigatório aceitar as políticas de cancelamento' }),
  }),
})

export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>

// ========================================
// RESPONSES DA API
// ========================================

// Response de busca de disponibilidade
export const SearchAvailabilityResponseSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  nights: z.number().int().positive(),
  rooms: z.array(RoomAvailabilitySchema),
  blockedDates: z.array(z.string()).default([]), // Datas bloqueadas por eventos
})

export type SearchAvailabilityResponse = z.infer<typeof SearchAvailabilityResponseSchema>

// Response de cálculo de preço
export const CalculatePriceResponseSchema = z.object({
  pricing: PricingSchema,
  upgrades: z.array(z.object({
    service: UpgradeServiceSchema,
    quantity: z.number().int().positive(),
    total: z.number().positive(),
  })),
  grandTotal: z.number().positive(),
  policy: CancellationPolicySchema,
})

export type CalculatePriceResponse = z.infer<typeof CalculatePriceResponseSchema>

// Response de criação de reserva
export const BookingConfirmationSchema = z.object({
  id: z.string().uuid(),
  confirmationCode: z.string(), // Ex: REC-2024-001234
  status: z.enum(['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED']),
  room: RoomAvailabilitySchema,
  checkIn: z.string(),
  checkOut: z.string(),
  guest: z.object({
    name: z.string(),
    email: z.string(),
  }),
  pricing: PricingSchema,
  upgrades: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    total: z.number(),
  })),
  grandTotal: z.number(),
  paymentUrl: z.string().url().optional(), // URL para gateway de pagamento
  createdAt: z.string().datetime(),
})

export type BookingConfirmation = z.infer<typeof BookingConfirmationSchema>

// ========================================
// CALENDARIO - DISPONIBILIDADE
// ========================================

// Response do calendário de disponibilidade
export const CalendarAvailabilityResponseSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int(),
  days: z.array(z.object({
    date: z.string(), // YYYY-MM-DD
    status: z.enum(['AVAILABLE', 'PARTIAL', 'FULL', 'BLOCKED']),
    minPrice: z.number().positive().optional(),
    availableRooms: z.number().int().min(0),
    isHighSeason: z.boolean().default(false),
    isHoliday: z.boolean().default(false),
  })),
})

export type CalendarAvailabilityResponse = z.infer<typeof CalendarAvailabilityResponseSchema>
