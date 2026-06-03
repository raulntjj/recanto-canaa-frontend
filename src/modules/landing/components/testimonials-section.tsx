'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    id: '1',
    name: 'Mariana Santos',
    role: 'Noiva - Casamento Jun/2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content:
      'O casamento dos nossos sonhos se tornou realidade no Recanto Canaã. A equipe cuidou de cada detalhe com tanto carinho que pudemos aproveitar cada momento sem preocupações. Nossos convidados ainda comentam sobre o lugar!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Roberto Almeida',
    role: 'Hóspede Frequente',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    content:
      'Já perdi as contas de quantas vezes vim ao Recanto. É nosso refúgio de fim de semana. A comida é excepcional, os chalés são impecáveis e o atendimento é sempre personalizado.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Fernanda Costa',
    role: 'Evento Corporativo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    content:
      'Organizamos nosso retiro de equipe aqui e foi um sucesso. A estrutura para eventos é completa, o espaço é inspirador e a equipe facilitou tudo. Já estamos planejando o próximo!',
    rating: 5,
  },
  {
    id: '4',
    name: 'Carlos Eduardo',
    role: 'Almoço de Sexta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    content:
      'A Sexta da Costela virou programa obrigatório. A carne derrete na boca, o ambiente é acolhedor e sempre encontro amigos por lá. Experiência gastronômica de outro nível.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonials-title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary py-20 lg:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        {/* Section Header */}
        <div className="testimonials-title mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
            Depoimentos
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
            O que dizem nossos hóspedes
          </h2>
        </div>

        {/* Testimonial Card */}
        <div
          className="relative rounded-2xl bg-white/10 p-8 backdrop-blur-sm lg:p-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Quote Icon */}
          <Quote className="absolute top-6 left-6 h-12 w-12 text-primary-foreground/20" />

          {/* Content */}
          <div className="relative text-center">
            {/* Avatar */}
            <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full ring-4 ring-primary-foreground/30">
              <img
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Rating */}
            <div className="mb-4 flex justify-center gap-1">
              {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-accent text-accent"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg leading-relaxed text-primary-foreground/90 lg:text-xl">
              &ldquo;{currentTestimonial.content}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="mt-6">
              <p className="font-semibold text-primary-foreground">
                {currentTestimonial.name}
              </p>
              <p className="text-sm text-primary-foreground/70">
                {currentTestimonial.role}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary-foreground'
                      : 'w-2 bg-primary-foreground/40'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
