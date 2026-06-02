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
    onSuccess: () => {
      toast.success('Reply sent!')
      qc.invalidateQueries({ queryKey: ['admin-contacts'] })
      setReplyModal(null); reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to send reply.'),
  })

  const items = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Contact Inquiries</h1>
        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{data?.total ?? ''} total</span>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['From', 'Subject', 'Status', 'Received', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.email}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.subject || item.message?.slice(0, 60) || '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <StatusBadge status={item.replied_at ? 'APPROVED' : 'PENDING'} />
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <button onClick={() => { setReplyModal(item); reset() }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                      <MessageSquare size={12} /> {item.replied_at ? 'View' : 'Reply'}
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No inquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!replyModal} onClose={() => { setReplyModal(null); reset() }} title="Contact Inquiry" width={600}>
        {replyModal && (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{replyModal.name}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.82rem', marginLeft: '8px' }}>{replyModal.email}</span>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{replyModal.created_at ? new Date(replyModal.created_at).toLocaleString('en-IN') : ''}</span>
              </div>
              {replyModal.subject && <p style={{ margin: '0 0 8px', fontWeight: 500, fontSize: '0.875rem' }}>{replyModal.subject}</p>}
              <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{replyModal.message}</p>
              {replyModal.phone && <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#64748b' }}>Phone: {replyModal.phone}</p>}
            </div>

            {replyModal.admin_reply && (
              <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', borderLeft: '3px solid #2563eb' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.82rem', color: '#2563eb' }}>Previous Reply</p>
                <p style={{ margin: 0, color: '#1e40af', fontSize: '0.875rem', lineHeight: 1.6 }}>{replyModal.admin_reply}</p>
              </div>
            )}

            <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.875rem' }}>Reply</label>
                <textarea {...register('reply', { required: true })} rows={5} defaultValue={replyModal.admin_reply || ''} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={mutation.isPending} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                <Send size={15} /> {mutation.isPending ? 'Sending…' : 'Send Reply'}
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
