import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Calendar, Tag, MessageSquare } from 'lucide-react'
import { getPostBySlug, addComment } from '../services/blogService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import styles from './BlogPost.module.css'

export default function BlogPost() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const qc = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getPostBySlug(slug),
  })

  const commentMutation = useMutation({
    mutationFn: ({ content }) => addComment(post.id, content),
    onSuccess: () => {
      toast.success('Comment submitted for moderation.')
      reset()
      qc.invalidateQueries({ queryKey: ['blog-post', slug] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to submit comment.'),
  })

  if (isLoading) return <Spinner center size="lg" />
  if (isError || !post) return (
    <div className={styles.errorState}>
      <p className={styles.errorStateText}>Post not found.</p>
      <Link to="/blog" style={{ color: 'var(--clr-primary)' }}>← Back to Blog</Link>
    </div>
  )

  return (
    <div className={`container ${styles.container}`}>
      <Link to="/blog" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      {post.featured_image && (
        <img src={post.featured_image} alt={post.title} className={styles.featuredImage} />
      )}

      <div className={styles.meta}>
        {post.category && (
          <span className={styles.categoryBadge}>
            <Tag size={12} /> {post.category}
          </span>
        )}
        {post.published_at && (
          <span className={styles.dateMeta}>
            <Calendar size={12} /> {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      <h1 className={styles.title}>{post.title}</h1>
      {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

      <div className={styles.content}>{post.content}</div>

      {post.tags?.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((t) => (
            <span key={t} className={styles.tag}>#{t}</span>
          ))}
        </div>
      )}

      <hr className={styles.divider} />

      <h2 className={styles.commentsTitle}>
        <MessageSquare size={20} /> Comments
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit((d) => commentMutation.mutate(d))} className={styles.commentForm}>
          <textarea
            rows={4}
            placeholder="Share your thoughts…"
            className={styles.textarea}
            {...register('content', { required: 'Comment cannot be empty', minLength: { value: 1, message: 'Required' }, maxLength: { value: 2000, message: 'Max 2000 chars' } })}
          />
          {errors.content && <p className={styles.errorText}>{errors.content.message}</p>}
          <button type="submit" disabled={commentMutation.isPending} className={styles.submitBtn}>
            {commentMutation.isPending ? 'Submitting…' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className={styles.loginPrompt}>
          <Link to="/login" style={{ color: 'var(--clr-primary)' }}>Sign in</Link> to leave a comment.
        </p>
      )}
    </div>
  )
}
