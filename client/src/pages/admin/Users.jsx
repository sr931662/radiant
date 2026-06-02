import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getUsers, banUser, changeUserRoles } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import { Users as UsersIcon } from 'lucide-react'
import s from './admin.module.css'

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
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Users</h1>
          <p className={s.pageSub}>{data?.total ?? 0} registered users</p>
        </div>
        <div className={s.filterBar} style={{ margin: 0 }}>
          <select className={s.filterSelect} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}>
            <option value="">All Roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {['Name / Email', 'Roles', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain}>{u.name}</div>
                    <div className={s.tdSub}>{u.email}</div>
                  </td>
                  <td className={s.td}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {u.roles?.map((r) => <span key={r} className={`${s.chip} ${s.chipBlue}`}>{r}</span>)}
                    </div>
                  </td>
                  <td className={s.td}>
                    <StatusBadge status={u.is_banned ? 'REJECTED' : 'APPROVED'} />
                    {!u.is_email_verified && <span className={`${s.chip} ${s.chipAmber}`} style={{ marginLeft: 6 }}>Unverified</span>}
                  </td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td className={s.tdActions}>
                    <div className={s.actionBtns}>
                      <button className={`${s.btn} ${s.btnEdit}`} onClick={() => { setRoleModal(u); setSelectedRoles(u.roles || []) }}>Roles</button>
                      <button
                        className={`${s.btn} ${u.is_banned ? s.btnSuccess : s.btnDanger}`}
                        onClick={() => banMutation.mutate({ id: u.id, ban: !u.is_banned })}
                      >
                        {u.is_banned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><UsersIcon size={24} /></div>
                    <p className={s.emptyStateText}>No users found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!roleModal} onClose={() => setRoleModal(null)} title={`Change Roles — ${roleModal?.name}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {ROLES.map((r) => (
            <label key={r} className={s.formCheckLabel}>
              <input type="checkbox" checked={selectedRoles.includes(r)}
                onChange={(e) => setSelectedRoles(e.target.checked ? [...selectedRoles, r] : selectedRoles.filter((x) => x !== r))} />
              {r}
            </label>
          ))}
        </div>
        <button className={s.formSubmit} onClick={() => roleMutation.mutate()} disabled={roleMutation.isPending}>
          {roleMutation.isPending ? 'Saving…' : 'Save Roles'}
        </button>
      </Modal>
    </div>
  )
}
