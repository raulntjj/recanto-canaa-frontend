'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ChevronDown, Play } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set([headingRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 60,
      })

      // Animate in
      const tl = gsap.timeline({ delay: 0.5 })

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        )

      // Scroll indicator bounce
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      })

      // Parallax on scroll
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background Video/Image */}
      <div className="hero-bg absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <h1
          ref={headingRef}
          className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Sua experiência
          <br />
          <span className="text-accent">exclusiva no campo</span>
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl"
        >
          Descubra o Recanto Canaã, onde a sofisticação encontra a natureza.
          Hospedagem premium, eventos memoráveis e gastronomia autêntica.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/reservas"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:scale-105"
          >
            Fazer Reserva
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>

          <button className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-foreground transition-transform group-hover:scale-110">
              <Play className="h-4 w-4 fill-current" />
            </span>
            Tour Virtual
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs uppercase tracking-widest">Explore</span>
          <ChevronDown className="h-6 w-6" />
        </div>
      </div>
    </section>
  )
}
