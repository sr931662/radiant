import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, MessageSquare } from 'lucide-react'
import { getAdminPosts, createPost, updatePost, deletePost } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

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
    setIsNew(false); setEditModal(post)
    ;['title', 'content', 'excerpt', 'featured_image', 'category', 'status'].forEach((f) => setValue(f, post[f] ?? ''))
  }

  function openNew() { setIsNew(true); setEditModal({}); reset({ status: 'DRAFT' }) }

  const posts = data?.items || []

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Blog Posts</h1>
          <p className={s.pageSub}>{data?.total ?? 0} posts</p>
        </div>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={openNew}>
          <Plus size={15} /> New Post
        </button>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {['Title', 'Category', 'Status', 'Published', 'Actions'].map((h) => (
                  <th key={h} className={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain} style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  </td>
                  <td className={s.td}>{p.category ? <span className={`${s.chip} ${s.chipPurple}`}>{p.category}</span> : '—'}</td>
                  <td className={s.td}><StatusBadge status={p.status} /></td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className={s.tdActions}>
                    <div className={s.actionBtns}>
                      <button className={`${s.btn} ${s.btnEdit} ${s.btnIconOnly}`} onClick={() => openEdit(p)}><Pencil size={14} /></button>
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnIconOnly}`} onClick={() => { if (window.confirm('Delete this post?')) deleteMutation.mutate(p.id) }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={5}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><MessageSquare size={24} /></div>
                    <p className={s.emptyStateText}>No posts yet</p>
                    <p className={s.emptyStateSub}>Create your first blog post</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!editModal} onClose={() => { setEditModal(null); reset() }} title={isNew ? 'New Post' : 'Edit Post'} width={680}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          {[['title', 'Title'], ['excerpt', 'Excerpt'], ['featured_image', 'Featured Image URL'], ['category', 'Category']].map(([name, label]) => (
            <div key={name} className={s.formGroup}>
              <label className={s.formLabel}>{label}</label>
              <input {...register(name)} className={s.formInput} />
            </div>
          ))}
          <div className={s.formGroup}>
            <label className={s.formLabel}>Content *</label>
            <textarea {...register('content', { required: true })} className={s.formTextarea} rows={8} />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Status</label>
            <select {...register('status')} className={s.formSelect}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <button type="submit" className={s.formSubmit} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving…' : isNew ? 'Create Post' : 'Update Post'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
