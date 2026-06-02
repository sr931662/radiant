import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2, FileText, ExternalLink, Download } from 'lucide-react'
import { getAdminDownloads, createDownload, deleteDownload } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

const CATEGORIES = ['BROCHURE', 'FORM', 'REPORT', 'CERTIFICATE', 'POLICY', 'OTHER']

const CAT_COLORS = {
  BROCHURE:    [s.chipBlue],
  FORM:        [s.chipGreen],
  REPORT:      [s.chipPurple],
  CERTIFICATE: [s.chipAmber],
  POLICY:      [s.chipRed],
  OTHER:       [s.chipSlate],
}

export default function AdminDownloads() {
  const qc = useQueryClient()
  const [addModal, setAddModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const { data: items = [], isLoading } = useQuery({ queryKey: ['admin-downloads'], queryFn: getAdminDownloads })

  const createMutation = useMutation({
    mutationFn: (d) => createDownload(d),
    onSuccess: () => { toast.success('Item added.'); qc.invalidateQueries({ queryKey: ['admin-downloads'] }); setAddModal(false); reset() },
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
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Downloads</h1>
          <p className={s.pageSub}>{items.length} items available</p>
        </div>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => { setAddModal(true); reset() }}>
          <Plus size={14} /> Add Item
        </button>
      </div>

      {isLoading ? <Spinner center /> : (
        Object.keys(byCategory).length === 0 ? (
          <div className={s.card}>
            <div className={s.emptyState}>
              <div className={s.emptyStateIcon}><Download size={24} /></div>
              <p className={s.emptyStateText}>No download items yet</p>
              <p className={s.emptyStateSub}>Add files for users to download</p>
            </div>
          </div>
        ) : (
          Object.entries(byCategory).map(([cat, catItems]) => (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                <span className={`${s.chip} ${(CAT_COLORS[cat] || [s.chipSlate])[0]}`}>{cat}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{catItems.length} items</span>
              </div>
              <div className={s.card}>
                {catItems.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem', borderBottom: idx < catItems.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '9px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={17} color="#4f46e5" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={s.tdMain}>{item.title}</div>
                      {item.description && <div className={s.tdSub} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : ''}</span>
                      {item.file_url && (
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnSuccess} ${s.btnIconOnly}`} title="View file">
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnIconOnly}`} onClick={() => { if (window.confirm('Delete this item?')) deleteMutation.mutate(item.id) }}>
                        <Trash2 size={13} />
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
          <div className={s.formGroup}><label className={s.formLabel}>Title *</label><input {...register('title', { required: true })} className={s.formInput} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>File URL *</label><input {...register('file_url', { required: true })} className={s.formInput} placeholder="https://…" /></div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Category</label>
            <select {...register('category')} className={s.formSelect}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Access Level</label>
            <select {...register('access_level')} className={s.formSelect} defaultValue="PUBLIC">
              <option value="PUBLIC">Public (everyone)</option>
              <option value="MEMBER">Members only</option>
              <option value="ADMIN">Admin only</option>
            </select>
          </div>
          <button type="submit" className={s.formSubmit} disabled={createMutation.isPending}>{createMutation.isPending ? 'Adding…' : 'Add Item'}</button>
        </form>
      </Modal>
    </div>
  )
}
