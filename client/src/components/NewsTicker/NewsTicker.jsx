import { Megaphone } from 'lucide-react'
import styles from './NewsTicker.module.css'

export default function NewsTicker() {
  return (
    <div className={styles.ticker}>
      <Megaphone size={16} className={styles.icon} />
      <p className={styles.text}>
        <span className={styles.badge}>New</span>
        Emergency Education Drive — Help us reach 500 more children in flood-affected regions.{' '}
        <a href="#donate-section" className={styles.cta}>Donate Now →</a>
      </p>
    </div>
  )
}
