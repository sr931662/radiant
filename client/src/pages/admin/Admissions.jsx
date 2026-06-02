import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FileText } from 'lucide-react'
import { getAdmissions, updateAdmissionStatus } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

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
  const pending = items.filter((i) => i.status === 'PENDING').length

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Admissions</h1>
          <p className={s.pageSub}>{data?.total ?? 0} applications · {pending} pending review</p>
        </div>
        <div className={s.filterBar} style={{ margin: 0 }}>
          <select className={s.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            {['PENDING', 'APPROVED', 'REJECTED'].map((s_) => <option key={s_} value={s_}>{s_}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {['Applicant', 'Course', 'Status', 'Applied On', 'Actions'].map((h) => (
                  <th key={h} className={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={s.td}>
                    <span className={s.tdMono}>{item.user_id?.slice(0, 10)}…</span>
                  </td>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain}>{item.course_name || '—'}</div>
                  </td>
                  <td className={s.td}><StatusBadge status={item.status} /></td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                  <td className={s.tdActions}>
                    {item.status === 'PENDING' && (
                      <button className={`${s.btn} ${s.btnEdit}`} onClick={() => setActionModal(item)}>Review</button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><FileText size={24} /></div>
                    <p className={s.emptyStateText}>No applications found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!actionModal} onClose={() => { setActionModal(null); reset() }} title="Review Application">
        {actionModal && (
          <div>
            <div className={s.infoBox}>
              <p className={s.infoBoxName}>Course: {actionModal.course_name}</p>
              <p className={s.infoBoxSub}>Applicant ID: {actionModal.user_id}</p>
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
