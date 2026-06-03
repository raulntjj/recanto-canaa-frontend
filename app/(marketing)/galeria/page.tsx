import { GalleryDisplay } from '@/modules/gallery/components/gallery-display'

export const metadata = {
  title: 'Galeria | Chácara Recanto Canaã',
  description: 'Explore as fotos da Chácara Recanto Canaã - Estrutura, natureza, eventos e gastronomia em um cenário único em Caratinga, MG.',
}

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Galeria de Fotos
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Conheça cada cantinho da Chácara Recanto Canaã através das nossas imagens. 
            Um pedacinho do paraíso em Caratinga.
          </p>
        </div>

        <GalleryDisplay />
      </div>
    </main>
  )
}
