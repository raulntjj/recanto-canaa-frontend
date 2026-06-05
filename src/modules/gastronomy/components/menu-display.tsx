'use client'

import { useState, useEffect, useRef } from 'react'
import { format, addDays } from 'date-fns'
import gsap from 'gsap'
import { ptBR } from 'date-fns/locale'
import {
  UtensilsCrossed,
  Clock,
  Users,
  Phone,
  ChevronLeft,
  ChevronRight,
  Flame,
  Leaf,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock data - virá do backend
const menuCategories = [
  { id: 'almoco', label: 'Almoço', icon: UtensilsCrossed },
  { id: 'jantar', label: 'Jantar', icon: Flame },
  { id: 'cafe', label: 'Café da Manhã', icon: Star },
  { id: 'lanches', label: 'Lanches', icon: Leaf },
]

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  tags: string[]
  isSpecialty?: boolean
}

const menuItems: Record<string, MenuItem[]> = {
  almoco: [
    {
      id: '1',
      name: 'Costela de Chão',
      description: 'Costela bovina assada lentamente por 12 horas na brasa, servida com mandioca cozida e vinagrete.',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      tags: ['Especialidade', 'Para 2 pessoas'],
      isSpecialty: true,
    },
    {
      id: '2',
      name: 'Frango Caipira',
      description: 'Frango caipira ao molho pardo com angu cremoso e couve mineira refogada.',
      price: 65.90,
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
      tags: ['Tradicional'],
    },
    {
      id: '3',
      name: 'Tutu à Mineira Completo',
      description: 'Feijão tropeiro, tutu de feijão, lombo assado, couve, torresmo, linguiça e ovo frito.',
      price: 75.90,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      tags: ['Tradicional', 'Completo'],
    },
    {
      id: '4',
      name: 'Peixe na Telha',
      description: 'Filé de tilápia grelhado na telha com legumes, arroz branco e salada.',
      price: 59.90,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
      tags: ['Leve'],
    },
  ],
  jantar: [
    {
      id: '5',
      name: 'Risoto de Cogumelos',
      description: 'Risoto cremoso com mix de cogumelos frescos, parmesão e ervas finas.',
      price: 68.90,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
      tags: ['Vegetariano'],
    },
    {
      id: '6',
      name: 'Filé ao Molho Madeira',
      description: 'Filé mignon grelhado ao ponto, acompanhado de molho madeira, batatas rústicas e legumes.',
      price: 95.90,
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
      tags: ['Premium'],
      isSpecialty: true,
    },
    {
      id: '7',
      name: 'Massa Artesanal',
      description: 'Fettuccine fresco ao molho de tomates frescos com manjericão e muçarela de búfala.',
      price: 55.90,
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400',
      tags: ['Vegetariano'],
    },
  ],
  cafe: [
    {
      id: '8',
      name: 'Café Colonial Completo',
      description: 'Mesa farta com pães caseiros, bolos, queijos, frios, frutas, geleias, café e sucos.',
      price: 55.00,
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
      tags: ['Completo', 'Por pessoa'],
      isSpecialty: true,
    },
    {
      id: '9',
      name: 'Café Simples',
      description: 'Pão de queijo, bolo do dia, café coado e suco de laranja natural.',
      price: 28.00,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      tags: ['Por pessoa'],
    },
  ],
  lanches: [
    {
      id: '10',
      name: 'Pão de Queijo Artesanal',
      description: 'Porção com 10 unidades de pão de queijo mineiro tradicional.',
      price: 18.90,
      image: 'https://images.unsplash.com/photo-1598733995890-f92a8f7b4f8f?w=400',
      tags: ['Porção'],
    },
    {
      id: '11',
      name: 'Bolo de Milho com Café',
      description: 'Fatia generosa de bolo de milho cremoso com café coado.',
      price: 15.90,
      image: 'https://images.unsplash.com/photo-1486427944344-d2052a72e3b7?w=400',
      tags: ['Combo'],
    },
  ],
}

// Mock de cardápio do dia
const getDailyMenu = (date: Date) => {
  const dayOfWeek = date.getDay()
  const menus: Record<number, { title: string; items: string[]; price: number }> = {
    0: { title: 'Almoço de Domingo', items: ['Leitão à pururuca', 'Arroz, tutu, couve', 'Torresmo crocante'], price: 85.90 },
    1: { title: 'Segunda Fit', items: ['Grelhados variados', 'Saladas frescas', 'Arroz integral'], price: 45.90 },
    2: { title: 'Terça da Massa', items: ['Lasanha bolonhesa', 'Salada verde', 'Pão de alho'], price: 49.90 },
    3: { title: 'Quarta Verde', items: ['Opções vegetarianas', 'Legumes grelhados', 'Risotos'], price: 42.90 },
    4: { title: 'Quinta da Carne', items: ['Picanha na brasa', 'Farofa especial', 'Vinagrete'], price: 69.90 },
    5: { title: 'Sexta da Costela', items: ['Costela de chão', 'Mandioca cozida', 'Couve refogada'], price: 79.90 },
    6: { title: 'Sábado Especial', items: ['Feijoada completa', 'Arroz, couve, farofa', 'Laranja e torresmo'], price: 65.90 },
  }
  return menus[dayOfWeek]
}

export function MenuDisplay() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeCategory, setActiveCategory] = useState('almoco')
  const dailyCardRef = useRef<HTMLDivElement>(null)
  const tabsContentRef = useRef<HTMLDivElement>(null)

  const dailyMenu = getDailyMenu(selectedDate)

  const lastDirectionRef = useRef<'next' | 'prev'>('next')

  const navigateDate = (direction: 'prev' | 'next') => {
    lastDirectionRef.current = direction
    const exitX = direction === 'next' ? -35 : 35

    if (dailyCardRef.current) {
      gsap.to(dailyCardRef.current, {
        opacity: 0,
        x: exitX,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          setSelectedDate((prev) => direction === 'next' ? addDays(prev, 1) : addDays(prev, -1))
        }
      })
    } else {
      setSelectedDate((prev) => direction === 'next' ? addDays(prev, 1) : addDays(prev, -1))
    }
  }

  // Daily card fade-in on date change with horizontal slide pagination feel
  useEffect(() => {
    if (dailyCardRef.current) {
      const enterX = lastDirectionRef.current === 'next' ? 35 : -35
      gsap.fromTo(dailyCardRef.current,
        { opacity: 0, x: enterX },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', clearProps: 'x' }
      )
    }
  }, [selectedDate])

  const handleCategoryChange = (newCategory: string) => {
    if (tabsContentRef.current) {
      gsap.to(tabsContentRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          setActiveCategory(newCategory)
        }
      })
    } else {
      setActiveCategory(newCategory)
    }
  }

  // Tabs content fade-in on category change
  useEffect(() => {
    if (tabsContentRef.current) {
      gsap.fromTo(tabsContentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      )
    }
  }, [activeCategory])

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Daily Menu Section */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Cardápio do Dia
          </h2>
          <p className="mt-1 text-muted-foreground">
            Confira o prato especial do dia selecionado
          </p>
        </div>

        {/* Date Selector */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-[200px] text-center">
            <p className="font-serif text-lg font-semibold capitalize">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Daily Special Card */}
        <Card ref={dailyCardRef} className="mx-auto max-w-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  Prato do Dia
                </Badge>
                <h3 className="font-serif text-2xl font-bold">{dailyMenu.title}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">A partir de</p>
                <p className="font-serif text-3xl font-bold">
                  R$ {dailyMenu.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {dailyMenu.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  11h às 15h
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Reservas recomendadas
                </span>
              </div>
              <Button asChild>
                <a href="tel:+5533999749636">
                  <Phone className="mr-2 h-4 w-4" />
                  Reservar
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Full Menu Section */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Cardápio Completo
          </h2>
          <p className="mt-1 text-muted-foreground">
            Explore todas as delícias da nossa cozinha
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="mx-auto mb-8 flex w-full max-w-md justify-center">
            {menuCategories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div ref={tabsContentRef}>
            {menuCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid gap-6 md:grid-cols-2">
                  {menuItems[category.id as keyof typeof menuItems]?.map((item) => (
                    <Card
                      key={item.id}
                      className={cn(
                        'overflow-hidden transition-shadow hover:shadow-lg',
                        item.isSpecialty && 'ring-2 ring-primary/20'
                      )}
                    >
                      <div className="flex">
                        <div className="relative h-32 w-32 flex-shrink-0 sm:h-40 sm:w-40">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                          {item.isSpecialty && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary">
                                <Star className="mr-1 h-3 w-3" />
                                Destaque
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <h3 className="font-serif text-lg font-semibold text-foreground">
                              {item.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {item.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 font-serif text-xl font-bold text-primary">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </p>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </section>

      {/* Info Section */}
      <section className="rounded-2xl bg-muted/50 p-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="font-serif text-xl font-bold text-foreground">
            Informações Importantes
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <Clock className="mx-auto h-8 w-8 text-primary" />
              <h4 className="mt-2 font-semibold">Horários</h4>
              <p className="text-sm text-muted-foreground">
                Almoço: 11h às 15h
                <br />
                Jantar: 19h às 22h (sob reserva)
              </p>
            </div>
            <div>
              <Users className="mx-auto h-8 w-8 text-primary" />
              <h4 className="mt-2 font-semibold">Reservas</h4>
              <p className="text-sm text-muted-foreground">
                Recomendamos reserva
                <br />
                para grupos acima de 6 pessoas
              </p>
            </div>
            <div>
              <Phone className="mx-auto h-8 w-8 text-primary" />
              <h4 className="mt-2 font-semibold">Contato</h4>
              <p className="text-sm text-muted-foreground">
                <a href="tel:+5533999749636" className="hover:text-primary">
                  (33) 99974-9636
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
