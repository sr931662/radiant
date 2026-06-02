import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getAdminVolunteers, updateApplicationStatus } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

export default function AdminVolunteers() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [reviewModal, setReviewModal] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-volunteers', page],
    queryFn: () => getAdminVolunteers(page, 20),
  })

  const mutation = useMutation({
    mutationFn: ({ status, remarks }) =>
      updateApplicationStatus(reviewModal.id, 'volunteer', status, remarks),
    onSuccess: () => {
      toast.success('Application updated.')
      qc.invalidateQueries({ queryKey: ['admin-volunteers'] })
      setReviewModal(null); reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const items = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Volunteer Applications</h1>
        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{data?.total ?? ''} total</span>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Applicant', 'Skills', 'Availability', 'Status', 'Applied On', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name || item.user_id?.slice(0, 8)}</div>
                    {item.email && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.email}</div>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {Array.isArray(item.skills) ? item.skills.join(', ') : item.skills || '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{item.availability || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={item.status} /></td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {item.status === 'PENDING' && (
                      <button onClick={() => { setReviewModal(item); reset() }} style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Review</button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!reviewModal} onClose={() => { setReviewModal(null); reset() }} title="Review Volunteer Application">
        {reviewModal && (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{reviewModal.name}</p>
              {reviewModal.email && <p style={{ margin: '0 0 4px', color: '#64748b' }}>{reviewModal.email}</p>}
              {reviewModal.message && <p style={{ margin: '0', color: '#475569', lineHeight: 1.5 }}>{reviewModal.message}</p>}
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
