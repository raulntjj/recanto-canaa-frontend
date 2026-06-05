'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Dynamic import do mapa para evitar SSR issues com Leaflet
const ContactMap = dynamic(() => import('./contact-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-xl bg-muted">
      <p className="text-muted-foreground">Carregando mapa...</p>
    </div>
  ),
})

// Mock data - virá do backend
const contactInfo = {
  name: 'Chácara Recanto Canaã',
  address: 'Córrego Ferrugem, próximo ao Distrito de Santa Efigênia',
  city: 'Caratinga - MG',
  cep: '35300-000',
  phone: '(33) 99974-9636',
  email: 'contato@chacararecantocanaa.com.br',
  coordinates: {
    lat: -19.708910,
    lng: -42.188500,
  },
  hours: {
    weekdays: '08:00 às 18:00',
    weekends: '08:00 às 20:00',
    restaurant: 'Almoço: 11h às 15h',
  },
  social: {
    instagram: 'https://instagram.com/chacararecantocanaa',
    facebook: 'https://facebook.com/chacararecantocanaa',
    whatsapp: 'https://wa.me/5533999749636',
  },
}

const subjects = [
  { value: 'reservas', label: 'Reservas de Hospedagem' },
  { value: 'eventos', label: 'Eventos e Celebrações' },
  { value: 'gastronomia', label: 'Gastronomia e Restaurante' },
  { value: 'parcerias', label: 'Parcerias Comerciais' },
  { value: 'outros', label: 'Outros Assuntos' },
]

export function ContactDisplay() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Formulário de contato:', formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-12">
        <Card className="mx-auto max-w-lg text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Mensagem Enviada!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Recebemos sua mensagem e retornaremos em breve. Obrigado pelo contato!
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setIsSubmitted(false)
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
              }}
            >
              Enviar nova mensagem
            </Button>
          </CardContent>
        </Card>

        {/* Map Section */}
        <section>
          <h2 className="mb-6 text-center font-serif text-2xl font-bold text-foreground">
            Como Chegar
          </h2>
          <div className="overflow-hidden rounded-xl">
            <ContactMap
              lat={contactInfo.coordinates.lat}
              lng={contactInfo.coordinates.lng}
              name={contactInfo.name}
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="transition-all hover:border-primary/50 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium text-foreground">{contactInfo.name}</p>
              <p className="mt-1 text-muted-foreground">{contactInfo.address}</p>
              <p className="text-muted-foreground">
                {contactInfo.city}, {contactInfo.cep}
              </p>
              <a
                href={`https://maps.google.com/maps?q=${contactInfo.coordinates.lat},${contactInfo.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                Ver no Google Maps <ArrowRight className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>

          <Card className="transition-all hover:border-primary/50 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Seg. a Sex:</span>{' '}
                {contactInfo.hours.weekdays}
              </p>
              <p>
                <span className="font-medium text-foreground">Sáb e Dom:</span>{' '}
                {contactInfo.hours.weekends}
              </p>
              <p>
                <span className="font-medium text-foreground">Restaurante:</span>{' '}
                {contactInfo.hours.restaurant}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:border-primary/50 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Mail className="h-5 w-5 text-primary" />
                E-mail
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-2 text-muted-foreground">Envie-nos um e-mail:</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="font-medium text-primary hover:underline"
              >
                {contactInfo.email}
              </a>
            </CardContent>
          </Card>

          <Card className="transition-all hover:border-primary/50 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <a
                href={`tel:+5533999749636`}
                className="flex items-center gap-2 font-medium hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" /> {contactInfo.phone}
              </a>
              <a
                href={contactInfo.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-1.5 font-medium text-white transition-colors hover:bg-[#20bd5a]"
              >
                <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <section>
        <h2 className="mb-6 text-center font-serif text-2xl font-bold text-foreground">
          Como Chegar
        </h2>
        <div className="overflow-hidden rounded-xl">
          <ContactMap
            lat={contactInfo.coordinates.lat}
            lng={contactInfo.coordinates.lng}
            name={contactInfo.name}
          />
        </div>
        <div className="mt-4 text-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${contactInfo.coordinates.lat},${contactInfo.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            <MapPin className="h-5 w-5" />
            Traçar Rota no Google Maps
          </a>
        </div>
      </section>
    </div>
  )
}
