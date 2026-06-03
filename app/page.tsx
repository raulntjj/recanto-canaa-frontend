import { HeroSection } from '@/modules/landing/components/hero-section'
import { ExperiencesSection } from '@/modules/landing/components/experiences-section'
import { TestimonialsSection } from '@/modules/landing/components/testimonials-section'
import { FaqSection } from '@/modules/landing/components/faq-section'
import { Header } from '@/modules/landing/components/header'
import { Footer } from '@/modules/landing/components/footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ExperiencesSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
