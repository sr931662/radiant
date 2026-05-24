import { Quote } from 'lucide-react'
import styles from './Stories.module.css'

const STORY_CARDS = [
  {
    img:   'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80',
    tag:   'Girls Education · Rajasthan',
    tagColor: 'indigo',
    quote: 'Amina walked 9 km daily to study. Today she teaches science to 40 children in her village.',
    link:  '#',
    name:  'Amina',
  },
  {
    img:   'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    tag:   'Digital Literacy · Bihar',
    tagColor: 'amber',
    quote: 'Rajan had never touched a keyboard. Six months later, he built a website for his father\'s small business.',
    link:  '#',
    name:  'Rajan',
  },
]

export default function Stories() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Real Stories</p>
          <h2 className="section-heading">Not Statistics — Stories</h2>
          <p className="section-sub" style={{ margin: '0.75rem auto 0', textAlign: 'center', maxWidth: '36rem' }}>
            The most powerful conversion tool. A single human story outperforms any chart or counter.
            This is where donors fall in love with the mission.
          </p>
        </div>

        <div className={styles.grid}>
          {STORY_CARDS.map((s) => (
            <div key={s.name} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={s.img} alt={s.name} className={styles.img} />
              </div>
              <div className={styles.body}>
                <span className={`${styles.tag} ${styles['tag_' + s.tagColor]}`}>{s.tag}</span>
                <blockquote className={styles.quote}>"{s.quote}"</blockquote>
                <a href={s.link} className={styles.readMore}>
                  Read {s.name}'s Full Story →
                </a>
              </div>
            </div>
          ))}

          {/* Philosophy card */}
          <div className={`${styles.card} ${styles.philosophyCard}`}>
            <Quote size={36} color="var(--clr-accent)" fill="var(--clr-accent)" className={styles.quoteIcon} />
            <p className={styles.philosophyText}>
              "Donors give to people, not organisations. Every story we tell is a direct
              line between a supporter's heart and a child's future."
            </p>
            <p className={styles.philosophyAttrib}>— Mission Philosophy, Radiant Education Trust</p>
            <button className={styles.viewAllBtn}>View All Stories →</button>
          </div>
        </div>
      </div>
    </section>
  )
}
