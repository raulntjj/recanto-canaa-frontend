'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos por padrão
            staleTime: 5 * 60 * 1000,
            // Manter dados em cache por 30 minutos
            gcTime: 30 * 60 * 1000,
            // Retry automático em caso de falha
            retry: 2,
            // Não refetch ao focar a janela (para dashboards operacionais)
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
