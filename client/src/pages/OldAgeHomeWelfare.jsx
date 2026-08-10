import { Link } from 'react-router-dom'
import {
  Target,
  HeartHandshake,
  Scale,
  UtensilsCrossed,
  Stethoscope,
  Music,
  Users,
  ShieldAlert,
  Home,
  ClipboardCheck,
  CheckCircle2,
  MapPin,
  Download,
  HandHeart,
} from 'lucide-react'
import styles from './OldAgeHomeWelfare.module.css'

const SECTIONS = [
  {
    title: 'Objectives',
    icon: Target,
    color: '#2563eb',
    bg: '#eff6ff',
    items: [
      'To provide safe and dignified residential care to senior citizens.',
      'To provide nutritious food and basic amenities.',
      'To arrange regular medical care and emergency assistance.',
      'To promote physical, mental, emotional and social well-being.',
      'To encourage active and productive ageing.',
      'To protect residents from neglect, abuse, exploitation and discrimination.',
      'To facilitate social, cultural, recreational and spiritual activities according to individual choice.',
    ],
  },
  {
    title: 'Rights and Dignity of Senior Citizens',
    icon: HeartHandshake,
    color: '#db2777',
    bg: '#fdf2f8',
    items: [
      'Respectful and dignified treatment.',
      'Adequate food, clothing, shelter and personal care.',
      'Necessary medical attention.',
      'Privacy and personal space.',
      'Communication with family, friends and authorised visitors.',
      'Participation in recreational and social activities.',
      'Raise complaints without fear of retaliation.',
      'Practice personal religious or spiritual activities according to individual choice.',
      'Receive information about the rules and services of the Home.',
      'Protection from physical, emotional, verbal, sexual and financial abuse.',
    ],
  },
  {
    title: 'Non-Discrimination Policy',
    icon: Scale,
    color: '#d97706',
    bg: '#fffbeb',
    intro: 'No senior citizen shall be discriminated against on the basis of:',
    chips: ['Religion', 'Caste', 'Gender', 'Language', 'Economic background', 'Disability', 'Region', 'Social status'],
  },
  {
    title: 'Food and Nutrition',
    icon: UtensilsCrossed,
    color: '#059669',
    bg: '#f0fdf4',
    items: [
      'Nutritious, hygienic and balanced meals shall be provided.',
      'Food shall be prepared in a clean kitchen.',
      'Safe drinking water shall be readily available.',
      "Meals shall be planned according to residents' age and health requirements.",
      'Medically advised dietary restrictions shall be followed.',
      'Food quality and hygiene shall be regularly monitored.',
      'A daily food/menu register shall be maintained.',
    ],
  },
  {
    title: 'Medical Care',
    icon: Stethoscope,
    color: '#dc2626',
    bg: '#fef2f2',
    items: [
      'Every resident shall undergo an initial health assessment.',
      'Regular medical check-ups shall be arranged.',
      'A tie-up shall be maintained with a nearby hospital/health centre.',
      'Emergency medical arrangements shall be available.',
      'Medicines prescribed by qualified medical professionals shall be administered appropriately.',
      'Medical records shall be maintained confidentially.',
    ],
  },
  {
    title: 'Recreation and Social Activities',
    icon: Music,
    color: '#7c3aed',
    bg: '#faf5ff',
    items: [
      'Yoga and light exercise; meditation; music; reading; television; indoor games; gardening.',
      'Cultural programmes, festivals and celebrations, including birthday celebrations.',
      'Group discussions, educational activities and intergenerational programmes.',
      'Participation shall normally be voluntary.',
    ],
  },
  {
    title: 'Family and Community Interaction',
    icon: Users,
    color: '#0891b2',
    bg: '#ecfeff',
    items: [
      'Family members shall be encouraged to maintain contact with residents.',
      'Reasonable visiting hours shall be established.',
      'Residents shall be assisted in communicating with family members.',
      'Community volunteers and educational institutions may be invited for suitable programmes.',
      'Visits outside the Home shall be permitted subject to reasonable safety procedures.',
    ],
  },
  {
    title: 'Protection from Abuse and Exploitation',
    icon: ShieldAlert,
    color: '#dc2626',
    bg: '#fef2f2',
    intro: 'The Home shall maintain zero tolerance towards:',
    chips: [
      'Physical abuse',
      'Verbal abuse',
      'Emotional abuse',
      'Sexual abuse',
      'Financial exploitation',
      'Neglect',
      'Harassment',
      'Intimidation',
      "Unauthorised use of a resident's property",
    ],
    chipDanger: true,
    outro:
      'Any complaint shall be promptly recorded, examined and referred to the appropriate authority wherever required.',
  },
  {
    title: 'General Welfare and Management Principles',
    icon: Home,
    color: '#1d4ed8',
    bg: '#eff6ff',
    wide: true,
    twoCol: true,
    items: [
      'The Home shall maintain a safe, clean, respectful and supportive environment for all residents.',
      'Resident welfare shall remain the primary consideration in all activities and decisions.',
      'Staff, volunteers and visitors shall respect the dignity, privacy and personal choices of residents.',
      'Resident participation in social and recreational activities shall be encouraged without coercion.',
      'Complaints and concerns shall be handled sensitively and without retaliation.',
      "Records relating to residents' welfare, food, medical care and complaints shall be maintained appropriately.",
    ],
  },
  {
    title: 'Review and Compliance',
    icon: ClipboardCheck,
    color: '#475569',
    bg: '#f1f5f9',
    wide: true,
    intro:
      'This policy shall be implemented by the management of the Senior Citizens Home and reviewed periodically to ensure that resident welfare, dignity, safety and service requirements continue to be addressed.',
  },
]

function SectionCard({ section, index }) {
  const { title, icon: Icon, color, bg, intro, items, chips, chipDanger, outro, wide, twoCol } = section

  return (
    <section
      className={`${styles.card} ${wide ? styles.cardWide : ''}`}
      style={{ '--c': color, '--bg': bg }}
    >
      <div className={styles.cardHead}>
        <div className={styles.iconWrap}>
          <Icon size={20} color={color} />
        </div>
        <div>
          <p className={styles.cardNum}>Section {index + 1}</p>
          <h2 className={styles.cardTitle}>{title}</h2>
        </div>
      </div>

      {intro && <p className={styles.cardIntro}>{intro}</p>}

      {items && (
        <div className={twoCol ? styles.itemsTwoCol : styles.items}>
          {items.map((item) => (
            <div key={item} className={styles.item}>
              <CheckCircle2 size={16} color={color} style={{ flexShrink: 0, marginTop: 3 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {chips && (
        <div className={styles.chipRow}>
          {chips.map((c) => (
            <span key={c} className={`${styles.chip} ${chipDanger ? styles.chipDanger : ''}`}>
              {c}
            </span>
          ))}
        </div>
      )}

      {outro && <p className={styles.cardIntro} style={{ margin: '1rem 0 0' }}>{outro}</p>}
    </section>
  )
}

export default function OldAgeHomeWelfare() {
  return (
    <div>
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Thematic Area</p>
          <h1 className={styles.heroTitle}>Old Age Home Welfare Scheme</h1>
          <span className={styles.heroRegion}>
            <MapPin size={14} /> Senior Citizens Home Services · Delhi / NCR
          </span>
          <p className={styles.heroSub}>
            The welfare policy under which Radiant Education Trust supports safe, dignified and
            respectful residential care for senior citizens.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.wrap}>
          <div className={styles.grid}>
            {SECTIONS.map((section, i) => (
              <SectionCard key={section.title} section={section} index={i} />
            ))}
          </div>

          <div className={styles.ctaCard}>
            <div>
              <h3 className={styles.ctaTitle}>Support senior citizen welfare</h3>
              <p className={styles.ctaSub}>
                Volunteer your time, run an intergenerational programme, or contribute towards
                food, medical care and recreation for residents.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link to="/volunteer" className={styles.ctaBtn}>
                <HandHeart size={15} /> Become a Volunteer
              </Link>
              <a
                href="/documents/old-age-home-welfare-policy.docx"
                download
                className={`${styles.ctaBtn} ${styles.ctaBtnGhost}`}
              >
                <Download size={15} /> Download Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
