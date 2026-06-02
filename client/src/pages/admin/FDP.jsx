import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Users, Award, CheckSquare } from 'lucide-react'
import {
  getAdminFdps, createFdp, updateFdp, deleteFdp,
  getFdpRegistrations, updateFdpRegistrationStatus,
  markAttendance, generateFdpCertificates,
} from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

function FDPForm({ onSubmit, isPending, isNew }) {
  const { register, handleSubmit } = useForm()
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {[['title', 'Title', 'text', true], ['description', 'Description', 'text', false], ['venue', 'Venue', 'text', false], ['resource_person', 'Resource Person', 'text', false]].map(([name, label, type, req]) => (
        <div key={name} style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>{label}{req && ' *'}</label>
          <input type={type} {...register(name, { required: req })} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Start Date</label>
          <input type="date" {...register('start_date')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>End Date</label>
          <input type="date" {...register('end_date')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Max Seats</label>
          <input type="number" {...register('max_seats')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Fee (₹)</label>
          <input type="number" defaultValue={0} {...register('fee')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>
      </div>
      <button type="submit" disabled={isPending} style={{ width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
        {isPending ? 'Saving…' : isNew ? 'Create FDP' : 'Update FDP'}
      </button>
    </form>
  )
}

export default function AdminFDP() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [fdpModal, setFdpModal] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [regsModal, setRegsModal] = useState(null)
  const [attendanceMap, setAttendanceMap] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['admin-fdps', page],
    queryFn: () => getAdminFdps(page, 15),
  })

  const { data: regs = [], isLoading: regsLoading } = useQuery({
    queryKey: ['fdp-regs', regsModal?.id],
    queryFn: () => getFdpRegistrations(regsModal.id),
    enabled: !!regsModal,
  })

  const saveMutation = useMutation({
    mutationFn: (d) => isNew ? createFdp(d) : updateFdp(fdpModal.id, d),
    onSuccess: () => {
      toast.success(isNew ? 'FDP created!' : 'FDP updated!')
      qc.invalidateQueries({ queryKey: ['admin-fdps'] })
      setFdpModal(null)
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteFdp(id),
    onSuccess: () => { toast.success('FDP deleted.'); qc.invalidateQueries({ queryKey: ['admin-fdps'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  const regStatusMutation = useMutation({
    mutationFn: ({ regId, status }) => updateFdpRegistrationStatus(regsModal.id, regId, status),
    onSuccess: () => { toast.success('Updated.'); qc.invalidateQueries({ queryKey: ['fdp-regs', regsModal?.id] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const attendanceMutation = useMutation({
    mutationFn: () => {
      const records = Object.entries(attendanceMap).map(([user_id, attended]) => ({ user_id, attended }))
      return markAttendance(regsModal.id, records)
    },
    onSuccess: () => { toast.success('Attendance saved!'); setAttendanceMap({}) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const certMutation = useMutation({
    mutationFn: () => generateFdpCertificates(regsModal.id),
    onSuccess: () => toast.success('Certificates generated!'),
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed.'),
  })

  const fdps = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>FDP Programs</h1>
        <button onClick={() => { setIsNew(true); setFdpModal({}) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> New FDP
        </button>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Title', 'Dates', 'Venue', 'Seats', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fdps.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</div>
                    {f.resource_person && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>By {f.resource_person}</div>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {f.start_date ? new Date(f.start_date).toLocaleDateString('en-IN') : '—'}
                    {f.end_date && ` – ${new Date(f.end_date).toLocaleDateString('en-IN')}`}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{f.venue || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{f.max_seats ?? '∞'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={f.is_active !== false ? 'APPROVED' : 'REJECTED'} /></td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button title="Registrations" onClick={() => setRegsModal(f)} style={{ padding: '4px 8px', background: '#f0fdf4', color: '#059669', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Users size={13} /></button>
                      <button title="Edit" onClick={() => { setIsNew(false); setFdpModal(f) }} style={{ padding: '4px 8px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Pencil size={13} /></button>
                      <button title="Delete" onClick={() => { if (window.confirm('Delete this FDP?')) deleteMutation.mutate(f.id) }} style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {fdps.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No FDP programs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      {/* Create / Edit modal */}
      <Modal open={!!fdpModal} onClose={() => setFdpModal(null)} title={isNew ? 'New FDP' : 'Edit FDP'} width={620}>
        <FDPForm onSubmit={(d) => saveMutation.mutate(d)} isPending={saveMutation.isPending} isNew={isNew} />
      </Modal>

      {/* Registrations modal */}
      <Modal open={!!regsModal} onClose={() => { setRegsModal(null); setAttendanceMap({}) }} title={`Registrations — ${regsModal?.title}`} width={740}>
        {regsLoading ? <Spinner center /> : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
              <button onClick={() => attendanceMutation.mutate()} disabled={attendanceMutation.isPending || Object.keys(attendanceMap).length === 0} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem', background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                <CheckSquare size={14} /> Save Attendance
              </button>
              <button onClick={() => certMutation.mutate()} disabled={certMutation.isPending} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                <Award size={14} /> Generate Certificates
              </button>
            </div>
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', position: 'sticky', top: 0 }}>
                    {['Name / Email', 'Status', 'Attended', 'Action'].map((h) => (
                      <th key={h} style={{ padding: '0.6rem 0.875rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {regs.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.7rem 0.875rem' }}>
                        <div style={{ fontWeight: 600 }}>{r.name || r.user_id?.slice(0, 8)}</div>
                        {r.email && <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{r.email}</div>}
                      </td>
                      <td style={{ padding: '0.7rem 0.875rem' }}><StatusBadge status={r.status} /></td>
                      <td style={{ padding: '0.7rem 0.875rem' }}>
                        <input
                          type="checkbox"
                          checked={attendanceMap[r.user_id] ?? r.attended ?? false}
                          onChange={(e) => setAttendanceMap((m) => ({ ...m, [r.user_id]: e.target.checked }))}
                        />
                      </td>
                      <td style={{ padding: '0.7rem 0.875rem' }}>
                        {r.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => regStatusMutation.mutate({ regId: r.id, status: 'APPROVED' })} style={{ padding: '3px 8px', background: '#f0fdf4', color: '#059669', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Approve</button>
                            <button onClick={() => regStatusMutation.mutate({ regId: r.id, status: 'REJECTED' })} style={{ padding: '3px 8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {regs.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>No registrations yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
