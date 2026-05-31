import { FileCheck2, Landmark, PieChart, ScrollText, Shield, UsersRound, Download } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getDownloads, getDownloadUrl } from '../../services/downloadService'
import Spinner from '../ui/Spinner'
import styles from './Transparency.module.css'

const ICON_MAP = {
  annual:      <FileCheck2 size={22} />,
  audit:       <Landmark size={22} />,
  fund:        <PieChart size={22} />,
  legal:       <ScrollText size={22} />,
  child:       <Shield size={22} />,
  governance:  <UsersRound size={22} />,
}

const COLOR_MAP = ['green', 'blue', 'amber', 'indigo', 'rose', 'purple']

const STATIC_DOCS = [
  { color: 'green',  icon: <FileCheck2 size={22} />, title: 'Annual Reports',            desc: 'Comprehensive yearly reports on programs, financials, and impact.' },
  { color: 'blue',   icon: <Landmark size={22} />,   title: 'Audited Financial Statements', desc: 'External audit reports confirming financial integrity.' },
  { color: 'amber',  icon: <PieChart size={22} />,   title: 'Fund Utilisation Reports',  desc: 'Detailed breakdown of how every rupee was spent.' },
  { color: 'indigo', icon: <ScrollText size={22} />, title: 'Legal Registrations',       desc: 'NGO certificate, FCRA approval, 80G certification.' },
  { color: 'rose',   icon: <Shield size={22} />,     title: 'Child Protection Policy',   desc: 'Formal safeguarding policy for all programs.' },
  { color: 'purple', icon: <UsersRound size={22} />, title: 'Governance Documents',      desc: 'Board constitution, conflict of interest policy, whistleblower policy.' },
]

export default function Transparency() {
  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ['downloads'],
    queryFn: getDownloads,
  })

  const docs = downloads.length > 0
    ? downloads.map((d, i) => ({
        color:  COLOR_MAP[i % COLOR_MAP.length],
        icon:   ICON_MAP[Object.keys(ICON_MAP).find((k) => d.title?.toLowerCase().includes(k))] || <FileCheck2 size={22} />,
        title:  d.title,
        desc:   d.description || 'Download this document from Radiant Education Trust.',
        href:   getDownloadUrl(d.id),
        link:   'Download →',
      }))
    : STATIC_DOCS.map((d) => ({ ...d, href: '#', link: 'Coming soon' }))

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

        {isLoading && <Spinner center />}

        {!isLoading && (
          <div className={styles.grid}>
            {docs.map((doc) => (
              <div key={doc.title} className={styles.card}>
                <div className={`${styles.iconBox} ${styles['icon_' + doc.color]}`}>
                  {doc.icon}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{doc.title}</h3>
                  <p className={styles.cardDesc}>{doc.desc}</p>
                  <a
                    href={doc.href}
                    className={styles.cardLink}
                    target={doc.href !== '#' ? '_blank' : undefined}
                    rel="noreferrer"
                  >
                    <Download size={14} /> {doc.link}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
