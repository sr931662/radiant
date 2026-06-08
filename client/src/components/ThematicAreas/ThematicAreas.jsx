import { BookOpen, GraduationCap, HeartPulse, Trees, Scale, Users, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './ThematicAreas.module.css'

const AREAS = [
  {
    label: 'Literacy & Education',
    desc: 'Bridging the learning gap for underprivileged children through structured schooling and adult literacy programmes.',
    icon: BookOpen,
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    sdg: 'SDG 4',
  },
  {
    label: 'Skill Development',
    desc: 'Vocational training and UG/PG academic programmes that prepare youth for careers in a changing economy.',
    icon: GraduationCap,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    sdg: 'SDG 4',
  },
  {
    label: 'Women Empowerment',
    desc: 'Scholarships, mentorship, and leadership programmes that help women and girls claim their right to education.',
    icon: Users,
    color: '#db2777',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    sdg: 'SDG 5',
  },
  {
    label: 'Health Care',
    desc: 'Awareness campaigns and health education initiatives focused on rural and marginalised communities.',
    icon: HeartPulse,
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    sdg: 'SDG 3',
  },
  {
    label: 'Environment & Sustainability',
    desc: 'Tree plantation drives, eco-literacy, and green campus initiatives aligned with global sustainability goals.',
    icon: Trees,
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    sdg: 'SDG 13',
  },
  {
    label: 'Rural Education & Scholarship',
    desc: 'Need-based scholarships and outreach programmes bringing quality education to remote and rural areas.',
    icon: Leaf,
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
    sdg: 'SDG 10',
  },
  {
    label: 'Legal Aid',
    desc: 'Legal awareness and aid programmes ensuring communities know and can exercise their rights.',
    icon: Scale,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    sdg: 'SDG 16',
  },
]

export default function ThematicAreas() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Our Focus</p>
          <h2 className="section-heading">Thematic Areas</h2>
          <p className="section-sub">
            Seven pillars that guide every programme, donation, and partnership at Radiant Education Trust.
          </p>
        </div>

        <div className={styles.grid}>
          {AREAS.map(({ label, desc, icon: Icon, color, bg, border, sdg }) => (
            <div
              key={label}
              className={styles.card}
              style={{ '--c': color, '--bg': bg, '--border': border }}
            >
              <div className={styles.iconWrap}>
                <Icon size={24} color={color} />
              </div>
              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{label}</h3>
                <p className={styles.cardDesc}>{desc}</p>
              </div>
              <span className={styles.sdgChip}>{sdg}</span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Link to="/about" className={styles.footerLink}>
            Learn more about our work →
          </Link>
        </div>
      </div>
    </section>
  )
}
