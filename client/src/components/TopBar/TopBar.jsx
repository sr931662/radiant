import { Phone, Mail, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './TopBar.module.css'

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        <a href="tel:+911800000000" className={styles.link}>
          <Phone size={14} />
          1800-000-0000 (Toll Free)
        </a>
        <a href="mailto:connect@radianteducation.org" className={`${styles.link} ${styles.hideMobile}`}>
          <Mail size={14} />
          connect@radianteducation.org
        </a>
      </div>
      <div className={styles.right}>
        <Link to="/transparency" className={`${styles.link} ${styles.hideMobile}`}>
          Transparency Centre
        </Link>
        <Link to="/admin" className={styles.adminLink}>
          <LayoutDashboard size={14} />
          Admin Portal
        </Link>
      </div>
    </div>
  )
}
