import { Shield, FileText, Building2, Globe2 } from 'lucide-react'
import styles from './RegistrationInfo.module.css'

const REG_ITEMS = [
  { label: 'Registration No.', value: '106', note: 'Date: 08-01-2008' },
  { label: 'CSR', value: 'SRN-AC3607265', note: '23-05-2026' },
  { label: 'DARPAN ID', value: 'DL/2025/0845871', note: 'NGO Darpan Portal' },
  { label: 'MSME', value: 'UDYAM-UP-28-0220207', note: 'Udyam Registration' },
  { label: 'E-ANUDAAN NGO ID', value: 'DL/00056445', note: 'E-Anudaan Portal' },
  { label: 'ISO Certificate', value: 'DRAFT/2026/U', note: 'ISO 9001:2015' },
  { label: 'Form 12(A)', value: 'AADTR8447DE2026101', note: 'DI Number' },
  { label: 'Form 80(G)', value: 'AADTR8447DE2026102', note: 'DI Number' },
]

const ADDRESSES = [
  { type: 'Registered Address', detail: '215 Prabhavi Apartment, Sector-10, Dwarka, Delhi' },
  { type: 'Correspondence Address', detail: 'A-141, Sector-48, Noida – 201301' },
]

export default function RegistrationInfo() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionLabel}>
            <Shield size={14} />
            Official Credentials
          </div>
          <h2 className={styles.heading}>Registration &amp; Certifications</h2>
          <p className={styles.sub}>
            Radiant Education Trust is a fully registered and certified non-profit organisation
            operating under the laws of India since 2008.
          </p>
        </div>

        <div className={styles.grid}>
          {REG_ITEMS.map(({ label, value, note }) => (
            <div key={label} className={styles.card}>
              <div className={styles.cardIcon}>
                <FileText size={15} color="#7c3aed" />
              </div>
              <div>
                <p className={styles.cardLabel}>{label}</p>
                <p className={styles.cardValue}>{value}</p>
                {note && <p className={styles.cardNote}>{note}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.addressRow}>
          {ADDRESSES.map(({ type, detail }) => (
            <div key={type} className={styles.addressCard}>
              <Building2 size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p className={styles.addressType}>{type}</p>
                <p className={styles.addressDetail}>{detail}</p>
              </div>
            </div>
          ))}
          <div className={styles.addressCard}>
            <Globe2 size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p className={styles.addressType}>Contact</p>
              <p className={styles.addressDetail}>8796278474 · 8512017549</p>
              <p className={styles.addressDetail}>radianteducationtrust@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
