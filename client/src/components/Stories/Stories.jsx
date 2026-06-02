import { Quote } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPosts } from '../../services/blogService'
import Spinner from '../ui/Spinner'
import styles from './Stories.module.css'

const TAG_COLORS = ['indigo', 'amber', 'green', 'rose', 'purple']

export default function Stories() {
  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts', 1, 4],
    queryFn: () => getPosts(1, 4),
  })

  const posts = data?.items?.slice(0, 2) || []

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

        {isLoading && <Spinner center />}

        {!isLoading && posts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
            No stories published yet.{' '}
            <Link to="/blog" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Visit our blog →</Link>
          </p>
        )}

        {!isLoading && posts.length > 0 && (
          <div className={styles.grid}>
            {posts.map((s, i) => (
              <div key={s.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={s.featured_image || ''}
                    alt={s.title}
                    className={styles.img}
                  />
                </div>
                <div className={styles.body}>
                  <span className={`${styles.tag} ${styles['tag_' + TAG_COLORS[i % TAG_COLORS.length]]}`}>
                    {s.category || 'Impact Story'}
                  </span>
                  <blockquote className={styles.quote}>"{s.excerpt || s.title}"</blockquote>
                  <Link to={`/blog/${s.slug}`} className={styles.readMore}>
                    Read Full Story →
                  </Link>
                </div>
              </div>
            ))}

            <div className={`${styles.card} ${styles.philosophyCard}`}>
              <Quote size={36} color="var(--clr-accent)" fill="var(--clr-accent)" className={styles.quoteIcon} />
              <p className={styles.philosophyText}>
                "Donors give to people, not organisations. Every story we tell is a direct
                line between a supporter's heart and a child's future."
              </p>
              <p className={styles.philosophyAttrib}>— Mission Philosophy, Radiant Education Trust</p>
              <Link to="/blog" className={styles.viewAllBtn}>View All Stories →</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
