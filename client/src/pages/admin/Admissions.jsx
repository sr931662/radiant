import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getAdmissions, updateAdmissionStatus } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

export default function AdminAdmissions() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [actionModal, setActionModal] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-admissions', page, statusFilter],
    queryFn: () => getAdmissions(page, 20, statusFilter),
  })

  const mutation = useMutation({
    mutationFn: ({ status, remarks }) => updateAdmissionStatus(actionModal.id, status, remarks),
    onSuccess: () => { toast.success('Application updated.'); qc.invalidateQueries({ queryKey: ['admin-admissions'] }); setActionModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const items = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Admissions</h1>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <option value="">All Status</option>
          {['PENDING', 'APPROVED', 'REJECTED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Applicant', 'Course', 'Status', 'Applied On', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{item.user_id?.slice(0, 8)}…</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{item.course_name}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={item.status} /></td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {item.status === 'PENDING' && (
                      <button onClick={() => setActionModal(item)} style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Review</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!actionModal} onClose={() => { setActionModal(null); reset() }} title="Review Application">
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
      </Modal>
    </div>
  )
}
