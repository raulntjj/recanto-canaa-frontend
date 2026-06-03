import { BookingWidget } from '@/modules/booking/components/booking-widget'

export const metadata = {
  title: 'Reservas | Recanto Canaã',
  description: 'Faça sua reserva no Recanto Canaã - Hotel Fazenda Premium',
}

export default function ReservasPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Reserve sua Estadia
          </h1>
          <p className="mt-2 text-muted-foreground">
            Escolha as datas e acomodação para uma experiência inesquecível
          </p>
        </div>

        <BookingWidget />
      </div>
    </main>
  )
}
