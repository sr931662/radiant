import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MessageSquare, Send } from 'lucide-react'
import { getAdminContacts, replyToInquiry } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

export default function AdminContacts() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [replyModal, setReplyModal] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', page],
    queryFn: () => getAdminContacts(page, 20),
  })

  const mutation = useMutation({
    mutationFn: ({ reply }) => replyToInquiry(replyModal.id, reply),
    onSuccess: () => { toast.success('Reply sent!'); qc.invalidateQueries({ queryKey: ['admin-contacts'] }); setReplyModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const items = data?.items || []
  const unreplied = items.filter((i) => !i.replied_at).length

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Contact Inquiries</h1>
          <p className={s.pageSub}>{data?.total ?? 0} total · {unreplied} awaiting reply</p>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>{['From', 'Subject', 'Status', 'Received', 'Actions'].map((h) => <th key={h} className={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody className={s.tbody}>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain}>{item.name}</div>
                    <div className={s.tdSub}>{item.email}</div>
                  </td>
                  <td className={s.td} style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.subject || item.message?.slice(0, 60) || '—'}
                  </td>
                  <td className={s.td}><StatusBadge status={item.replied_at ? 'APPROVED' : 'PENDING'} /></td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className={s.tdActions}>
                    <button className={`${s.btn} ${item.replied_at ? s.btnGhost : s.btnEdit}`} onClick={() => { setReplyModal(item); reset() }}>
                      <MessageSquare size={13} /> {item.replied_at ? 'View' : 'Reply'}
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><MessageSquare size={24} /></div>
                    <p className={s.emptyStateText}>No inquiries found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!replyModal} onClose={() => { setReplyModal(null); reset() }} title="Contact Inquiry" width={600}>
        {replyModal && (
          <div>
            <div className={s.infoBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                <div>
                  <p className={s.infoBoxName}>{replyModal.name}</p>
                  <p className={s.infoBoxSub}>{replyModal.email}{replyModal.phone ? ` · ${replyModal.phone}` : ''}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{replyModal.created_at ? new Date(replyModal.created_at).toLocaleString('en-IN') : ''}</span>
              </div>
              {replyModal.subject && <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', margin: '4px 0' }}>{replyModal.subject}</p>}
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{replyModal.message}</p>
            </div>

            {replyModal.reply && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderLeft: '3px solid #2563eb', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.25rem' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.78rem', color: '#2563eb' }}>Previous Reply</p>
                <p style={{ margin: 0, color: '#1e40af', fontSize: '0.875rem', lineHeight: 1.6 }}>{replyModal.reply}</p>
              </div>
            )}

            <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Reply *</label>
                <textarea {...register('reply', { required: true })} className={s.formTextarea} rows={5} defaultValue={replyModal.reply || ''} />
              </div>
              <button type="submit" className={s.formSubmit} disabled={mutation.isPending} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                <Send size={15} /> {mutation.isPending ? 'Sending…' : 'Send Reply'}
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
