import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getAdminPosts, createPost, updatePost, deletePost } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

export default function AdminBlog() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [editModal, setEditModal] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog', page],
    queryFn: () => getAdminPosts(page, 15),
  })

  const saveMutation = useMutation({
    mutationFn: (d) => isNew ? createPost(d) : updatePost(editModal.id, d),
    onSuccess: () => { toast.success(isNew ? 'Post created!' : 'Post updated!'); qc.invalidateQueries({ queryKey: ['admin-blog'] }); setEditModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => { toast.success('Post deleted.'); qc.invalidateQueries({ queryKey: ['admin-blog'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  function openEdit(post) {
    setIsNew(false)
    setEditModal(post)
    setValue('title', post.title)
    setValue('content', post.content || '')
    setValue('excerpt', post.excerpt || '')
    setValue('featured_image', post.featured_image || '')
    setValue('category', post.category || '')
    setValue('status', post.status)
  }

  function openNew() {
    setIsNew(true)
    setEditModal({})
    reset({ status: 'DRAFT' })
  }

  const posts = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Blog Posts</h1>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Title', 'Category', 'Status', 'Published', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0f172a', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>{p.category || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '4px 8px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Pencil size={14} /></button>
                      <button onClick={() => { if (window.confirm('Delete this post?')) deleteMutation.mutate(p.id) }} style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!editModal} onClose={() => { setEditModal(null); reset() }} title={isNew ? 'New Post' : 'Edit Post'} width={680}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          {[['title', 'Title', 'text'], ['excerpt', 'Excerpt', 'text'], ['featured_image', 'Featured Image URL', 'url'], ['category', 'Category', 'text']].map(([name, label, type]) => (
            <div key={name} style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>{label}</label>
              <input type={type} {...register(name)} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Content</label>
            <textarea {...register('content', { required: true })} rows={8} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Status</label>
            <select {...register('status')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <button type="submit" disabled={saveMutation.isPending} style={{ width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            {saveMutation.isPending ? 'Saving…' : isNew ? 'Create Post' : 'Update Post'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
