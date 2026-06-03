import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getCookie } from '@/lib/cookies'

// Instância configurada do Axios para API REST externa
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requisição - Injeção automática de JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta - Tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // Token expirado - redirecionar para login
    if (error.response?.status === 401 && originalRequest) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }

    // Erro de servidor
    if (error.response?.status && error.response.status >= 500) {
      console.error('[API Error] Erro interno do servidor:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
