import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'

const footerLinks = {
  experiencias: [
    { label: 'Hospedagem', href: '/reservas' },
    { label: 'Eventos', href: '/eventos' },
    { label: 'Gastronomia', href: '/gastronomia' },
    { label: 'Day Use', href: '#' },
  ],
  institucional: [
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Galeria', href: '/galeria' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabalhe Conosco', href: '/carreiras' },
  ],
  suporte: [
    { label: 'Perguntas Frequentes', href: '/#faq' },
    { label: 'Política de Cancelamento', href: '/politicas' },
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Privacidade', href: '/privacidade' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <span className="font-serif text-xl font-bold text-accent-foreground">
                  RC
                </span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Chácara Recanto Canaã</h3>
                <p className="text-sm text-background/70">Caratinga - MG</p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-background/80 leading-relaxed">
              Descubra o equilíbrio perfeito entre o conforto premium e a
              tranquilidade do campo. Seu refúgio está a poucos quilômetros da
              cidade.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="https://maps.google.com/maps?q=-19.70927678102187,-42.18805709820538"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-background/70 hover:text-background"
              >
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Córrego Ferrugem, Distrito de Santa Efigênia, Caratinga - MG</span>
              </a>
              <a
                href="tel:+5533999749636"
                className="flex items-center gap-3 text-sm text-background/70 hover:text-background"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(33) 99974-9636</span>
              </a>
              <a
                href="mailto:contato@chacararecantocanaa.com.br"
                className="flex items-center gap-3 text-sm text-background/70 hover:text-background"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contato@chacararecantocanaa.com.br</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background hover:bg-accent hover:text-accent-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background hover:bg-accent hover:text-accent-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold">Experiências</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.experiencias.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Institucional</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.institucional.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Suporte</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-background/60 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Chácara Recanto Canaã. Todos os direitos reservados.</p>
          <p>
            Desenvolvido com carinho para experiências inesquecíveis.
          </p>
        </div>
      </div>
    </footer>
  )
}
