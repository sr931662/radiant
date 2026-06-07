import Hero from '../components/Hero/Hero.jsx'
import DonationBar from '../components/DonationBar/DonationBar.jsx'
import ImpactCounter from '../components/ImpactCounter/ImpactCounter.jsx'
import AdmissionsBanner from '../components/AdmissionsBanner/AdmissionsBanner.jsx'
import FeaturedCourses from '../components/FeaturedCourses/FeaturedCourses.jsx'
import CourseCatalog from '../components/CourseCatalog/CourseCatalog.jsx'
import EnquiryForm from '../components/EnquiryForm/EnquiryForm.jsx'
import Stories from '../components/Stories/Stories.jsx'
import RegistrationInfo from '../components/RegistrationInfo/RegistrationInfo.jsx'
import Sponsorship from '../components/Sponsorship/Sponsorship.jsx'
import Partnership from '../components/Partnership/Partnership.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <DonationBar />
      <ImpactCounter />
      <AdmissionsBanner />
      <FeaturedCourses />
      <CourseCatalog />
      <EnquiryForm />
      <Stories />
      <RegistrationInfo />
      <Sponsorship />
      <Partnership />
    </>
  )
}
