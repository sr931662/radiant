import { Phone, Mail, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './TopBar.module.css'

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        <a href="tel:+918796278474" className={styles.link}>
          <Phone size={14} />
          8796278474 / 8512017549
        </a>
        <a href="mailto:radianteducationtrust@gmail.com" className={`${styles.link} ${styles.hideMobile}`}>
          <Mail size={14} />
          radianteducationtrust@gmail.com
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
