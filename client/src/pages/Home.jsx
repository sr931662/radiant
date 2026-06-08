import Hero from '../components/Hero/Hero.jsx'
import DonationBar from '../components/DonationBar/DonationBar.jsx'
import ImpactCounter from '../components/ImpactCounter/ImpactCounter.jsx'
import ThematicAreas from '../components/ThematicAreas/ThematicAreas.jsx'
import AdmissionsBanner from '../components/AdmissionsBanner/AdmissionsBanner.jsx'
import Programs from '../components/Programs/Programs.jsx'
import EnquiryForm from '../components/EnquiryForm/EnquiryForm.jsx'
import Stories from '../components/Stories/Stories.jsx'
import MembershipCTA from '../components/MembershipCTA/MembershipCTA.jsx'
import RegistrationInfo from '../components/RegistrationInfo/RegistrationInfo.jsx'
import Sponsorship from '../components/Sponsorship/Sponsorship.jsx'
import Partnership from '../components/Partnership/Partnership.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <DonationBar />
      <ImpactCounter />
      <ThematicAreas />
      <AdmissionsBanner />
      <Programs />
      <EnquiryForm />
      <Stories />
      <MembershipCTA />
      <RegistrationInfo />
      <Sponsorship />
      <Partnership />
    </>
  )
}
