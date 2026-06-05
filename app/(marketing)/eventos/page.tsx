import { EventWidget } from '@/modules/events/components/event-widget'

export const metadata = {
  title: 'Eventos | Chácara Recanto Canaã',
  description: 'Realize seu evento na Chácara Recanto Canaã - Casamentos, aniversários, eventos corporativos e confraternizações em um cenário único.',
}

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Eventos Exclusivos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Feche a chácara inteira para seu evento e crie momentos inesquecíveis
          </p>
        </div>

        <EventWidget />
      </div>
    </main>
  )
}
