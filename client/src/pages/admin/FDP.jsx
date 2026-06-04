import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Users, Award, CheckSquare, GraduationCap } from 'lucide-react'
import {
  getAdminFdps, createFdp, updateFdp, deleteFdp,
  getFdpRegistrations, updateFdpRegistrationStatus,
  markAttendance, generateFdpCertificates,
} from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

function toDateInput(iso) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

function FDPForm({ onSubmit, isPending, isNew, defaultValues }) {
  const { register, handleSubmit } = useForm({ defaultValues })

  function handleFormSubmit(data) {
    // Convert bare date strings to ISO datetime so FastAPI accepts them
    if (data.start_date && !data.start_date.includes('T')) data.start_date = data.start_date + 'T00:00:00'
    if (data.end_date && !data.end_date.includes('T')) data.end_date = data.end_date + 'T00:00:00'
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={s.formGroup}><label className={s.formLabel}>Title *</label><input {...register('title', { required: true })} className={s.formInput} /></div>
      <div className={s.formGroup}><label className={s.formLabel}>Description</label><textarea {...register('description')} className={s.formTextarea} rows={3} /></div>
      <div className={s.formGroup}><label className={s.formLabel}>Venue</label><input {...register('venue')} className={s.formInput} /></div>
      <div className={s.formGroup}><label className={s.formLabel}>Resource Person</label><input {...register('resource_person')} className={s.formInput} /></div>
      <div className={s.formGroup}><label className={s.formLabel}>Hotel & Accommodation Info</label><textarea {...register('hotel_info')} className={s.formTextarea} rows={3} placeholder="e.g. Recommended hotels near venue, contact details, tie-up rates…" /></div>
      <div className={s.formRow}>
        <div className={s.formGroup}><label className={s.formLabel}>Start Date</label><input type="date" {...register('start_date')} className={s.formInput} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>End Date</label><input type="date" {...register('end_date')} className={s.formInput} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Max Seats</label><input type="number" {...register('max_seats')} className={s.formInput} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Fee (₹)</label><input type="number" {...register('fee')} className={s.formInput} /></div>
      </div>
      <button type="submit" disabled={isPending} className={s.formSubmit}>{isPending ? 'Saving…' : isNew ? 'Create FDP' : 'Update FDP'}</button>
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

  const { data, isLoading } = useQuery({ queryKey: ['admin-fdps', page], queryFn: () => getAdminFdps(page, 15) })

  const { data: regs = [], isLoading: regsLoading } = useQuery({
    queryKey: ['fdp-regs', regsModal?.id],
    queryFn: () => getFdpRegistrations(regsModal.id),
    enabled: !!regsModal,
  })

  const saveMutation = useMutation({
    mutationFn: (d) => isNew ? createFdp(d) : updateFdp(fdpModal.id, d),
    onSuccess: () => { toast.success(isNew ? 'FDP created!' : 'FDP updated!'); qc.invalidateQueries({ queryKey: ['admin-fdps'] }); setFdpModal(null) },
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
    mutationFn: () => markAttendance(regsModal.id, Object.entries(attendanceMap).map(([user_id, attended]) => ({ user_id, attended }))),
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
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>FDP Programs</h1>
          <p className={s.pageSub}>{data?.total ?? 0} programs</p>
        </div>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => { setIsNew(true); setFdpModal({}) }}>
          <Plus size={14} /> New FDP
        </button>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>{['Title', 'Dates', 'Venue', 'Seats', 'Status', 'Actions'].map((h) => <th key={h} className={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody className={s.tbody}>
              {fdps.map((f) => (
                <tr key={f.id}>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain} style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</div>
                    {f.resource_person && <div className={s.tdSub}>By {f.resource_person}</div>}
                  </td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>
                    {f.start_date ? new Date(f.start_date).toLocaleDateString('en-IN') : '—'}
                    {f.end_date ? ` – ${new Date(f.end_date).toLocaleDateString('en-IN')}` : ''}
                  </td>
                  <td className={s.td}>{f.venue || '—'}</td>
                  <td className={s.td}>{f.max_seats ?? '∞'}</td>
                  <td className={s.td}><StatusBadge status={f.is_active !== false ? 'APPROVED' : 'REJECTED'} /></td>
                  <td className={s.tdActions}>
                    <div className={s.actionBtns}>
                      <button className={`${s.btn} ${s.btnSuccess} ${s.btnIconOnly}`} title="Registrations" onClick={() => setRegsModal(f)}><Users size={13} /></button>
                      <button className={`${s.btn} ${s.btnEdit} ${s.btnIconOnly}`} title="Edit" onClick={() => { setIsNew(false); setFdpModal(f) }}><Pencil size={13} /></button>
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnIconOnly}`} title="Delete" onClick={() => { if (window.confirm('Delete this FDP?')) deleteMutation.mutate(f.id) }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {fdps.length === 0 && (
                <tr><td colSpan={6}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><GraduationCap size={24} /></div>
                    <p className={s.emptyStateText}>No FDP programs yet</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      <Modal open={!!fdpModal} onClose={() => setFdpModal(null)} title={isNew ? 'New FDP' : 'Edit FDP'} width={620}>
        <FDPForm
          onSubmit={(d) => saveMutation.mutate(d)}
          isPending={saveMutation.isPending}
          isNew={isNew}
          defaultValues={isNew ? {} : {
            ...fdpModal,
            start_date: toDateInput(fdpModal?.start_date),
            end_date: toDateInput(fdpModal?.end_date),
          }}
        />
      </Modal>

      <Modal open={!!regsModal} onClose={() => { setRegsModal(null); setAttendanceMap({}) }} title={`Registrations — ${regsModal?.title}`} width={740}>
        {regsLoading ? <Spinner center /> : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginBottom: '1rem' }}>
              <button className={`${s.btn} ${s.btnGhost}`} onClick={() => attendanceMutation.mutate()} disabled={attendanceMutation.isPending || Object.keys(attendanceMap).length === 0}>
                <CheckSquare size={14} /> Save Attendance
              </button>
              <button className={`${s.btn} ${s.btnEdit}`} onClick={() => certMutation.mutate()} disabled={certMutation.isPending}>
                <Award size={14} /> Generate Certificates
              </button>
            </div>
            <div style={{ maxHeight: 420, overflowY: 'auto', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <table className={s.table}>
                <thead className={s.thead}>
                  <tr>{['Name / Email', 'Status', 'Attended', 'Action'].map((h) => <th key={h} className={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody className={s.tbody}>
                  {regs.map((r) => (
                    <tr key={r.id}>
                      <td className={s.tdPrimary}>
                        <div className={s.tdMain}>{r.name || r.user_id?.slice(0, 8)}</div>
                        {r.email && <div className={s.tdSub}>{r.email}</div>}
                      </td>
                      <td className={s.td}><StatusBadge status={r.status} /></td>
                      <td className={s.td}>
                        <input type="checkbox" checked={attendanceMap[r.user_id] ?? r.attended ?? false}
                          onChange={(e) => setAttendanceMap((m) => ({ ...m, [r.user_id]: e.target.checked }))}
                          style={{ width: 15, height: 15, accentColor: '#4f46e5', cursor: 'pointer' }} />
                      </td>
                      <td className={s.tdActions}>
                        {r.status === 'PENDING' && (
                          <div className={s.actionBtns}>
                            <button className={`${s.btn} ${s.btnSuccess}`} onClick={() => regStatusMutation.mutate({ regId: r.id, status: 'APPROVED' })}>Approve</button>
                            <button className={`${s.btn} ${s.btnDanger}`} onClick={() => regStatusMutation.mutate({ regId: r.id, status: 'REJECTED' })}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {regs.length === 0 && (
                    <tr><td colSpan={4}><div className={s.emptyState}><p className={s.emptyStateText}>No registrations yet</p></div></td></tr>
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
