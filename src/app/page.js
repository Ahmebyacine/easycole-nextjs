import CoursesGrid from "@/components/home/course-grid"
import CTAFooter from "@/components/home/CTA-footer"
import Footer from "@/components/home/footer"
import { Header } from "@/components/home/header"
import HeroSection from "@/components/home/hero-section"
import StatsSection from "@/components/home/state-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100" dir="ltr">
      <Header />
      <HeroSection />
      <StatsSection />
      <CoursesGrid />
      <CTAFooter />
      <Footer/>
    </main>
  )
}
