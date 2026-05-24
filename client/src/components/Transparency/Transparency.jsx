import { FileCheck2, Landmark, PieChart, ScrollText, Shield, UsersRound } from 'lucide-react'
import styles from './Transparency.module.css'

const DOCS = [
  {
    icon:    <FileCheck2 size={22} />,
    color:   'green',
    title:   'Annual Reports',
    desc:    'Comprehensive yearly reports on programs, financials, and impact. Required by institutional donors.',
    link:    'Download FY 2023–24 →',
  },
  {
    icon:    <Landmark size={22} />,
    color:   'blue',
    title:   'Audited Financial Statements',
    desc:    'External audit reports confirming financial integrity — the gold standard of NGO credibility.',
    link:    'View Audit Reports →',
  },
  {
    icon:    <PieChart size={22} />,
    color:   'amber',
    title:   'Fund Utilisation Reports',
    desc:    'Detailed breakdown of how every rupee was spent. Answers: "Does my money actually reach children?"',
    link:    'View Fund Reports →',
  },
  {
    icon:    <ScrollText size={22} />,
    color:   'indigo',
    title:   'Legal Registrations',
    desc:    'NGO certificate, FCRA approval, 80G certification — required by donors for tax benefits and due diligence.',
    link:    'View Certificates →',
  },
  {
    icon:    <Shield size={22} />,
    color:   'rose',
    title:   'Child Protection Policy',
    desc:    'Formal safeguarding policy for all programs. Non-negotiable for any organisation working with minors.',
    link:    'Read Policy →',
  },
  {
    icon:    <UsersRound size={22} />,
    color:   'purple',
    title:   'Governance Documents',
    desc:    'Board constitution, conflict of interest policy, whistleblower policy — audited by institutional funders.',
    link:    'View Governance →',
  },
]

export default function Transparency() {
  return (
    <section id="transparency" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Transparency Centre</p>
          <h2 className="section-heading">Serious Donors Check This First</h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0.75rem auto 0' }}>
            Every document listed here removes a barrier to giving. Transparency is not optional
            — it is a fundraising strategy. We have nothing to hide.
          </p>
        </div>

        <div className={styles.grid}>
          {DOCS.map((doc) => (
            <div key={doc.title} className={styles.card}>
              <div className={`${styles.iconBox} ${styles['icon_' + doc.color]}`}>
                {doc.icon}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{doc.title}</h3>
                <p className={styles.cardDesc}>{doc.desc}</p>
                <a href="#" className={styles.cardLink}>{doc.link}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
