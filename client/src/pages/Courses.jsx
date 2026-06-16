import { FileText } from 'lucide-react'
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
            <FileText size={13} /> Academic Journal &amp; Research Guidance
          </div>
          <h1 className={styles.heroTitle}>Research &amp; Academic Journal</h1>
          <p className={styles.heroDesc}>
            Expert PhD guidance, research support, and academic resources from Radiant Education Trust —
            empowering scholars since 2008.
          </p>

          <div className={styles.heroPills}>
            {[
              '📖 PhD Admission Guidance',
              '🔬 Research Proposal Support',
              '🎓 Thesis & Synopsis Help',
              '📚 Publication Guidance',
              '🌐 Online & Hybrid Programs',
            ].map(item => (
              <span key={item} className={styles.heroPill}>{item}</span>
            ))}
          </div>

          <div className={styles.heroContact}>
            <span className={styles.heroContactItem}><FileText size={14} /> Registration No. 106 &nbsp;|&nbsp; Dated: 08-01-2008</span>
          </div>
        </div>
      </div>

      <PhDGuidance />
      <EnquiryForm />
    </div>
  )
}
