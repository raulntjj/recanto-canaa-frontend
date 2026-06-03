'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Hospedagem', href: '/reservas' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Almoço de Sexta', href: '/almoco' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Contato', href: '/contato' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/95 py-3 shadow-lg backdrop-blur-md'
          : 'bg-transparent py-5'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
              isScrolled ? 'bg-primary' : 'bg-white/20 backdrop-blur-sm'
            )}
          >
            <span
              className={cn(
                'font-serif text-lg font-bold',
                isScrolled ? 'text-primary-foreground' : 'text-white'
              )}
            >
              RC
            </span>
          </div>
          <span
            className={cn(
              'hidden font-serif text-xl font-semibold sm:block',
              isScrolled ? 'text-foreground' : 'text-white'
            )}
          >
            Recanto Canaã
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                isScrolled ? 'text-foreground' : 'text-white/90'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+5511999999999"
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors',
              isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
            )}
          >
            <Phone className="h-4 w-4" />
            (11) 99999-9999
          </a>
          <Link
            href="/reservas"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90"
          >
            Reservar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg lg:hidden',
            isScrolled ? 'text-foreground' : 'text-white'
          )}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute left-0 right-0 top-full bg-card shadow-lg transition-all duration-300 lg:hidden',
          isMobileMenuOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-4 opacity-0'
        )}
      >
        <nav className="flex flex-col p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="border-b border-border py-4 text-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground"
          >
            Fazer Reserva
          </Link>
        </nav>
      </div>
    </header>
  )
}
