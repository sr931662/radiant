import { Image, Video, Play } from 'lucide-react'
import styles from './Gallery.module.css'

const ALBUMS = [
  {
    title: 'Annual Day 2025',
    count: 42,
    type: 'photo',
    cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    tag: 'Events',
  },
  {
    title: 'Digital Literacy Camp',
    count: 28,
    type: 'photo',
    cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    tag: 'Programs',
  },
  {
    title: 'Girls Education Drive',
    count: 15,
    type: 'video',
    cover: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    tag: 'Field Stories',
  },
  {
    title: 'Scholarship Ceremony',
    count: 56,
    type: 'photo',
    cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    tag: 'Events',
  },
  {
    title: 'FDP Workshop — July 2025',
    count: 33,
    type: 'photo',
    cover: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    tag: 'Training',
  },
  {
    title: 'Village Outreach',
    count: 7,
    type: 'video',
    cover: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80',
    tag: 'Field Stories',
  },
]

export default function Gallery() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <p className="section-label">Media Hub</p>
          <h1 className={styles.title}>Gallery</h1>
          <p className={styles.sub}>
            Moments from the field — classrooms, ceremonies, outreach camps,
            and the faces that make this mission real.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.filters}>
          {['All', 'Events', 'Programs', 'Field Stories', 'Training'].map((f) => (
            <button key={f} className={`${styles.filterBtn} ${f === 'All' ? styles.filterActive : ''}`}>
              {f}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {ALBUMS.map((album) => (
            <div key={album.title} className={styles.card}>
              <div className={styles.coverWrapper}>
                <img src={album.cover} alt={album.title} className={styles.cover} />
                <div className={styles.overlay}>
                  {album.type === 'video'
                    ? <div className={styles.playBtn}><Play size={28} fill="white" /></div>
                    : <div className={styles.viewBtn}><Image size={20} /> View Album</div>
                  }
                </div>
                <span className={styles.tag}>{album.tag}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{album.title}</h3>
                <p className={styles.cardMeta}>
                  {album.type === 'video' ? <Video size={14} /> : <Image size={14} />}
                  {album.count} {album.type === 'video' ? 'videos' : 'photos'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
