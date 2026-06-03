import { HeroSection } from '@/modules/landing/components/hero-section'
import { ExperiencesSection } from '@/modules/landing/components/experiences-section'
import { TestimonialsSection } from '@/modules/landing/components/testimonials-section'
import { FaqSection } from '@/modules/landing/components/faq-section'

export const metadata = {
  title: 'Recanto Canaã | Hotel Fazenda Premium',
  description:
    'Descubra o Recanto Canaã, onde a sofisticação encontra a natureza. Hospedagem premium, eventos memoráveis e gastronomia autêntica.',
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ExperiencesSection />
      <TestimonialsSection />
      <FaqSection />
    </main>
  )
}
