import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, BookOpen } from 'lucide-react'
import {
  getAdminCourses, createCourse, updateCourse, deleteCourse,
  getAllEnrollments,
} from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
const MODE = ['ONLINE', 'OFFLINE', 'HYBRID']

function FieldRow({ label, name, type = 'text', register, required, as: As = 'input', children, options }) {
  const style = { width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box', fontSize: '0.875rem' }
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>{label}</label>
      {As === 'select' ? (
        <select {...register(name, { required })} style={style}>
          {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      ) : As === 'textarea' ? (
        <textarea {...register(name, { required })} rows={3} style={{ ...style, resize: 'vertical' }} />
      ) : (
        <input type={type} {...register(name, { required })} style={style} />
      )}
    </div>
  )
}

export default function AdminCourses() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [enrollPage, setEnrollPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [showEnroll, setShowEnroll] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses', page],
    queryFn: () => getAdminCourses(page, 15),
  })

  const { data: enrollData, isLoading: enrollLoading } = useQuery({
    queryKey: ['admin-enrollments', enrollPage],
    queryFn: () => getAllEnrollments(enrollPage, 20),
    enabled: showEnroll,
  })

  const saveMutation = useMutation({
    mutationFn: (d) => isNew ? createCourse(d) : updateCourse(modal.id, d),
    onSuccess: () => {
      toast.success(isNew ? 'Course created!' : 'Course updated!')
      qc.invalidateQueries({ queryKey: ['admin-courses'] })
      setModal(null); reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: () => { toast.success('Course deleted.'); qc.invalidateQueries({ queryKey: ['admin-courses'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed.'),
  })

  function openEdit(course) {
    setIsNew(false); setModal(course)
    const fields = ['title', 'description', 'thumbnail', 'level', 'mode', 'duration_weeks', 'price', 'max_seats', 'is_active']
    fields.forEach((f) => setValue(f, course[f] ?? ''))
  }

  function openNew() {
    setIsNew(true); setModal({})
    reset({ level: 'BEGINNER', mode: 'ONLINE', is_active: true, price: 0 })
  }

  const courses = data?.items || []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Courses</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowEnroll((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.1rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
            <BookOpen size={15} /> {showEnroll ? 'Hide' : 'Show'} Enrollments
            {showEnroll ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Title', 'Level', 'Mode', 'Price', 'Seats', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.duration_weeks ? `${c.duration_weeks} wks` : ''}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{c.level}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{c.mode}</td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#059669' }}>
                    {c.price != null ? (Number(c.price) === 0 ? 'Free' : `₹${Number(c.price).toLocaleString('en-IN')}`) : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{c.max_seats ?? '∞'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={c.is_active ? 'APPROVED' : 'REJECTED'} /></td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(c)} style={{ padding: '4px 8px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Pencil size={14} /></button>
                      <button onClick={() => { if (window.confirm('Delete this course?')) deleteMutation.mutate(c.id) }} style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No courses found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />

      {showEnroll && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Enrollments</h2>
          {enrollLoading ? <Spinner center /> : (
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    {['User', 'Course', 'Status', 'Enrolled On'].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(enrollData?.items || []).map((e) => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: '#475569' }}>{e.user_id?.slice(0, 8)}…</td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{e.course_title || e.course_id?.slice(0, 8)}</td>
                      <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={e.status || 'APPROVED'} /></td>
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                  {(enrollData?.items || []).length === 0 && (
                    <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No enrollments.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={enrollPage} pages={enrollData?.pages || 1} onPage={setEnrollPage} />
        </div>
      )}

      <Modal open={!!modal} onClose={() => { setModal(null); reset() }} title={isNew ? 'New Course' : 'Edit Course'} width={660}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          <FieldRow label="Title" name="title" register={register} required />
          <FieldRow label="Description" name="description" as="textarea" register={register} />
          <FieldRow label="Thumbnail URL" name="thumbnail" register={register} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FieldRow label="Level" name="level" as="select" register={register} options={LEVELS} />
            <FieldRow label="Mode" name="mode" as="select" register={register} options={MODE} />
            <FieldRow label="Duration (weeks)" name="duration_weeks" type="number" register={register} />
            <FieldRow label="Price (₹)" name="price" type="number" register={register} />
            <FieldRow label="Max Seats" name="max_seats" type="number" register={register} />
            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '0.82rem', marginTop: '1.4rem', cursor: 'pointer' }}>
                <input type="checkbox" {...register('is_active')} /> Active
              </label>
            </div>
          </div>
          <button type="submit" disabled={saveMutation.isPending} style={{ width: '100%', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
            {saveMutation.isPending ? 'Saving…' : isNew ? 'Create Course' : 'Update Course'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
