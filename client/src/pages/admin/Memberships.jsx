import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Download, BadgeCheck } from 'lucide-react'
import { getAdminMemberships, approveMembership, exportMemberships } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

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
    onSuccess: () => { toast.success('Membership updated.'); qc.invalidateQueries({ queryKey: ['admin-memberships'] }); setReviewModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  async function handleExport() {
    try {
      const d = await exportMemberships()
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      Object.assign(document.createElement('a'), { href: url, download: 'memberships.json' }).click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Export failed.') }
  }

  const items = data?.items || []

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Memberships</h1>
          <p className={s.pageSub}>{data?.total ?? 0} total records</p>
        </div>
        <div className={s.filterBar} style={{ margin: 0 }}>
          <select className={s.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            {['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'].map((sv) => <option key={sv} value={sv}>{sv}</option>)}
          </select>
          <button className={`${s.btn} ${s.btnGhost}`} onClick={handleExport}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {['Member', 'Plan', 'Status', 'Applied On', 'Expires', 'Actions'].map((h) => (
                  <th key={h} className={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain}>{item.user_id?.slice(0, 10)}…</div>
                    <div className={s.tdSub}>{item.member_id || ''}</div>
                  </td>
                  <td className={s.td}>{item.plan?.name || '—'}</td>
                  <td className={s.td}><StatusBadge status={item.status} /></td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{item.end_date ? new Date(item.end_date).toLocaleDateString('en-IN') : '—'}</td>
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
                    <div className={s.emptyStateIcon}><BadgeCheck size={24} /></div>
                    <p className={s.emptyStateText}>No memberships found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!reviewModal} onClose={() => { setReviewModal(null); reset() }} title="Review Membership">
        {reviewModal && (
          <div>
            <div className={s.infoBox}>
              <p className={s.infoBoxName}>{reviewModal.user_id}</p>
              <p className={s.infoBoxSub}>Plan: {reviewModal.plan?.name || '—'}</p>
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
