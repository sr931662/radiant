import { Telescope, Target, ShieldCheck, CheckCircle2, Award, ExternalLink, Download, BadgeCheck, Calendar } from 'lucide-react'
import styles from './About.module.css'

const CERTIFICATIONS = [
  {
    id: 'iso',
    badge: 'ISO 9001:2015',
    title: 'Quality Management Systems',
    body: 'UNIQ International Certifications Limited',
    certNo: '923504/2026/U',
    issued: '28 May 2026',
    expiry: '27 May 2029',
    scope: 'Providing Education and Community Development Services',
    pdf: '/certificates/iso-9001-2015.pdf',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    id: '80g',
    badge: '80G',
    title: 'Tax Exemption Certificate',
    body: 'Income Tax Department, Government of India',
    certNo: null,
    issued: null,
    expiry: null,
    scope: 'Donations eligible for 80G tax deduction under the Income Tax Act',
    pdf: null,
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    id: 'fcra',
    badge: 'FCRA',
    title: 'Foreign Contribution Regulated',
    body: 'Ministry of Home Affairs, Government of India',
    certNo: null,
    issued: null,
    expiry: null,
    scope: 'Authorised to receive foreign contributions for educational purposes',
    pdf: null,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
  },
]

const VALUES = [
  'Radical transparency in finances',
  'Child-first safeguarding policy',
  'Inclusive & gender-equal education',
  'UN SDG 4 alignment',
]

const SDGS = [
  { num: 'SDG 4', bg: 'var(--clr-red-600)' },
  { num: 'SDG 5', bg: 'var(--clr-orange-500)' },
  { num: 'SDG 10', bg: 'var(--clr-pink-600)' },
  { num: 'SDG 17', bg: 'var(--clr-blue-600)' },
]

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">About The Trust</p>
          <h2 className="section-heading">
            Turning Visitors into Believers,<br />Believers into Advocates
          </h2>
          <p className={`section-sub ${styles.subCenter}`}>
            Radiant Education Trust is a world-class digital and on-ground platform dedicated
            to educating children, inspiring donors, and empowering communities across the globe.
            Every rupee raised, every volunteer hour given, and every partnership forged is
            guided by one north star — every child deserves a classroom.
          </p>
        </div>

        {/* Cards */}
        <div className={styles.cards}>
          {/* Vision */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <Telescope size={26} color="var(--clr-primary)" />
            </div>
            <h3 className={styles.cardTitle}>Our Vision</h3>
            <p className={styles.cardText}>
              A world where no child is denied education due to poverty, geography, gender,
              or displacement. We envision communities transformed through learning — locally
              rooted, globally connected.
            </p>
          </div>

          {/* Mission (highlighted) */}
          <div className={`${styles.card} ${styles.cardHighlight}`}>
            <div className={styles.iconBoxLight}>
              <Target size={26} color="var(--clr-white)" />
            </div>
            <h3 className={`${styles.cardTitle} ${styles.titleWhite}`}>Our Mission</h3>
            <p className={styles.cardTextLight}>
              To build credibility, maximise donor impact, scale globally, and empower our
              team with a platform that measures everything. Data-driven decisions over
              guesswork. Transparency over opacity. Children over statistics.
            </p>
          </div>

          {/* Core Values */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <ShieldCheck size={26} color="var(--clr-primary)" />
            </div>
            <h3 className={styles.cardTitle}>Core Values</h3>
            <ul className={styles.valuesList}>
              {VALUES.map((v) => (
                <li key={v} className={styles.valueItem}>
                  <CheckCircle2 size={18} color="var(--clr-green-500)" style={{ flexShrink: 0 }} />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accreditations & Certifications */}
        <div className={styles.certsSection}>
          <div className={styles.certsHeader}>
            <div className={styles.certsSectionLabel}>
              <Award size={15} />
              Accreditations &amp; Certifications
            </div>
            <h3 className={styles.certsSectionTitle}>
              Independently Verified, Officially Recognised
            </h3>
            <p className={styles.certsSectionSub}>
              Our quality systems, tax compliance and international standards are all independently certified.
            </p>
          </div>

          <div className={styles.certCards}>
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className={styles.certCard}
                style={{ borderColor: cert.border, '--cert-color': cert.color, '--cert-bg': cert.bg }}
              >
                <div className={styles.certCardTop}>
                  <span className={styles.certBadge} style={{ background: cert.bg, color: cert.color, borderColor: cert.border }}>
                    <BadgeCheck size={13} /> {cert.badge}
                  </span>
                  {cert.pdf && (
                    <a
                      href={cert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.certViewBtn}
                      style={{ color: cert.color }}
                      title="View Certificate"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <h4 className={styles.certTitle}>{cert.title}</h4>
                <p className={styles.certBody}>{cert.body}</p>

                {cert.certNo && (
                  <div className={styles.certMeta}>
                    <span className={styles.certMetaItem}>
                      <Award size={12} /> Cert No: {cert.certNo}
                    </span>
                  </div>
                )}

                {(cert.issued || cert.expiry) && (
                  <div className={styles.certMeta}>
                    {cert.issued && (
                      <span className={styles.certMetaItem}>
                        <Calendar size={12} /> Issued: {cert.issued}
                      </span>
                    )}
                    {cert.expiry && (
                      <span className={styles.certMetaItem}>
                        <Calendar size={12} /> Valid till: {cert.expiry}
                      </span>
                    )}
                  </div>
                )}

                <p className={styles.certScope}>{cert.scope}</p>

                {cert.pdf && (
                  <a
                    href={cert.pdf}
                    download
                    className={styles.certDownloadBtn}
                    style={{ background: cert.bg, color: cert.color, borderColor: cert.border }}
                  >
                    <Download size={13} /> Download Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SDG Strip */}
        <div className={styles.sdgStrip}>
          <div className={styles.sdgText}>
            <p className={styles.sdgLabel}>UN Sustainable Development Goals</p>
            <h4 className={styles.sdgHeading}>
              Our programs are aligned with SDGs 4, 5, 10 & 17
            </h4>
            <p className={styles.sdgSub}>
              Every donation can be tracked to its SDG impact for corporate CSR reporting.
            </p>
          </div>
          <div className={styles.sdgBadges}>
            {SDGS.map(({ num, bg }) => (
              <span key={num} className={styles.sdgBadge} style={{ background: bg }}>
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
