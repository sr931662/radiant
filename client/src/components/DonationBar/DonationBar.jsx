import { useNavigate } from 'react-router-dom'
import styles from './DonationBar.module.css'

export default function DonationBar() {
  const navigate = useNavigate()

  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.message}>
          🎯 <strong>₹500</strong> educates a child for one month &nbsp;·&nbsp;{' '}
          <strong>₹2,000</strong> buys a school kit for 5 children &nbsp;·&nbsp;{' '}
          <strong>₹10,000</strong> funds a teacher for a month
        </p>
        <button className={styles.btn} onClick={() => navigate('/donate')}>
          Donate Now →
        </button>
      </div>
    </div>
  )
}
