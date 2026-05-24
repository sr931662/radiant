import Hero from '../components/Hero/Hero.jsx'
import DonationBar from '../components/DonationBar/DonationBar.jsx'
import ImpactCounter from '../components/ImpactCounter/ImpactCounter.jsx'
import Stories from '../components/Stories/Stories.jsx'
import Sponsorship from '../components/Sponsorship/Sponsorship.jsx'
import Partnership from '../components/Partnership/Partnership.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <DonationBar />
      <ImpactCounter />
      <Stories />
      <Sponsorship />
      <Partnership />
    </>
  )
}
