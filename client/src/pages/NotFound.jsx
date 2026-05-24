import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.sub}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className={styles.homeBtn}>
        <Home size={16} /> Back to Home
      </Link>
    </div>
  )
}
