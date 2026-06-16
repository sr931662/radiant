import { Link } from 'react-router-dom'
import { GraduationCap, ChevronRight, BookOpen, Sparkles, Award } from 'lucide-react'
import styles from './Programs.module.css'

const UG_PROGRAMS = [
  { degree: 'BBA', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', specs: ['Operations', 'Finance', 'HR', 'Marketing', 'Business Analytics', 'Data Analytics'] },
  { degree: 'B.COM', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', specs: ['Hons.', 'General', 'International Finance & Accounting'] },
  { degree: 'BCA', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', specs: ['AI & Data Science', 'Cloud Computing', 'Cyber Security', 'FinTech', 'General'] },
  { degree: 'BA', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', specs: ['General', 'JMC', 'Hindi'] },
]

const PHD_PROGRAMS = [
  { degree: 'Ph.D. Management', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', specs: ['Business Administration', 'Human Resource Management', 'Marketing', 'Finance', 'Supply Chain Management'] },
  { degree: 'Ph.D. Commerce', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', specs: ['Accounting & Taxation', 'Financial Technology', 'Banking & Insurance', 'E-Commerce'] },
  { degree: 'Ph.D. Computer Science', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', specs: ['Artificial Intelligence', 'Machine Learning', 'Cyber Security', 'Data Science', 'Blockchain'] },
  { degree: 'Ph.D. Social Sciences', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', specs: ['Sociology', 'Economics', 'Public Policy', 'Political Science', 'Social Work'] },
  { degree: 'Ph.D. Education', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', specs: ['Curriculum Design', 'Distance Education', 'Educational Leadership', 'Special Education'] },
  { degree: 'Ph.D. Humanities', color: '#b45309', bg: '#fffbeb', border: '#fde68a', specs: ['English Literature', 'Hindi', 'History', 'Philosophy', 'Linguistics'] },
]

const PG_PROGRAMS = [
  { degree: 'MBA', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', specs: ['Healthcare Mgmt', 'Business Analytics', 'Digital Business', 'Banking & Finance', 'Supply Chain', 'HR', 'Marketing', '+10 more'] },
  { degree: 'MCA', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', specs: ['AI & Machine Learning', 'Blockchain', 'Cyber Security', 'Augmented Reality'] },
  { degree: 'MSC', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', specs: ['Data Science', 'Mathematics', 'Economics'] },
  { degree: 'MA', color: '#b45309', bg: '#fffbeb', border: '#fde68a', specs: ['Sociology', 'English', 'Economics', 'Public Policy'] },
  { degree: 'M.COM', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', specs: ['Financial Technology'] },
  { degree: 'MSW', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', specs: ['General'] },
]

function ProgramCard({ program }) {
  return (
    <div className={styles.programCard} style={{ background: program.bg, borderColor: program.border }}>
      <div className={styles.programDegree} style={{ color: program.color, background: program.color + '18' }}>
        {program.degree}
      </div>
      <div className={styles.programSpecs}>
        {program.specs.map((s) => (
          <span key={s} className={styles.specPill} style={{ color: program.color, borderColor: program.color + '40' }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Programs() {
  return (
    <section id="programs" className={styles.section}>
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <p className="section-label">Our Programs</p>
            <h2 className="section-heading">UG, PG &amp; PhD Programs</h2>
            <p className="section-sub">
              UGC-approved online programmes for working professionals — 100% flexible learning since 2008.
            </p>
          </div>
          <Link to="/courses">
            <button className={styles.viewAllBtn}>View Full Catalog →</button>
          </Link>
        </div>

        {/* UG Programs */}
        <div className={styles.categoryBanner} style={{ background: 'linear-gradient(135deg,#1d4ed8,#0891b2)' }}>
          <div className={styles.categoryBannerLeft}>
            <BookOpen size={22} color="white" style={{ flexShrink: 0 }} />
            <div>
              <p className={styles.categoryBannerLabel}>Undergraduate Programs</p>
              <p className={styles.categoryBannerSub}>3-Year Degree · Foundation to Career</p>
            </div>
          </div>
          <span className={styles.categoryBannerCount}>{UG_PROGRAMS.length} Programs</span>
        </div>
        <div className={styles.grid}>
          {UG_PROGRAMS.map((p) => <ProgramCard key={p.degree} program={p} />)}
        </div>

        {/* PG Programs */}
        <div className={styles.categoryBanner} style={{ background: 'linear-gradient(135deg,#7c3aed,#1e3a5f)', marginTop: '2rem' }}>
          <div className={styles.categoryBannerLeft}>
            <Sparkles size={22} color="white" style={{ flexShrink: 0 }} />
            <div>
              <p className={styles.categoryBannerLabel}>Postgraduate Programs</p>
              <p className={styles.categoryBannerSub}>2-Year Degree · Advance Your Career</p>
            </div>
          </div>
          <span className={styles.categoryBannerCount}>{PG_PROGRAMS.length} Programs</span>
        </div>
        <div className={`${styles.grid} ${styles.gridPg}`}>
          {PG_PROGRAMS.map((p) => <ProgramCard key={p.degree} program={p} />)}
        </div>

        {/* PhD Programs */}
        <div className={styles.categoryBanner} style={{ background: 'linear-gradient(135deg,#92400e,#1c1917)', marginTop: '2rem' }}>
          <div className={styles.categoryBannerLeft}>
            <Award size={22} color="white" style={{ flexShrink: 0 }} />
            <div>
              <p className={styles.categoryBannerLabel}>Doctoral Programs</p>
              <p className={styles.categoryBannerSub}>3–5 Year Research Degree · Regular &amp; Part-Time</p>
            </div>
          </div>
          <span className={styles.categoryBannerCount}>{PHD_PROGRAMS.length} Disciplines</span>
        </div>
        <div className={`${styles.grid} ${styles.gridPg}`}>
          {PHD_PROGRAMS.map((p) => <ProgramCard key={p.degree} program={p} />)}
        </div>

        {/* CTA row */}
        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>Full-time, Part-time &amp; Online PhD guidance available — Since 2008</p>
          <Link to="/courses">
            <button className={styles.ctaBtn}>
              Enquire Now <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
