import { GraduationCap, Phone, Mail, User } from 'lucide-react'
import CourseCatalog from '../components/CourseCatalog/CourseCatalog.jsx'
import PhDGuidance from '../components/PhDGuidance/PhDGuidance.jsx'
import EnquiryForm from '../components/EnquiryForm/EnquiryForm.jsx'
import styles from './Courses.module.css'

export default function Courses() {
  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroBadge}>
            <GraduationCap size={13} /> Admissions Open 2026
          </div>
          <h1 className={styles.heroTitle}>Online UG &amp; PG Courses</h1>
          <p className={styles.heroDesc}>
            100% online learning for working professionals and students. UGC-approved programmes with
            expert guidance at your doorstep. Trusted since 2008.
          </p>

          {/* Feature pills */}
          <div className={styles.heroPills}>
            {[
              '✅ 100% Online',
              '✅ UGC Approved',
              '✅ Flexible Learning',
              '✅ Admission Guidance',
              '✅ Certificate on Completion',
            ].map(item => (
              <span key={item} className={styles.heroPill}>{item}</span>
            ))}
          </div>

          {/* Quick contact */}
          <div className={styles.heroContact}>
            <span className={styles.heroContactItem}><User size={14} /> Mr. Santosh Upadhyay</span>
            <span className={styles.heroContactItem}><Phone size={14} /> 8796278474 · 8512017549</span>
            <span className={styles.heroContactItem}><Mail size={14} /> radianteducationtrust@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Full UG/PG course catalog */}
      <CourseCatalog />

      {/* PhD Guidance */}
      <PhDGuidance />

      {/* Enquiry Form */}
      <EnquiryForm />
    </div>
  )
}
