import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2, FileText, ExternalLink } from 'lucide-react'
import { getAdminDownloads, createDownload, deleteDownload } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'

const CATEGORIES = ['BROCHURE', 'FORM', 'REPORT', 'CERTIFICATE', 'POLICY', 'OTHER']

export default function AdminDownloads() {
  const qc = useQueryClient()
  const [addModal, setAddModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-downloads'],
    queryFn: getAdminDownloads,
  })

  const createMutation = useMutation({
    mutationFn: (d) => createDownload(d),
    onSuccess: () => {
      toast.success('Download item added.')
      qc.invalidateQueries({ queryKey: ['admin-downloads'] })
      setAddModal(false); reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDownload(id),
    onSuccess: () => { toast.success('Deleted.'); qc.invalidateQueries({ queryKey: ['admin-downloads'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  const byCategory = items.reduce((acc, item) => {
    const cat = item.category || 'OTHER'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Downloads</h1>
        <button onClick={() => { setAddModal(true); reset() }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {isLoading ? <Spinner center /> : (
        Object.keys(byCategory).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No download items yet. Add one!</div>
        ) : (
          Object.entries(byCategory).map(([cat, catItems]) => (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{cat}</h2>
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {catItems.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderBottom: idx < catItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={18} color="#2563eb" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{item.title}</div>
                      {item.description && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                      {item.file_url && (
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#f0fdf4', color: '#059669', borderRadius: '4px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600 }}>
                          <ExternalLink size={12} /> View
                        </a>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : ''}
                      </span>
                      <button onClick={() => { if (window.confirm('Delete this item?')) deleteMutation.mutate(item.id) }} style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )
      )}

      <Modal open={addModal} onClose={() => { setAddModal(false); reset() }} title="Add Download Item">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))}>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Title *</label>
            <input {...register('title', { required: true })} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Description</label>
            <input {...register('description')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>File URL *</label>
            <input {...register('file_url', { required: true })} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="https://…" />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Category</label>
            <select {...register('category')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
              <input type="checkbox" defaultChecked {...register('is_public')} /> Publicly Visible
            </label>
          </div>
          <button type="submit" disabled={createMutation.isPending} style={{ width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            {createMutation.isPending ? 'Adding…' : 'Add Item'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
