import Stories from '../components/Stories/Stories.jsx'
import styles from './Blog.module.css'

export default function Blog() {
  return (
    <>
      <div className={styles.hero}>
        <div className="container">
          <p className="section-label">Our Blog</p>
          <h1 className={styles.title}>Stories, News &amp; Impact</h1>
          <p className={styles.sub}>
            Real stories from the field — the lives we touch, the change we create,
            and the milestones worth celebrating.
          </p>
        </div>
      </div>
      <Stories />
    </>
  )
}
