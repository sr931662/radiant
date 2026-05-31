import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Calendar, Tag, MessageSquare } from 'lucide-react'
import { getPostBySlug, addComment } from '../services/blogService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'

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
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <p style={{ color: '#ef4444', marginBottom: '1rem' }}>Post not found.</p>
      <Link to="/blog" style={{ color: 'var(--clr-primary)' }}>← Back to Blog</Link>
    </div>
  )

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '3rem 1rem' }}>
      <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      {post.featured_image && (
        <img src={post.featured_image} alt={post.title} style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }} />
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {post.category && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-primary)', background: '#eff6ff', padding: '3px 12px', borderRadius: '999px' }}>
            <Tag size={12} /> {post.category}
          </span>
        )}
        {post.published_at && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
            <Calendar size={12} /> {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '1rem' }}>{post.title}</h1>
      {post.excerpt && <p style={{ fontSize: '1.1rem', color: '#475569', fontStyle: 'italic', borderLeft: '3px solid var(--clr-primary)', paddingLeft: '1rem', marginBottom: '2rem' }}>{post.excerpt}</p>}

      <div style={{ lineHeight: 1.8, color: '#374151', fontSize: '1rem', whiteSpace: 'pre-wrap', marginBottom: '3rem' }}>
        {post.content}
      </div>

      {post.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {post.tags.map((t) => (
            <span key={t} style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>#{t}</span>
          ))}
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2rem 0' }} />

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        <MessageSquare size={20} /> Comments
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit((d) => commentMutation.mutate(d))} style={{ marginBottom: '2rem' }}>
          <textarea
            rows={4}
            placeholder="Share your thoughts…"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical', marginBottom: '0.75rem', boxSizing: 'border-box' }}
            {...register('content', { required: 'Comment cannot be empty', minLength: { value: 1, message: 'Required' }, maxLength: { value: 2000, message: 'Max 2000 chars' } })}
          />
          {errors.content && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{errors.content.message}</p>}
          <button type="submit" disabled={commentMutation.isPending} style={{ padding: '0.6rem 1.5rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            {commentMutation.isPending ? 'Submitting…' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          <Link to="/login" style={{ color: 'var(--clr-primary)' }}>Sign in</Link> to leave a comment.
        </p>
      )}
    </div>
  )
}
