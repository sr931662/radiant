import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getUsers, banUser, changeUserRoles } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'FACULTY', 'STUDENT', 'VOLUNTEER', 'PUBLIC']

export default function AdminUsers() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const [roleModal, setRoleModal] = useState(null)
  const [selectedRoles, setSelectedRoles] = useState([])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, roleFilter],
    queryFn: () => getUsers(page, 20, roleFilter),
  })

  const banMutation = useMutation({
    mutationFn: ({ id, ban }) => banUser(id, ban),
    onSuccess: () => { toast.success('User updated.'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Action failed.'),
  })

  const roleMutation = useMutation({
    mutationFn: () => changeUserRoles(roleModal.id, selectedRoles),
    onSuccess: () => { toast.success('Roles updated.'); qc.invalidateQueries({ queryKey: ['admin-users'] }); setRoleModal(null) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const users = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Users</h1>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Name / Email', 'Roles', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {u.roles?.map((r) => <span key={r} style={{ background: '#eff6ff', color: '#2563eb', padding: '1px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>{r}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <StatusBadge status={u.is_banned ? 'REJECTED' : 'APPROVED'} />
                    {!u.is_email_verified && <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#f59e0b' }}>Unverified</span>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {new Date(u.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => { setRoleModal(u); setSelectedRoles(u.roles || []) }} style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Roles</button>
                      <button onClick={() => banMutation.mutate({ id: u.id, ban: !u.is_banned })} style={{ padding: '4px 10px', background: u.is_banned ? '#f0fdf4' : '#fef2f2', color: u.is_banned ? '#059669' : '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                        {u.is_banned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!roleModal} onClose={() => setRoleModal(null)} title={`Change Roles — ${roleModal?.name}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {ROLES.map((r) => (
            <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={selectedRoles.includes(r)} onChange={(e) => setSelectedRoles(e.target.checked ? [...selectedRoles, r] : selectedRoles.filter((x) => x !== r))} />
              {r}
            </label>
          ))}
        </div>
        <button onClick={() => roleMutation.mutate()} disabled={roleMutation.isPending} style={{ width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {roleMutation.isPending ? 'Saving…' : 'Save Roles'}
        </button>
      </Modal>
    </div>
  )
}
