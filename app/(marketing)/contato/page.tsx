import { ContactDisplay } from '@/modules/contact/components/contact-display'

export const metadata = {
  title: 'Contato | Chácara Recanto Canaã',
  description: 'Entre em contato com a Chácara Recanto Canaã em Caratinga, MG. Telefone, WhatsApp, e-mail e como chegar.',
}

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Contato
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Estamos à disposição para tirar suas dúvidas, fazer reservas ou 
            receber sugestões. Entre em contato conosco!
          </p>
        </div>

        <ContactDisplay />
      </div>
    </main>
  )
}
