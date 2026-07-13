import Header from '../components/Header'
import Hero from '../components/Hero'
import LogoTicker from '../components/LogoTicker'
import Features from '../components/Features'
import FileManager from '../components/FileManager'
import HowItWorks from '../components/HowItWorks'
import Formats from '../components/Formats'
import Security from '../components/Security'
import Performance from '../components/Performance'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <div className="divider" />
      <Features />
      <div className="divider" />
      <FileManager />
      <div className="divider" />
      <HowItWorks />
      <div className="divider" />
      <Formats />
      <div className="divider" />
      <Security />
      <div className="divider" />
      <Performance />
      <div className="divider" />
      <FAQ />
      <Footer />
    </>
  )
}
