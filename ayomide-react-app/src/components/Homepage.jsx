import React from 'react'
import Navbar from './Navbar'
import HeroSection from './home/HeroSection'
import OurTrainingSection from './home/OurTrainingSection'
import Footer from './Footer'

const Homepage = () => {
  return (
    <>
        <Navbar />
        <HeroSection />
        <OurTrainingSection />
        <Footer />
    </>
  )
}

export default Homepage