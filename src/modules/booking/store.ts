import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RoomAvailability, UpgradeService } from './schemas/booking.schema'

// ========================================
// ZUSTAND STORE - CHECKOUT MULTI-ETAPAS
// ========================================

export type CheckoutStep = 'dates' | 'room' | 'upgrades' | 'guest' | 'payment' | 'confirmation'

interface SelectedUpgrade {
  service: UpgradeService
  quantity: number
}

interface GuestInfo {
  name: string
  email: string
  phone: string
  document: string
}

interface BookingState {
  // Step atual do checkout
  currentStep: CheckoutStep
  
  // Dados de seleção
  checkIn: string | null
  checkOut: string | null
  guests: number
  selectedRoom: RoomAvailability | null
  selectedUpgrades: SelectedUpgrade[]
  guestInfo: GuestInfo | null
  specialRequests: string
  policyAccepted: boolean
  
  // Preços calculados
  subtotal: number
  upgradesTotal: number
  taxes: number
  grandTotal: number

  // Actions
  setDates: (checkIn: string, checkOut: string) => void
  setGuests: (guests: number) => void
  setSelectedRoom: (room: RoomAvailability | null) => void
  addUpgrade: (service: UpgradeService, quantity?: number) => void
  removeUpgrade: (serviceId: string) => void
  updateUpgradeQuantity: (serviceId: string, quantity: number) => void
  setGuestInfo: (info: GuestInfo) => void
  setSpecialRequests: (requests: string) => void
  setPolicyAccepted: (accepted: boolean) => void
  setPricing: (subtotal: number, taxes: number, grandTotal: number) => void
  goToStep: (step: CheckoutStep) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
}

const STEP_ORDER: CheckoutStep[] = ['dates', 'room', 'upgrades', 'guest', 'payment', 'confirmation']

const initialState = {
  currentStep: 'dates' as CheckoutStep,
  checkIn: null,
  checkOut: null,
  guests: 2,
  selectedRoom: null,
  selectedUpgrades: [],
  guestInfo: null,
  specialRequests: '',
  policyAccepted: false,
  subtotal: 0,
  upgradesTotal: 0,
  taxes: 0,
  grandTotal: 0,
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),

      setGuests: (guests) => set({ guests }),

      setSelectedRoom: (room) => set({ selectedRoom: room }),

      addUpgrade: (service, quantity = 1) => {
        const { selectedUpgrades } = get()
        const existing = selectedUpgrades.find((u) => u.service.id === service.id)

        if (existing) {
          set({
            selectedUpgrades: selectedUpgrades.map((u) =>
              u.service.id === service.id
                ? { ...u, quantity: Math.min(u.quantity + quantity, service.maxQuantity) }
                : u
            ),
          })
        } else {
          set({
            selectedUpgrades: [...selectedUpgrades, { service, quantity }],
          })
        }

        // Recalcular total de upgrades
        const newUpgrades = get().selectedUpgrades
        const upgradesTotal = newUpgrades.reduce(
          (acc, u) => acc + u.service.price * u.quantity,
          0
        )
        set({ upgradesTotal })
      },

      removeUpgrade: (serviceId) => {
        set((state) => ({
          selectedUpgrades: state.selectedUpgrades.filter(
            (u) => u.service.id !== serviceId
          ),
        }))
        // Recalcular total
        const upgradesTotal = get().selectedUpgrades.reduce(
          (acc, u) => acc + u.service.price * u.quantity,
          0
        )
        set({ upgradesTotal })
      },

      updateUpgradeQuantity: (serviceId, quantity) => {
        set((state) => ({
          selectedUpgrades: state.selectedUpgrades.map((u) =>
            u.service.id === serviceId
              ? { ...u, quantity: Math.max(0, Math.min(quantity, u.service.maxQuantity)) }
              : u
          ).filter((u) => u.quantity > 0),
        }))
        // Recalcular total
        const upgradesTotal = get().selectedUpgrades.reduce(
          (acc, u) => acc + u.service.price * u.quantity,
          0
        )
        set({ upgradesTotal })
      },

      setGuestInfo: (info) => set({ guestInfo: info }),

      setSpecialRequests: (requests) => set({ specialRequests: requests }),

      setPolicyAccepted: (accepted) => set({ policyAccepted: accepted }),

      setPricing: (subtotal, taxes, grandTotal) =>
        set({ subtotal, taxes, grandTotal }),

      goToStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get()
        const currentIndex = STEP_ORDER.indexOf(currentStep)
        if (currentIndex < STEP_ORDER.length - 1) {
          set({ currentStep: STEP_ORDER[currentIndex + 1] })
        }
      },

      previousStep: () => {
        const { currentStep } = get()
        const currentIndex = STEP_ORDER.indexOf(currentStep)
        if (currentIndex > 0) {
          set({ currentStep: STEP_ORDER[currentIndex - 1] })
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'recanto-booking-store',
      // Não persistir dados sensíveis
      partialize: (state) => ({
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
        currentStep: state.currentStep,
      }),
    }
  )
)
