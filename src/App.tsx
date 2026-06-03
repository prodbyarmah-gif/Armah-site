import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Live from './components/Live'
import Trusted from './components/Trusted'
import Producer from './components/Producer'
import Instagram from './components/Instagram'
import Booking from './components/Booking'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Live />
          <Trusted />
          <Producer />
          <Instagram />
          <Booking />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}

export default App
