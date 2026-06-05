'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { Trees } from 'lucide-react'

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(true)
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // 1. Initial Load animation (runs only once on mount)
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsActive(false)
      }
    })

    // Logo fade & scale in
    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.9, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )

    // Progress bar loading
    tl.fromTo(progressBarRef.current,
      { width: '0%' },
      { width: '100%', duration: 0.8, ease: 'power1.inOut' },
      '-=0.1'
    )

    // Fade out overlay
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut'
    })
  }, [])

  return (
    <>
      {children}
      {isActive && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1a472a] text-white"
        >
          <div ref={logoRef} className="flex flex-col items-center text-center px-4">
            <div className="mb-4 rounded-full bg-white/10 p-4 border border-white/20 shadow-inner">
              <Trees className="h-12 w-12 text-[#d4af37]" />
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-[0.2em] uppercase text-white md:text-4xl">
              Recanto Canaã
            </h1>
            <p className="mt-2 text-xs font-light tracking-[0.4em] uppercase text-white/60">
              Onde a natureza encontra o conforto
            </p>

            <div className="mt-8 h-[2px] w-48 overflow-hidden rounded-full bg-white/20">
              <div
                ref={progressBarRef}
                className="h-full bg-[#d4af37]"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function PageFadeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 10, duration: 100 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', clearProps: 'y' }
      )
    }
  }, [pathname])

  return (
    <div ref={ref} className="opacity-0">
      {children}
    </div>
  )
}
