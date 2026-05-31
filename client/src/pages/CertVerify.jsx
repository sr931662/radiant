import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, CheckCircle2, XCircle, Award } from 'lucide-react'
import { verifyCertificate } from '../services/certificateService'

export default function CertVerify() {
  const [uid, setUid] = useState('')
  const [result, setResult] = useState(null)

  const mutation = useMutation({
    mutationFn: () => verifyCertificate(uid.trim()),
    onSuccess: (data) => setResult(data),
    onError: () => setResult({ valid: false }),
  })

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#059669)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <p className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Certificate Verification</p>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 700, margin: '0.5rem 0' }}>Verify a Certificate</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '36rem', margin: '0 auto' }}>
            Enter the unique certificate ID to verify its authenticity instantly.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '4rem 1rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={uid}
              onChange={(e) => { setUid(e.target.value); setResult(null) }}
              placeholder="Enter Certificate ID (e.g. CERT-2025-XXXXX)"
              style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              onKeyDown={(e) => e.key === 'Enter' && uid.trim() && mutation.mutate()}
            />
            <button
              onClick={() => mutation.mutate()}
              disabled={!uid.trim() || mutation.isPending}
              style={{ padding: '0.75rem 1.5rem', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Search size={16} /> {mutation.isPending ? 'Checking…' : 'Verify'}
            </button>
          </div>

          {result && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', background: result.valid ? '#f0fdf4' : '#fef2f2', border: `1px solid ${result.valid ? '#bbf7d0' : '#fecaca'}` }}>
              {result.valid ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <CheckCircle2 size={28} color="#059669" />
                    <span style={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>Certificate is Valid</span>
                  </div>
                  {result.certificate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#374151' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Certificate ID</span><span style={{ fontWeight: 600 }}>{result.certificate.unique_id}</span></div>
                      {result.certificate.user_name && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Awarded To</span><span style={{ fontWeight: 600 }}>{result.certificate.user_name}</span></div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Type</span><span style={{ fontWeight: 600 }}>{result.certificate.type}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Issued On</span><span style={{ fontWeight: 600 }}>{new Date(result.certificate.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <XCircle size={28} color="#ef4444" />
                  <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '1.1rem' }}>Certificate Not Found or Invalid</span>
                </div>
              )}
            </div>
          )}

          <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
            The certificate ID is printed at the bottom of every Radiant Education Trust certificate.
          </p>
        </div>
      </div>
    </div>
  )
}
