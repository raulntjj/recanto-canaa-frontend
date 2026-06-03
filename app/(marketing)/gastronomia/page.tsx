import { MenuDisplay } from '@/modules/gastronomy/components/menu-display'

export const metadata = {
  title: 'Gastronomia | Chácara Recanto Canaã',
  description: 'Descubra os sabores autênticos da culinária mineira na Chácara Recanto Canaã. Cardápio variado com pratos tradicionais e contemporâneos.',
}

export default function GastronomiaPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Gastronomia
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Sabores autênticos da culinária mineira e regional. Ingredientes frescos, 
            receitas tradicionais e muito carinho em cada prato.
          </p>
        </div>

        <MenuDisplay />
      </div>
    </main>
  )
}
