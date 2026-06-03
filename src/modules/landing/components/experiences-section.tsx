'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { BedDouble, PartyPopper, UtensilsCrossed, Calendar } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    id: 'hospedagem',
    title: 'Hospedagem Premium',
    description:
      'Chalés e suítes exclusivas com todo conforto em meio à natureza. Acordar com o canto dos pássaros é apenas o começo.',
    icon: BedDouble,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    cta: 'Reservar Estadia',
    href: '/reservas',
  },
  {
    id: 'eventos',
    title: 'Eventos Exclusivos',
    description:
      'Casamentos, aniversários e eventos corporativos em um cenário único. Feche o Recanto inteiro para sua celebração.',
    icon: PartyPopper,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    cta: 'Solicitar Orçamento',
    href: '/eventos',
  },
  {
    id: 'almoco',
    title: 'Almoço de Sexta',
    description:
      'Toda sexta-feira, um cardápio temático especial. Costela de chão, comida mineira e muito mais. Vagas limitadas.',
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    cta: 'Ver Cardápio',
    href: '/almoco',
  },
  {
    id: 'dayuse',
    title: 'Day Use',
    description:
      'Passe o dia aproveitando toda a estrutura do Recanto Canaã. Piscina, trilhas, lago e muito mais.',
    icon: Calendar,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    cta: 'Em Breve',
    href: '#',
    disabled: true,
  },
]

export function ExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.experiences-title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      // Animate cards staggered
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: index * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-background py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="experiences-title mb-16 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Nossas Experiências
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Momentos que se tornam
            <br />
            <span className="text-primary">memórias eternas</span>
          </h2>
        </div>

        {/* Experience Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {experiences.map((exp, index) => {
            const Icon = exp.icon
            return (
              <div
                key={exp.id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
                className="group relative overflow-hidden rounded-2xl bg-card shadow-lg transition-all hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/90 text-primary-foreground backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    {exp.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.disabled ? (
                    <span className="mt-6 inline-block rounded-full bg-muted px-6 py-3 text-sm font-medium text-muted-foreground">
                      {exp.cta}
                    </span>
                  ) : (
                    <Link
                      href={exp.href}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
                    >
                      {exp.cta}
                      <span>&rarr;</span>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
