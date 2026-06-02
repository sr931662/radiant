import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Award, Download, Search } from 'lucide-react'
import { generateCertificate, getAdminCourses, getAdminFdps } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import s from './admin.module.css'

const CERT_TYPES = [
  { value: 'COURSE', label: 'Course Completion' },
  { value: 'FDP', label: 'FDP Completion' },
  { value: 'MEMBERSHIP', label: 'Membership' },
]

export default function AdminCertificates() {
  const [generated, setGenerated] = useState(null)
  const [verifyId, setVerifyId] = useState('')
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ defaultValues: { type: 'COURSE' } })

  const certType = watch('type')

  const { data: coursesData } = useQuery({
    queryKey: ['admin-courses-cert'],
    queryFn: () => getAdminCourses(1, 100),
    enabled: certType === 'COURSE',
  })

  const { data: fdpsData } = useQuery({
    queryKey: ['admin-fdps-cert'],
    queryFn: () => getAdminFdps(1, 100),
    enabled: certType === 'FDP',
  })

  const courses = coursesData?.items || []
  const fdps   = fdpsData?.items || []

  const mutation = useMutation({
    mutationFn: (d) => generateCertificate({ type: d.type, entity_id: d.entity_id, user_id: d.user_id }),
    onSuccess: (data) => { toast.success('Certificate generated!'); setGenerated(data); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Generation failed.'),
  })

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Certificates</h1>
          <p className={s.pageSub}>Generate verifiable certificates for students and participants</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Generator */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '9px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} color="#4f46e5" />
              </div>
              <h2 className={s.cardTitle}>Generate Certificate</h2>
            </div>
          </div>
          <div className={s.cardBody}>
            <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Certificate Type *</label>
                <select {...register('type', { required: true })} className={s.formSelect}>
                  {CERT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className={s.formGroup}>
                <label className={s.formLabel}>{certType === 'COURSE' ? 'Course *' : certType === 'FDP' ? 'FDP Program *' : 'Membership ID *'}</label>
                {certType === 'COURSE' ? (
                  <select {...register('entity_id', { required: true })} className={s.formSelect}>
                    <option value="">— Select Course —</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                ) : certType === 'FDP' ? (
                  <select {...register('entity_id', { required: true })} className={s.formSelect}>
                    <option value="">— Select FDP —</option>
                    {fdps.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
                  </select>
                ) : (
                  <input {...register('entity_id', { required: true })} className={s.formInput} placeholder="Membership UUID" />
                )}
                {errors.entity_id && <p className={s.formError}>Required</p>}
              </div>

              <div className={s.formGroup}>
                <label className={s.formLabel}>User ID *</label>
                <input {...register('user_id', { required: true })} className={s.formInput} placeholder="User UUID" />
                {errors.user_id && <p className={s.formError}>Required</p>}
              </div>

              <button type="submit" className={s.formSubmit} disabled={mutation.isPending} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                <Award size={16} /> {mutation.isPending ? 'Generating…' : 'Generate Certificate'}
              </button>
            </form>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {generated && (
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.875rem' }}>
                <Award size={20} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#059669' }}>Certificate Generated!</h3>
              </div>
              {(generated.unique_id || generated.id) && (
                <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#065f46' }}>
                  <strong>ID:</strong> <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{generated.unique_id || generated.id}</code>
                </div>
              )}
              {generated.user_name && <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#065f46' }}><strong>Recipient:</strong> {generated.user_name}</div>}
              {generated.download_url && (
                <a href={generated.download_url} download style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#059669', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                  <Download size={14} /> Download PDF
                </a>
              )}
            </div>
          )}

          <div className={s.card}>
            <div className={s.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: '9px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={17} color="#059669" />
                </div>
                <h3 className={s.cardTitle}>Quick Verify</h3>
              </div>
            </div>
            <div className={s.cardBody}>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '0.875rem' }}>
                Verify a certificate on the public{' '}
                <a href="/cert-verify" target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>Certificate Verify</a>{' '}
                page.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={verifyId} onChange={(e) => setVerifyId(e.target.value)} placeholder="Certificate ID" className={s.formInput} style={{ flex: 1 }} />
                <a href={verifyId ? `/cert-verify?id=${encodeURIComponent(verifyId)}` : '#'} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnEdit}`}>
                  Verify
                </a>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}><h3 className={s.cardTitle}>How it works</h3></div>
            <div className={s.cardBody}>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#64748b', fontSize: '0.82rem', lineHeight: 2.1 }}>
                <li>Select the certificate type (Course, FDP, or Membership)</li>
                <li>Choose the corresponding entity from the dropdown</li>
                <li>Enter the User ID of the recipient</li>
                <li>A unique verifiable certificate ID is generated</li>
                <li>Anyone can verify authenticity on the public verify page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
