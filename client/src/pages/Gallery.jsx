import { useState } from 'react'
import { Image, Video, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAlbums } from '../services/galleryService'
import Spinner from '../components/ui/Spinner'
import styles from './Gallery.module.css'

const FILTERS = ['All', 'Events', 'Programs', 'Field Stories', 'Training']

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All')

  const { data: albums = [], isLoading, isError } = useQuery({
    queryKey: ['gallery-albums'],
    queryFn: getAlbums,
  })

  const filtered = activeFilter === 'All'
    ? albums
    : albums.filter((a) => a.tag === activeFilter || a.album_type === activeFilter.toLowerCase())

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
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>Failed to load gallery. Please try again.</p>}

        {!isLoading && !isError && (
          <div className={styles.grid}>
            {filtered.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                No albums found.
              </p>
            )}
            {filtered.map((album) => {
              const isVideo = album.album_type === 'video' || album.type === 'video'
              const cover = album.cover_image || album.cover || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'
              return (
                <div key={album.id || album.title} className={styles.card}>
                  <div className={styles.coverWrapper}>
                    <img src={cover} alt={album.title} className={styles.cover} />
                    <div className={styles.overlay}>
                      {isVideo
                        ? <div className={styles.playBtn}><Play size={28} fill="white" /></div>
                        : <div className={styles.viewBtn}><Image size={20} /> View Album</div>
                      }
                    </div>
                    {album.tag && <span className={styles.tag}>{album.tag}</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{album.title}</h3>
                    <p className={styles.cardMeta}>
                      {isVideo ? <Video size={14} /> : <Image size={14} />}
                      {album.media_count ?? album.count ?? 0} {isVideo ? 'videos' : 'photos'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
