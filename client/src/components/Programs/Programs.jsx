import { BookOpen, GraduationCap, Users, Baby, UserCheck, Laptop, FlaskConical, Presentation, Sparkles } from 'lucide-react'
import styles from './Programs.module.css'

const CORE_PROGRAMS = [
  {
    icon: <BookOpen size={22} />,
    title: 'Primary Education',
    desc: 'Foundational literacy & numeracy in underserved communities — the highest-return investment in a child\'s future.',
  },
  {
    icon: <GraduationCap size={22} />,
    title: 'Secondary Education',
    desc: 'Pathways to complete secondary schooling — stipends, materials, and mentoring to prevent dropout.',
  },
  {
    icon: <Users size={22} />,
    title: 'Adult Literacy',
    desc: 'Evening and weekend programs for adults — empowering parents directly improves children\'s educational outcomes.',
  },
  {
    icon: <Baby size={22} />,
    title: 'Early Childhood',
    desc: 'Pre-school & kindergarten support for ages 3–6. The earliest years shape lifelong learning capacity.',
  },
]

const SPECIAL_PROGRAMS = [
  {
    icon: <UserCheck size={22} />,
    title: 'Girls Education',
    desc: 'Scholarships, safe transport, and female teacher recruitment to close the gender gap in education access.',
    accent: true,
  },
  {
    icon: <Laptop size={22} />,
    title: 'Digital Literacy',
    desc: 'Computer labs, tablet programs, and coding curricula in rural schools — closing the urban/rural technology divide.',
    accent: true,
  },
  {
    icon: <FlaskConical size={22} />,
    title: 'STEM Education',
    desc: 'Science, tech, engineering, and maths programs for secondary students — building tomorrow\'s problem-solvers.',
    accent: true,
  },
  {
    icon: <Presentation size={22} />,
    title: 'Teacher Training',
    desc: 'The highest-leverage intervention — a great teacher changes hundreds of lives. Professional certification & mentoring.',
    accent: true,
  },
]

function ProgramCard({ icon, title, desc, accent }) {
  return (
    <div className={`${styles.card} ${accent ? styles.cardAccent : ''}`}>
      <div className={`${styles.iconBox} ${accent ? styles.iconBoxAccent : ''}`}>
        {icon}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
      <button type="button" className={`${styles.learnMore} ${accent ? styles.learnMoreAccent : ''}`}>
        Learn More →
      </button>
    </div>
  )
}

export default function Programs() {
  return (
    <section id="programs" className={styles.section}>
      <div className="container">
        {/* Header row */}
        <div className={styles.headerRow}>
          <div>
            <p className="section-label">Core Initiatives</p>
            <h2 className="section-heading">Comprehensive Programs for Every Child</h2>
            <p className="section-sub">
              Each program has its own dedicated page, statistics, stories, and donation pathway
              — fully managed from our admin panel.
            </p>
          </div>
          <button className={styles.viewAllBtn}>View All Programs →</button>
        </div>

        {/* Core programs */}
        <div className={styles.categoryLabel}>
          <BookOpen size={18} color="var(--clr-primary)" />
          Core Education Programs
        </div>
        <div className={styles.grid}>
          {CORE_PROGRAMS.map((p) => (
            <ProgramCard key={p.title} {...p} />
          ))}
        </div>

        {/* Specialised programs */}
        <div className={`${styles.categoryLabel} ${styles.categoryLabelAmber}`}>
          <Sparkles size={18} color="var(--clr-accent)" />
          Specialised Programs
        </div>
        <div className={styles.grid}>
          {SPECIAL_PROGRAMS.map((p) => (
            <ProgramCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}
