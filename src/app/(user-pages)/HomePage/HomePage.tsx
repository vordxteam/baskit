import React from 'react'
import HeroSection from './HeroSection'
import Marquee from './Marquee'
import GridImages from './GridImages'
import SignatureBuquet from './SignatureBuquet'
import HowToCreate from './HowToCreate'
import BaskitCollection from './BaskitCollection'
import FeatureBanner from './FeatureBanner'
import USP from './USP'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <Marquee />
      <GridImages />
      <SignatureBuquet />
      <HowToCreate />
      <BaskitCollection />
      <FeatureBanner />
      <USP />
    </div>
  )
}

export default HomePage