import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import { getAdminMemberships, approveMembership, exportMemberships } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

export default function AdminMemberships() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [reviewModal, setReviewModal] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-memberships', page, statusFilter],
    queryFn: () => getAdminMemberships(page, 20, statusFilter),
  })

  const mutation = useMutation({
    mutationFn: ({ status, remarks }) => approveMembership(reviewModal.id, status, remarks),
    onSuccess: () => {
      toast.success('Membership updated.')
      qc.invalidateQueries({ queryKey: ['admin-memberships'] })
      setReviewModal(null); reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  async function handleExport() {
    try {
      const data = await exportMemberships()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'memberships.json'; a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Export failed.')
    }
  }

  const items = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Memberships</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem' }}>
            <option value="">All Status</option>
            {['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Member', 'Plan', 'Status', 'Applied On', 'Expires', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.user_name || item.user_id?.slice(0, 8)}</div>
                    {item.user_email && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.user_email}</div>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{item.plan_name || item.plan_id || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={item.status} /></td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {item.expires_at ? new Date(item.expires_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {item.status === 'PENDING' && (
                      <button onClick={() => { setReviewModal(item); reset() }} style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Review</button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No memberships found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!reviewModal} onClose={() => { setReviewModal(null); reset() }} title="Review Membership">
        {reviewModal && (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{reviewModal.user_name || reviewModal.user_id}</p>
              <p style={{ margin: '0', color: '#64748b' }}>Plan: {reviewModal.plan_name || reviewModal.plan_id}</p>
            </div>
            <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.875rem' }}>Decision</label>
                <select {...register('status', { required: true })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <option value="APPROVED">Approve</option>
                  <option value="REJECTED">Reject</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.875rem' }}>Remarks (optional)</label>
                <textarea {...register('remarks')} rows={3} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={mutation.isPending} style={{ width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                {mutation.isPending ? 'Saving…' : 'Submit Decision'}
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
