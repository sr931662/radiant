import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Award, Download, Search } from 'lucide-react'
import { generateCertificate } from '../../services/adminService'
import { getAdminCourses } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'

const CERT_TYPES = [
  { value: 'COURSE_COMPLETION', label: 'Course Completion' },
  { value: 'FDP_COMPLETION', label: 'FDP Completion' },
  { value: 'PARTICIPATION', label: 'Participation' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'APPRECIATION', label: 'Appreciation' },
]

export default function AdminCertificates() {
  const [generated, setGenerated] = useState(null)
  const [verifyId, setVerifyId] = useState('')
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues: { cert_type: 'COURSE_COMPLETION' } })

  const { data: coursesData } = useQuery({
    queryKey: ['admin-courses-cert'],
    queryFn: () => getAdminCourses(1, 100),
  })

  const courses = coursesData?.items || []

  const mutation = useMutation({
    mutationFn: (d) => generateCertificate(d),
    onSuccess: (data) => {
      toast.success('Certificate generated!')
      setGenerated(data)
      reset()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Generation failed.'),
  })

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>Certificates</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>Generate individual certificates for students and participants.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Generator form */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="#2563eb" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Generate Certificate</h2>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Certificate Type *</label>
              <select {...register('cert_type', { required: true })} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                {CERT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Recipient Name *</label>
              <input {...register('recipient_name', { required: true })} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Full name as on certificate" />
            </div>

            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>User ID</label>
              <input {...register('user_id')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Leave blank for manual name" />
            </div>

            {['COURSE_COMPLETION'].includes(watch('cert_type')) && (
              <div style={{ marginBottom: '0.875rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Course</label>
                <select {...register('course_id')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <option value="">— Select Course —</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Issue Date</label>
              <input type="date" {...register('issue_date')} defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.82rem' }}>Additional Notes</label>
              <input {...register('notes')} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="e.g. with distinction" />
            </div>

            <button type="submit" disabled={mutation.isPending} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.7rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
              <Award size={16} /> {mutation.isPending ? 'Generating…' : 'Generate Certificate'}
            </button>
          </form>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Generated result */}
          {generated && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Award size={18} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>Certificate Generated!</h3>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#065f46', marginBottom: '0.5rem' }}>
                <strong>Certificate ID:</strong> {generated.certificate_id || generated.id}
              </div>
              {generated.recipient_name && (
                <div style={{ fontSize: '0.875rem', color: '#065f46', marginBottom: '0.5rem' }}>
                  <strong>Recipient:</strong> {generated.recipient_name}
                </div>
              )}
              {generated.download_url && (
                <a
                  href={generated.download_url}
                  download
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#059669', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}
                >
                  <Download size={14} /> Download PDF
                </a>
              )}
            </div>
          )}

          {/* Quick verify */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={18} color="#059669" />
              </div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Quick Verify</h3>
            </div>
            <p style={{ margin: '0 0 1rem', color: '#64748b', fontSize: '0.82rem' }}>
              You can also verify a certificate on the public{' '}
              <a href="/cert-verify" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-primary)' }}>Certificate Verify</a>{' '}
              page.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                placeholder="Enter certificate ID"
                style={{ flex: 1, padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem' }}
              />
              <a
                href={verifyId ? `/cert-verify?id=${encodeURIComponent(verifyId)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.55rem 1rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap' }}
              >
                Verify
              </a>
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>How it works</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#64748b', lineHeight: 2 }}>
              <li>Fill in the recipient name and certificate type.</li>
              <li>Optionally link a user ID for automatic name resolution.</li>
              <li>A unique verifiable certificate ID is generated.</li>
              <li>Download the PDF and share it with the recipient.</li>
              <li>Anyone can verify authenticity using the public verify page.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
