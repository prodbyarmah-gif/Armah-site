import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Live from './components/Live'
import Trusted from './components/Trusted'
import Producer from './components/Producer'
import Mixes from './components/Mixes'
import Booking from './components/Booking'
import Footer from './components/Footer'
import { useI18n } from './i18n'
import { photographyPreview } from './data/photographyPreview'
import ResponsiveImage from './components/ResponsiveImage'

function App() {
  const { t } = useI18n();
  return (
    <MotionConfig reducedMotion="user">
      <div className="theme-page min-h-screen">
        <a href="#main-content" className="skip-link">{t('accessibility.skip')}</a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <Live />
          <Mixes />
          <Trusted />
          <Producer />
          <div className="bio-booking-world relative">
            <div aria-hidden="true" className="bio-booking-media sticky top-0 -mb-[100svh] h-[100svh] w-full">
              <ResponsiveImage image={photographyPreview.ph08} sizes="100vw" alt="" loading="lazy" className="h-full w-full object-cover object-[48%_center]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.26)_0%,rgba(0,0,0,0.05)_48%,rgba(0,0,0,0.22)_100%)]" />
            </div>
            <div className="relative z-10">
              <About />
              <Booking />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}

export default App
