import { CheckCircle2 } from 'lucide-react'
import styles from './Volunteer.module.css'

const CARDS = [
  {
    title:    'Volunteer',
    sub:      'On-ground or remote — your skills matter.',
    items:    [
      'Participate in local education drives',
      'Skill-based pro-bono volunteering (tech, legal, finance)',
      'Remote opportunities for international volunteers',
      'Official volunteering certificate issued',
    ],
    btnLabel: 'Register as Volunteer',
    variant:  'outline',
    iconColor: 'var(--clr-primary)',
  },
  {
    title:    'Campus Ambassador',
    sub:      'University students driving change on campus.',
    items:    [
      'Represent the NGO at your university',
      'Fundraise and recruit fellow volunteers',
      'Internship & fellowship opportunities',
      'Mentorship from senior NGO leadership',
    ],
    btnLabel: 'Apply as Ambassador',
    variant:  'dark',
    iconColor: 'var(--clr-accent)',
    featured: true,
    badge:    'Most Popular',
  },
  {
    title:    'Open Positions',
    sub:      'Paid roles for passionate professionals.',
    items:    [
      'Program Manager — Field Operations',
      'Donor Relations & Fundraising Lead',
      'Content & Communications Manager',
    ],
    btnLabel: 'View All Openings',
    variant:  'indigo',
    iconColor: 'var(--clr-primary)',
  },
]

export default function Volunteer() {
  return (
    <section id="volunteer" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Volunteer & Careers</p>
          <h2 className="section-heading">Give Time. Give Talent. Give Back.</h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0.75rem auto 0' }}>
            Volunteers are our most engaged supporter segment. Whether you're on-ground or remote,
            there's a role for every skill set.
          </p>
        </div>

        <div className={styles.grid}>
          {CARDS.map((card) => (
            <div
              key={card.title}
              className={`${styles.card} ${styles['card_' + card.variant]} ${card.featured ? styles.featured : ''}`}
            >
              {card.badge && <span className={styles.badge}>{card.badge}</span>}
              <h3 className={`${styles.title} ${card.variant === 'dark' ? styles.titleWhite : ''}`}>
                {card.title}
              </h3>
              <p className={`${styles.sub} ${card.variant === 'dark' ? styles.subLight : ''}`}>
                {card.sub}
              </p>
              <ul className={styles.list}>
                {card.items.map((item) => (
                  <li key={item} className={styles.listItem}>
                    <CheckCircle2 size={18} color={card.iconColor} style={{ flexShrink: 0 }} />
                    <span className={card.variant === 'dark' ? '' : styles.itemText}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className={`${styles.btn} ${styles['btn_' + card.variant]}`}>
                {card.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
