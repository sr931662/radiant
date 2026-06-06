import { UserCheck, School, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './Sponsorship.module.css'

const TIERS = [
  {
    icon:    <UserCheck size={26} />,
    title:   'Sponsor a Child',
    price:   'From ₹500/month',
    desc:    'Direct linkage between you and a named beneficiary with quarterly progress updates, photos, and letters. The most emotionally resonant model — a lasting personal connection.',
    btnLabel:'Sponsor Now',
    to:      '/donate',
    variant: 'amber',
  },
  {
    icon:    <School size={26} />,
    title:   'Sponsor a Classroom',
    price:   'From ₹50,000/year',
    desc:    "Fund an entire classroom's materials, teacher salary, or infrastructure. Attractive to mid-level donors and small businesses wanting visible, named impact.",
    btnLabel:'Sponsor a Classroom',
    to:      '/donate',
    variant: 'dark',
    featured: true,
  },
  {
    icon:    <Building2 size={26} />,
    title:   'Sponsor a School',
    price:   'From ₹10 Lakhs',
    desc:    'Full school sponsorship with naming rights and a dedicated quarterly impact report. Premium giving for corporates, foundations, and high-net-worth individuals.',
    btnLabel:'Contact Us',
    to:      '/contact',
    variant: 'indigo',
  },
]

export default function Sponsorship() {
  return (
    <section id="sponsor" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className={`section-label ${styles.accentLabel}`}>Sponsorship Tiers</p>
          <h2 className="section-heading">Choose Your Level of Impact</h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0.75rem auto 0' }}>
            From sponsoring one child's education to building a whole school — every tier creates
            lasting, measurable change.
          </p>
        </div>

        <div className={styles.grid}>
          {TIERS.map((tier) => (
            <div
              key={tier.title}
              className={`${styles.card} ${styles['card_' + tier.variant]} ${tier.featured ? styles.featured : ''}`}
            >
              {tier.featured && <span className={styles.featuredBadge}>Most Impactful</span>}
              <div className={`${styles.iconBox} ${styles['icon_' + tier.variant]}`}>
                {tier.icon}
              </div>
          <h3 className={`${styles.tierTitle} ${tier.variant === 'dark' ? styles.titleWhite : ''}`}>
                {tier.title}
              </h3>
              <p className={`${styles.price} ${styles['price_' + tier.variant]}`}>{tier.price}</p>
          <p className={`${styles.desc} ${tier.variant === 'dark' ? styles.descLight : ''}`}>
                {tier.desc}
              </p>
              <Link to={tier.to}>
                <button className={`${styles.btn} ${styles['btn_' + tier.variant]}`}>
                  {tier.btnLabel}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
