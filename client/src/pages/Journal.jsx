import styles from './Journal.module.css'

export default function Journal() {
  return (
    <div>
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Academic Publication</p>
          <h1 className={styles.heroTitle}>Journal</h1>
        </div>
      </div>

      <div className="container">
        <div className={styles.card}>
          <div className={styles.regRow}>
            <span className={styles.regLabel}>REG. NO.</span>
            <span className={styles.regValue}>DELENG/2010/32112</span>
          </div>

          <h2 className={styles.journalName}>
            INTERNATIONAL JOURNAL OF RETAILING AND MARKETING
          </h2>

          <div className={styles.issnRow}>
            <span className={styles.issnLabel}>ISSN:</span>
            <span className={styles.issnValue}>0976-318X</span>
          </div>

          <div className={styles.publishedBy}>
            <p className={styles.publishedLabel}>Published by:-</p>
            <p className={styles.publisher}>RADIANT INSTITUTE OF MANAGEMENT &amp; TECHNOLOGY</p>
            <p className={styles.publisherUnit}>UNIT OF RADIANT EDUCATION TRUST</p>
          </div>
        </div>
      </div>
    </div>
  )
}
