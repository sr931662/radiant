import { Outlet } from 'react-router-dom'
import TopBar from '../components/TopBar/TopBar.jsx'
import NewsTicker from '../components/NewsTicker/NewsTicker.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import AdmissionStrip from '../components/AdmissionStrip/AdmissionStrip.jsx'
import Footer from '../components/Footer/Footer.jsx'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop.jsx'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <TopBar />
      <NewsTicker />
      <Navbar />
      <AdmissionStrip />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
