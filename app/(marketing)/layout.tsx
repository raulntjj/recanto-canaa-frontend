import { Header } from '@/modules/landing/components/header'
import { Footer } from '@/modules/landing/components/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
