import { useQuery } from '@tanstack/react-query'
import { Megaphone, X } from 'lucide-react'
import { useState } from 'react'
import { getActiveBanners } from '../../services/bannersService'
import styles from './NewsTicker.module.css'

export default function NewsTicker() {
  const [dismissed, setDismissed] = useState([])

  const { data: banners = [] } = useQuery({
    queryKey: ['active-banners'],
    queryFn: getActiveBanners,
    staleTime: 5 * 60 * 1000,
  })

  const visible = banners.filter((b) => !dismissed.includes(b.id))
  if (visible.length === 0) return null

  const banner = visible[0]

  return (
    <div className={`${styles.ticker} ${styles[`type_${banner.type || 'info'}`] || ''}`}>
      <Megaphone size={14} className={styles.icon} />
      <p className={styles.text}>
        {banner.badge_text && <span className={styles.badge}>{banner.badge_text}</span>}
        {banner.message}
        {banner.cta_text && banner.cta_url && (
          <a href={banner.cta_url} className={styles.cta}>{banner.cta_text} →</a>
        )}
      </p>
      <button
        className={styles.dismiss}
        onClick={() => setDismissed((d) => [...d, banner.id])}
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  )
}
