import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, BookOpen, Users } from 'lucide-react'
import { getAdminCourses, createCourse, updateCourse, deleteCourse, getAllEnrollments } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import s from './admin.module.css'

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
const MODES  = ['ONLINE', 'OFFLINE', 'HYBRID']

export default function AdminCourses() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [enrollPage, setEnrollPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [showEnroll, setShowEnroll] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm()

  const { data, isLoading } = useQuery({ queryKey: ['admin-courses', page], queryFn: () => getAdminCourses(page, 15) })
  const { data: enrollData, isLoading: enrollLoading } = useQuery({
    queryKey: ['admin-enrollments', enrollPage],
    queryFn: () => getAllEnrollments(enrollPage, 20),
    enabled: showEnroll,
  })

  const saveMutation = useMutation({
    mutationFn: (d) => {
      // Convert what_you_learn textarea (newline-separated) to array
      if (typeof d.what_you_learn === 'string') {
        d.what_you_learn = d.what_you_learn.split('\n').map(s => s.trim()).filter(Boolean)
      }
      return isNew ? createCourse(d) : updateCourse(modal.id, d)
    },
    onSuccess: () => { toast.success(isNew ? 'Course created!' : 'Course updated!'); qc.invalidateQueries({ queryKey: ['admin-courses'] }); setModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: () => { toast.success('Course deleted.'); qc.invalidateQueries({ queryKey: ['admin-courses'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  function openEdit(c) {
    setIsNew(false); setModal(c)
    ;['title', 'description', 'thumbnail', 'level', 'mode', 'duration_weeks', 'price', 'max_seats',
      'instructor', 'instructor_bio', 'prerequisites', 'target_audience', 'language',
    ].forEach((f) => setValue(f, c[f] ?? ''))
    setValue('is_active', c.is_published ?? false)
    setValue('certificate_offered', c.certificate_offered ?? true)
    setValue('what_you_learn', (c.what_you_learn || []).join('\n'))
  }

  function openNew() { setIsNew(true); setModal({}); reset({ level: 'BEGINNER', mode: 'ONLINE', is_active: false, price: 0, certificate_offered: true, language: 'Hindi / English' }) }

  const courses = data?.items || []

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Courses</h1>
          <p className={s.pageSub}>{data?.total ?? 0} courses available</p>
        </div>
        <div className={s.actionBtns}>
          <button className={`${s.btn} ${s.btnGhost}`} onClick={() => setShowEnroll((v) => !v)}>
            <Users size={14} /> {showEnroll ? 'Hide' : 'Enrollments'}
          </button>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={openNew}>
            <Plus size={14} /> New Course
          </button>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>{['Title', 'Level', 'Mode', 'Price', 'Seats', 'Status', 'Actions'].map((h) => <th key={h} className={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody className={s.tbody}>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className={s.tdPrimary}>
                    <div className={s.tdMain} style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                    {c.duration_weeks && <div className={s.tdSub}>{c.duration_weeks} weeks</div>}
                  </td>
                  <td className={s.td}><span className={`${s.chip} ${s.chipBlue}`}>{c.level}</span></td>
                  <td className={s.td}><span className={`${s.chip} ${s.chipSlate}`}>{c.mode}</span></td>
                  <td className={s.td} style={{ fontWeight: 700, color: Number(c.price) === 0 ? '#059669' : '#0f172a' }}>
                    {c.price != null ? (Number(c.price) === 0 ? 'Free' : `₹${Number(c.price).toLocaleString('en-IN')}`) : '—'}
                  </td>
                  <td className={s.td}>{c.max_seats ?? '∞'}</td>
                  <td className={s.td}><StatusBadge status={c.is_published ? 'APPROVED' : 'REJECTED'} /></td>
                  <td className={s.tdActions}>
                    <div className={s.actionBtns}>
                      <button className={`${s.btn} ${s.btnEdit} ${s.btnIconOnly}`} onClick={() => openEdit(c)}><Pencil size={13} /></button>
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnIconOnly}`} onClick={() => { if (window.confirm('Delete course?')) deleteMutation.mutate(c.id) }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={7}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><BookOpen size={24} /></div>
                    <p className={s.emptyStateText}>No courses yet</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      {showEnroll && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>Enrollments</h2>
          {enrollLoading ? <Spinner center /> : (
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead className={s.thead}>
                  <tr>{['User', 'Course', 'Status', 'Enrolled On'].map((h) => <th key={h} className={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody className={s.tbody}>
                  {(enrollData?.items || []).map((e) => (
                    <tr key={e.id}>
                      <td className={s.td}><span className={s.tdMono}>{e.user_id?.slice(0, 10)}…</span></td>
                      <td className={s.tdPrimary}><div className={s.tdMain}>{e.course_title || e.course_id?.slice(0, 10)}</div></td>
                      <td className={s.td}><StatusBadge status={e.status || 'APPROVED'} /></td>
                      <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                  {(enrollData?.items || []).length === 0 && (
                    <tr><td colSpan={4}><div className={s.emptyState}><p className={s.emptyStateText}>No enrollments yet</p></div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={enrollPage} pages={enrollData?.pages || 1} onPage={setEnrollPage} />
        </div>
      )}

      <Modal open={!!modal} onClose={() => { setModal(null); reset() }} title={isNew ? 'New Course' : 'Edit Course'} width={700}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Basic Info</p>
          <div className={s.formGroup}><label className={s.formLabel}>Title *</label><input {...register('title', { required: true })} className={s.formInput} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Description</label><textarea {...register('description')} className={s.formTextarea} rows={3} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Thumbnail URL</label><input {...register('thumbnail')} className={s.formInput} placeholder="https://…" /></div>
          <div className={s.formRow}>
            <div className={s.formGroup}><label className={s.formLabel}>Level</label><select {...register('level')} className={s.formSelect}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></div>
            <div className={s.formGroup}><label className={s.formLabel}>Mode</label><select {...register('mode')} className={s.formSelect}>{MODES.map((m) => <option key={m}>{m}</option>)}</select></div>
            <div className={s.formGroup}><label className={s.formLabel}>Duration (weeks)</label><input type="number" {...register('duration_weeks')} className={s.formInput} /></div>
            <div className={s.formGroup}><label className={s.formLabel}>Price (₹) — 0 = Free</label><input type="number" {...register('price')} className={s.formInput} /></div>
            <div className={s.formGroup}><label className={s.formLabel}>Max Seats</label><input type="number" {...register('max_seats')} className={s.formInput} /></div>
          </div>
          <div className={s.formGroup}><label className={s.formLabel}>Language</label><input {...register('language')} className={s.formInput} placeholder="Hindi / English" /></div>

          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', margin: '1.25rem 0 0.75rem', textTransform: 'uppercase' }}>Rich Content</p>
          <div className={s.formGroup}><label className={s.formLabel}>Instructor Name</label><input {...register('instructor')} className={s.formInput} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Instructor Bio</label><textarea {...register('instructor_bio')} className={s.formTextarea} rows={2} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>What You'll Learn <span style={{ color: '#94a3b8', fontWeight: 400 }}>(one point per line)</span></label><textarea {...register('what_you_learn')} className={s.formTextarea} rows={4} placeholder={"Understand core concepts\nBuild real projects\nGet certified"} /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Prerequisites</label><textarea {...register('prerequisites')} className={s.formTextarea} rows={2} placeholder="Basic computer knowledge…" /></div>
          <div className={s.formGroup}><label className={s.formLabel}>Target Audience</label><textarea {...register('target_audience')} className={s.formTextarea} rows={2} placeholder="Teachers, educators, school administrators…" /></div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
            <div className={s.formGroup}><label className={s.formCheckLabel}><input type="checkbox" {...register('is_active')} /> Published</label></div>
            <div className={s.formGroup}><label className={s.formCheckLabel}><input type="checkbox" {...register('certificate_offered')} /> Certificate on completion</label></div>
          </div>
          <button type="submit" className={s.formSubmit} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving…' : isNew ? 'Create Course' : 'Update Course'}</button>
        </form>
      </Modal>
    </div>
  )
}
