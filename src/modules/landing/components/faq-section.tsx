'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, ChevronUp } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    question: 'Qual o horário de check-in e check-out?',
    answer:
      'O check-in pode ser realizado a partir das 14h e o check-out deve ser feito até as 12h. Caso precise de horários diferenciados, entre em contato conosco para verificarmos disponibilidade (sujeito a cobrança adicional).',
  },
  {
    question: 'Aceitam animais de estimação?',
    answer:
      'Sim! Somos pet-friendly. Aceitamos animais de pequeno e médio porte mediante aviso prévio e taxa adicional. Por favor, informe ao fazer sua reserva para prepararmos tudo para receber seu amiguinho.',
  },
  {
    question: 'Qual a capacidade máxima para eventos?',
    answer:
      'Para eventos exclusivos, temos capacidade para até 200 convidados. Oferecemos pacotes personalizados que incluem hospedagem para os noivos e familiares, decoração, buffet e muito mais.',
  },
  {
    question: 'O almoço de sexta-feira precisa de reserva?',
    answer:
      'Sim, as vagas são limitadas e as reservas são obrigatórias. Recomendamos reservar com pelo menos 3 dias de antecedência, especialmente para cardápios especiais como a Sexta da Costela.',
  },
  {
    question: 'Qual a política de cancelamento?',
    answer:
      'Cancelamentos com mais de 7 dias de antecedência têm reembolso integral. Entre 7 e 3 dias, o reembolso é de 50%. Com menos de 3 dias, não há reembolso. Para eventos, políticas específicas se aplicam.',
  },
  {
    question: 'Há atividades inclusas na hospedagem?',
    answer:
      'Sim! Todas as hospedagens incluem acesso à piscina, trilhas ecológicas, redário, lago para pesca (pesque e solte), playground e áreas de convivência. Algumas atividades extras como passeio a cavalo têm custo adicional.',
  },
]

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      gsap.from('.faq-item', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.faq-list',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={sectionRef} className="bg-muted/50 py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4">
        {/* Section Header */}
        <div className="faq-title mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-accent">
            Dúvidas Frequentes
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Perguntas e Respostas
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tudo que você precisa saber antes da sua visita
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq-list space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="pr-4 font-medium text-foreground">
                  {faq.question}
                </span>
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Não encontrou o que procurava?
          </p>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 font-medium text-primary hover:underline"
          >
            Fale conosco pelo WhatsApp
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}
