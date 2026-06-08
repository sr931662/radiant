import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import styles from './AdmissionStrip.module.css'

const QUICK_LINKS = [
  { label: 'UG Programs', to: '/programs' },
  { label: 'PG Programs', to: '/programs' },
  { label: 'PhD Guidance', to: '/courses' },
  { label: 'FDP / Workshops', to: '/fdp' },
  { label: 'Membership', to: '/membership' },
]

export default function AdmissionStrip() {
  return (
    <div className={styles.strip}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.badge}>
          <GraduationCap size={12} />
          Admissions Open 2026
        </div>
        <span className={styles.sep} />
        <nav className={styles.links}>
          {QUICK_LINKS.map(({ label, to }) => (
            <Link key={label} to={to} className={styles.link}>{label}</Link>
          ))}
        </nav>
        <Link to="/contact" className={styles.cta}>Apply Now →</Link>
      </div>
    </div>
  )
}
