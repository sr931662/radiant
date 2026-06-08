import styles from './AdmissionStrip.module.css'

export default function AdmissionStrip() {
  return (
    <div className={styles.strip}>
      <p className={styles.text}>
        <span className={styles.symbol}>✦</span>
        In memory of Jagnath Rai and Balu Ram Jalan
        <span className={styles.symbol}>✦</span>
      </p>
    </div>
  )
}
