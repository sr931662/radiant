import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HandHeart } from 'lucide-react'
import { getAdminVolunteers, updateApplicationStatus } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

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
    mutationFn: ({ status, remarks }) => updateApplicationStatus(reviewModal.id, 'volunteer', status, remarks),
    onSuccess: () => { toast.success('Application updated.'); qc.invalidateQueries({ queryKey: ['admin-volunteers'] }); setReviewModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const items = data?.items || []

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Volunteer Applications</h1>
          <p className={s.pageSub}>{data?.total ?? 0} total applications</p>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {['Applicant', 'Skills', 'Availability', 'Status', 'Applied On', 'Actions'].map((h) => (
                  <th key={h} className={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain}>{item.name || item.user_id?.slice(0, 8)}</div>
                    {item.email && <div className={s.tdSub}>{item.email}</div>}
                  </td>
                  <td className={s.td} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {Array.isArray(item.skills) ? item.skills.join(', ') : item.skills || '—'}
                  </td>
                  <td className={s.td}>{item.availability || '—'}</td>
                  <td className={s.td}><StatusBadge status={item.status} /></td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className={s.tdActions}>
                    {item.status === 'PENDING' && (
                      <button className={`${s.btn} ${s.btnEdit}`} onClick={() => { setReviewModal(item); reset() }}>Review</button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><HandHeart size={24} /></div>
                    <p className={s.emptyStateText}>No applications yet</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!reviewModal} onClose={() => { setReviewModal(null); reset() }} title="Review Volunteer Application">
        {reviewModal && (
          <div>
            <div className={s.infoBox}>
              <p className={s.infoBoxName}>{reviewModal.name}</p>
              {reviewModal.email && <p className={s.infoBoxSub}>{reviewModal.email}</p>}
              {reviewModal.message && <p className={s.infoBoxSub} style={{ marginTop: 6 }}>{reviewModal.message}</p>}
            </div>
            <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Decision</label>
                <select {...register('status', { required: true })} className={s.formSelect}>
                  <option value="APPROVED">Approve</option>
                  <option value="REJECTED">Reject</option>
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Remarks (optional)</label>
                <textarea {...register('remarks')} className={s.formTextarea} rows={3} />
              </div>
              <button type="submit" className={s.formSubmit} disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Submit Decision'}
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
