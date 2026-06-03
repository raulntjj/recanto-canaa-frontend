'use client'

import { create } from 'zustand'

export type EventStep = 'info' | 'details' | 'contact' | 'confirmation'

interface EventFormData {
  eventType: string
  eventDate: string | null
  endDate: string | null
  guestCount: number
  hasOvernight: boolean
  overnightGuests: number
  services: string[]
  name: string
  email: string
  phone: string
  message: string
}

interface EventStore {
  currentStep: EventStep
  formData: EventFormData
  setCurrentStep: (step: EventStep) => void
  updateFormData: (data: Partial<EventFormData>) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
}

const initialFormData: EventFormData = {
  eventType: '',
  eventDate: null,
  endDate: null,
  guestCount: 50,
  hasOvernight: false,
  overnightGuests: 0,
  services: [],
  name: '',
  email: '',
  phone: '',
  message: '',
}

const steps: EventStep[] = ['info', 'details', 'contact', 'confirmation']

export const useEventStore = create<EventStore>((set, get) => ({
  currentStep: 'info',
  formData: initialFormData,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  
  nextStep: () => {
    const currentIndex = steps.indexOf(get().currentStep)
    if (currentIndex < steps.length - 1) {
      set({ currentStep: steps[currentIndex + 1] })
    }
  },
  
  previousStep: () => {
    const currentIndex = steps.indexOf(get().currentStep)
    if (currentIndex > 0) {
      set({ currentStep: steps[currentIndex - 1] })
    }
  },
  
  reset: () =>
    set({
      currentStep: 'info',
      formData: initialFormData,
    }),
}))
