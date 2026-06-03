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

        {/* Features */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">🏡</span>
            </div>
            <h3 className="font-semibold text-foreground">Espaço Exclusivo</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Toda a chácara reservada apenas para você e seus convidados
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">🌳</span>
            </div>
            <h3 className="font-semibold text-foreground">Cenário Natural</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Áreas verdes, lago e ambientes perfeitos para fotos memoráveis
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">🛏️</span>
            </div>
            <h3 className="font-semibold text-foreground">Hospedagem Integrada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Opção de pernoite para você e seus convidados
            </p>
          </div>
        </div>

        <EventWidget />
      </div>
    </main>
  )
}
