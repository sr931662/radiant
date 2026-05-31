import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Tag } from 'lucide-react'
import { getPosts } from '../services/blogService'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'
import styles from './Blog.module.css'

export default function Blog() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-posts', page],
    queryFn: () => getPosts(page, 9),
  })

  const posts = data?.items || []
  const pages = data?.pages || 1

  return (
    <div>
      <div className={styles.hero}>
        <div className="container">
          <p className="section-label">Stories & News</p>
          <h1 className={styles.title}>The Radiant Blog</h1>
          <p className={styles.sub}>
            Field stories, program updates, and voices from children whose lives are changing.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1rem' }}>
        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load posts.</p>}
        {!isLoading && posts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No posts published yet. Check back soon!</p>
        )}
        {!isLoading && posts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                  style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', transition: 'transform 0.2s, box-shadow 0.2s', height: '100%' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}
                >
                  {post.featured_image && (
                    <img src={post.featured_image} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    {post.category && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-primary)', background: '#eff6ff', padding: '2px 10px', borderRadius: '999px', marginBottom: '0.75rem' }}>
                        <Tag size={11} /> {post.category}
                      </span>
                    )}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.4 }}>{post.title}</h3>
                    {post.excerpt && (
                      <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#94a3b8' }}>
                      <Calendar size={13} />
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Recently published'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>
    </div>
  )
}
