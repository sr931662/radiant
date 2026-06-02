import { Building, Landmark, GraduationCap, School } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './Partnership.module.css'

const PARTNER_TYPES = [
  {
    icon:  <Building size={22} />,
    color: 'indigo',
    title: 'Corporate CSR',
    desc:  'CSR-compliant education investments with full SDG impact reporting for your annual disclosures.',
  },
  {
    icon:  <Landmark size={22} />,
    color: 'green',
    title: 'Government',
    desc:  'Co-implementation frameworks for state and central government education programs at scale.',
  },
  {
    icon:  <GraduationCap size={22} />,
    color: 'amber',
    title: 'Universities',
    desc:  'Research collaboration, campus volunteering pipelines, and internship programs with top institutions.',
  },
  {
    icon:  <School size={22} />,
    color: 'rose',
    title: 'Schools',
    desc:  'Sister-school programs, curriculum sharing, and resource exchange — multiplying impact at no proportional cost.',
  },
]

export default function Partnership() {
  return (
    <section id="partners" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Partnership Portal</p>
          <h2 className="section-heading">Partner With Us for Scale</h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0.75rem auto 0' }}>
            Government partnerships unlock scale that private funding alone cannot achieve.
            CSR is a significant and growing funding stream in India.
          </p>
        </div>

        <div className={styles.grid}>
          {PARTNER_TYPES.map(({ icon, color, title, desc }) => (
            <div key={title} className={styles.card}>
              <div className={`${styles.iconBox} ${styles['icon_' + color]}`}>{icon}</div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaStrip}>
          <div>
            <h4 className={styles.ctaTitle}>Submit a Partnership Proposal</h4>
            <p className={styles.ctaSub}>
              Structured intake ensures no opportunity is missed. Download our sponsorship deck
              with impact projections and branding options.
            </p>
          </div>
          <div className={styles.ctaBtns}>
            <Link to="/contact">
              <button className={styles.ctaPrimary}>Submit Proposal →</button>
            </Link>
            <Link to="/downloads">
              <button className={styles.ctaOutline}>Download Sponsorship Deck</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
