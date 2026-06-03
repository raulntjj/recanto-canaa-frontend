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
    lat: -19.70927678102187,
    lng: -42.18805709820538,
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
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{contactInfo.name}</p>
              <p className="mt-1 text-muted-foreground">{contactInfo.address}</p>
              <p className="text-muted-foreground">
                {contactInfo.city}, {contactInfo.cep}
              </p>
              <a
                href={`https://maps.google.com/maps?q=${contactInfo.coordinates.lat},${contactInfo.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Ver no Google Maps
                <span>&rarr;</span>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Phone className="h-5 w-5 text-primary" />
                Telefone e WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={`tel:+5533999749636`}
                className="flex items-center gap-3 text-lg font-medium hover:text-primary"
              >
                {contactInfo.phone}
              </a>
              <a
                href={contactInfo.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                Chamar no WhatsApp
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Mail className="h-5 w-5 text-primary" />
                E-mail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-primary hover:underline"
              >
                {contactInfo.email}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Clock className="h-5 w-5 text-primary" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Segunda a Sexta:</span>{' '}
                {contactInfo.hours.weekdays}
              </p>
              <p>
                <span className="font-medium text-foreground">Sábados e Domingos:</span>{' '}
                {contactInfo.hours.weekends}
              </p>
              <p>
                <span className="font-medium text-foreground">Restaurante:</span>{' '}
                {contactInfo.hours.restaurant}
              </p>
            </CardContent>
          </Card>

          {/* Social Links */}
          <div className="flex gap-3">
            <a
              href={contactInfo.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-transform hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href={contactInfo.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href={contactInfo.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white transition-transform hover:scale-110"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Envie uma Mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Como podemos ajudar?"
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>
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
