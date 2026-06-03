'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock data - virá do backend
const galleryCategories = [
  { id: 'todos', label: 'Todos' },
  { id: 'estrutura', label: 'Estrutura' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'gastronomia', label: 'Gastronomia' },
]

const galleryImages = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    alt: 'Vista geral da chácara',
    category: 'estrutura',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
    alt: 'Chalé à beira do lago',
    category: 'estrutura',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800',
    alt: 'Área verde e jardins',
    category: 'natureza',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    alt: 'Lago ao pôr do sol',
    category: 'natureza',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    alt: 'Decoração de casamento',
    category: 'eventos',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    alt: 'Festa ao ar livre',
    category: 'eventos',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    alt: 'Costela de chão',
    category: 'gastronomia',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
    alt: 'Café colonial',
    category: 'gastronomia',
  },
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    alt: 'Quarto aconchegante',
    category: 'estrutura',
  },
  {
    id: '10',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    alt: 'Trilha na mata',
    category: 'natureza',
  },
  {
    id: '11',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    alt: 'Cerimônia de casamento',
    category: 'eventos',
  },
  {
    id: '12',
    src: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800',
    alt: 'Risoto especial',
    category: 'gastronomia',
  },
]

interface GalleryGridProps {
  images: typeof galleryImages
  onImageClick: (index: number) => void
}

function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageClick(index)}
          className="group relative aspect-[4/3] overflow-hidden rounded-xl"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-10 w-10 text-white" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-sm font-medium text-white">{image.alt}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

interface LightboxProps {
  images: typeof galleryImages
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const currentImage = images[currentIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={onPrev}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        onClick={onNext}
        disabled={currentIndex === images.length - 1}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Image */}
      <div className="flex max-h-[80vh] max-w-[90vw] flex-col items-center">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-h-[75vh] max-w-full object-contain"
        />
        <p className="mt-4 text-center text-white">{currentImage.alt}</p>
        <p className="mt-1 text-sm text-white/60">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  )
}

export function GalleryDisplay() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages =
    activeCategory === 'todos'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goToPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const goToNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {galleryCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category.id)}
            className="rounded-full"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <GalleryGrid images={filteredImages} onImageClick={openLightbox} />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </div>
  )
}
