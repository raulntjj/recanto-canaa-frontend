import { Header } from '@/modules/landing/components/header'
import { Footer } from '@/modules/landing/components/footer'
import { PageFadeWrapper } from '@/core/providers/splash-provider'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header variant="solid" />
      <div className="pt-24">
        <PageFadeWrapper>{children}</PageFadeWrapper>
      </div>
      <Footer />
    </>
  )
}
