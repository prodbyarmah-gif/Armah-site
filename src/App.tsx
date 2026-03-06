import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Live from './components/Live'
import Trusted from './components/Trusted'
import Producer from './components/Producer'
import Instagram from './components/Instagram'
import Booking from './components/Booking'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Hero />
        <Live />
        <Trusted />
        <Producer />
        <Instagram />
        <Booking />
      </main>
      <Footer />
    </div>
  )
}

export default App
