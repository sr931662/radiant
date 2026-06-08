import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Megaphone, ToggleLeft, ToggleRight } from 'lucide-react'
import { getAdminBanners, createBanner, updateBanner, deleteBanner } from '../../services/bannersService'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

const TYPE_COLORS = {
  info:    { bg: '#eff6ff', color: '#1d4ed8', label: 'Info' },
  warning: { bg: '#fffbeb', color: '#b45309', label: 'Warning' },
  success: { bg: '#f0fdf4', color: '#15803d', label: 'Success' },
  urgent:  { bg: '#fef2f2', color: '#b91c1c', label: 'Urgent' },
}

export default function AdminBanners() {
  const qc = useQueryClient()
  const [editModal, setEditModal] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm()

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: getAdminBanners,
  })

  const saveMutation = useMutation({
    mutationFn: (d) => isNew ? createBanner(d) : updateBanner(editModal.id, d),
    onSuccess: () => {
      toast.success(isNew ? 'Banner created!' : 'Banner updated!')
      qc.invalidateQueries({ queryKey: ['admin-banners'] })
      qc.invalidateQueries({ queryKey: ['active-banners'] })
      setEditModal(null)
      reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBanner(id),
    onSuccess: () => {
      toast.success('Banner deleted.')
      qc.invalidateQueries({ queryKey: ['admin-banners'] })
      qc.invalidateQueries({ queryKey: ['active-banners'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => updateBanner(id, { is_active: !is_active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners'] })
      qc.invalidateQueries({ queryKey: ['active-banners'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Toggle failed.'),
  })

  function openNew() {
    setIsNew(true)
    setEditModal({})
    reset({ type: 'info', is_active: true })
  }

  function openEdit(banner) {
    setIsNew(false)
    setEditModal(banner)
    ;['message', 'badge_text', 'cta_text', 'cta_url', 'type', 'is_active'].forEach((f) =>
      setValue(f, banner[f] ?? '')
    )
  }

  const activeCount = banners.filter((b) => b.is_active).length

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Notification Banners</h1>
          <p className={s.pageSub}>
            {banners.length} total · <span style={{ color: '#15803d', fontWeight: 700 }}>{activeCount} live</span>
          </p>
        </div>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={openNew}>
          <Plus size={15} /> New Banner
        </button>
      </div>

      {/* Info box */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '0.875rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#1e40af', lineHeight: 1.6 }}>
        <strong>How it works:</strong> Active banners appear in the top notification strip on the public site.
        Only the first active banner is shown at a time. Use <strong>Type</strong> to colour-code by urgency.
        Visitors can dismiss individual banners per session.
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {['Message', 'Badge', 'Type', 'CTA', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {banners.map((b) => {
                const tc = TYPE_COLORS[b.type] || TYPE_COLORS.info
                return (
                  <tr key={b.id}>
                    <td className={s.tdPrimary}>
                      <div className={s.tdMain} style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.message}
                      </div>
                    </td>
                    <td className={s.td}>
                      {b.badge_text
                        ? <span className={`${s.chip} ${s.chipBlue}`}>{b.badge_text}</span>
                        : <span style={{ color: '#94a3b8' }}>—</span>}
                    </td>
                    <td className={s.td}>
                      <span style={{ background: tc.bg, color: tc.color, fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: '99px' }}>
                        {tc.label}
                      </span>
                    </td>
                    <td className={s.td}>
                      {b.cta_text
                        ? <span style={{ fontSize: '0.78rem', color: '#2563eb' }}>{b.cta_text}</span>
                        : <span style={{ color: '#94a3b8' }}>—</span>}
                    </td>
                    <td className={s.td}>
                      <button
                        className={s.btn}
                        style={{ padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 700, border: 'none', borderRadius: 6, cursor: 'pointer',
                          background: b.is_active ? '#dcfce7' : '#f1f5f9',
                          color: b.is_active ? '#15803d' : '#64748b',
                        }}
                        onClick={() => toggleMutation.mutate({ id: b.id, is_active: b.is_active })}
                        disabled={toggleMutation.isPending}
                      >
                        {b.is_active
                          ? <><ToggleRight size={14} /> Live</>
                          : <><ToggleLeft size={14} /> Off</>}
                      </button>
                    </td>
                    <td className={s.tdActions}>
                      <div className={s.actionBtns}>
                        <button className={`${s.btn} ${s.btnEdit} ${s.btnIconOnly}`} onClick={() => openEdit(b)}>
                          <Pencil size={14} />
                        </button>
                        <button
                          className={`${s.btn} ${s.btnDanger} ${s.btnIconOnly}`}
                          onClick={() => { if (window.confirm('Delete this banner?')) deleteMutation.mutate(b.id) }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {banners.length === 0 && (
                <tr><td colSpan={6}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><Megaphone size={24} /></div>
                    <p className={s.emptyStateText}>No banners yet</p>
                    <p className={s.emptyStateSub}>Create your first notification banner</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!editModal}
        onClose={() => { setEditModal(null); reset() }}
        title={isNew ? 'New Banner' : 'Edit Banner'}
        width={560}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate({ ...d, is_active: d.is_active === true || d.is_active === 'true' }))}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Message <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              {...register('message', { required: true })}
              className={s.formTextarea}
              rows={3}
              placeholder="Emergency Education Drive — Help us reach 500 more children…"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Badge Text</label>
              <input {...register('badge_text')} className={s.formInput} placeholder="New" />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Type</label>
              <select {...register('type')} className={s.formSelect}>
                <option value="info">Info (blue)</option>
                <option value="warning">Warning (amber)</option>
                <option value="success">Success (green)</option>
                <option value="urgent">Urgent (red)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={s.formGroup}>
              <label className={s.formLabel}>CTA Button Text</label>
              <input {...register('cta_text')} className={s.formInput} placeholder="Donate Now" />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>CTA URL</label>
              <input {...register('cta_url')} className={s.formInput} placeholder="/donate or https://…" />
            </div>
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>
              <input type="checkbox" {...register('is_active')} style={{ marginRight: 7, accentColor: '#2563eb' }} />
              Publish (show on site)
            </label>
          </div>

          <button type="submit" className={s.formSubmit} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving…' : isNew ? 'Create Banner' : 'Update Banner'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
