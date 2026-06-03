'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, FileText, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const guestFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  document: z.string().min(11, 'CPF inválido').max(14),
  specialRequests: z.string().optional(),
})

export type GuestFormData = z.infer<typeof guestFormSchema>

interface GuestFormProps {
  initialData?: Partial<GuestFormData>
  onSubmit: (data: GuestFormData) => void
  isSubmitting?: boolean
}

export function GuestForm({ initialData, onSubmit, isSubmitting }: GuestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      document: initialData?.document || '',
      specialRequests: initialData?.specialRequests || '',
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          Dados do Hóspede Principal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Nome Completo
            </Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              {...register('name')}
              className={cn(errors.name && 'border-destructive')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={cn(errors.email && 'border-destructive')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Telefone / WhatsApp
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              {...register('phone')}
              className={cn(errors.phone && 'border-destructive')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Document */}
          <div className="space-y-2">
            <Label htmlFor="document" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              CPF
            </Label>
            <Input
              id="document"
              placeholder="000.000.000-00"
              {...register('document')}
              className={cn(errors.document && 'border-destructive')}
            />
            {errors.document && (
              <p className="text-sm text-destructive">{errors.document.message}</p>
            )}
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Pedidos Especiais (opcional)
            </Label>
            <Textarea
              id="specialRequests"
              placeholder="Alergias, preferências de quarto, horário de chegada, etc."
              rows={3}
              {...register('specialRequests')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Continuar para Pagamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
