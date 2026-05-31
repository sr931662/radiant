import styles from './Spinner.module.css'

export default function Spinner({ size = 'md', center = false }) {
  return (
    <div className={center ? styles.center : ''}>
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  )
}
