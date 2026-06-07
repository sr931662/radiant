import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, CheckCircle2, XCircle } from 'lucide-react'
import { verifyCertificate } from '../services/certificateService'
import styles from './CertVerify.module.css'

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
      <div className={styles.hero}>
        <div className="container">
          <p className={`section-label ${styles.heroLabel}`}>Certificate Verification</p>
          <h1 className={styles.heroTitle}>Verify a Certificate</h1>
          <p className={styles.heroDesc}>
            Enter the unique certificate ID to verify its authenticity instantly.
          </p>
        </div>
      </div>

      <div className={`container ${styles.body}`}>
        <div className={styles.card}>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={uid}
              onChange={(e) => { setUid(e.target.value); setResult(null) }}
              placeholder="Enter Certificate ID (e.g. CERT-2025-XXXXX)"
              className={styles.input}
              onKeyDown={(e) => e.key === 'Enter' && uid.trim() && mutation.mutate()}
            />
            <button
              onClick={() => mutation.mutate()}
              disabled={!uid.trim() || mutation.isPending}
              className={styles.verifyBtn}
            >
              <Search size={16} /> {mutation.isPending ? 'Checking…' : 'Verify'}
            </button>
          </div>

          {result && (
            <div className={`${styles.result} ${result.valid ? styles.resultValid : styles.resultInvalid}`}>
              {result.valid ? (
                <div>
                  <div className={styles.validHeader}>
                    <CheckCircle2 size={28} color="#059669" />
                    <span className={styles.validLabel}>Certificate is Valid</span>
                  </div>
                  {result.certificate && (
                    <div className={styles.certDetails}>
                      <div className={styles.certRow}>
                        <span className={styles.certRowLabel}>Certificate ID</span>
                        <span className={styles.certRowValue}>{result.certificate.unique_id}</span>
                      </div>
                      {result.certificate.user_name && (
                        <div className={styles.certRow}>
                          <span className={styles.certRowLabel}>Awarded To</span>
                          <span className={styles.certRowValue}>{result.certificate.user_name}</span>
                        </div>
                      )}
                      <div className={styles.certRow}>
                        <span className={styles.certRowLabel}>Type</span>
                        <span className={styles.certRowValue}>{result.certificate.type}</span>
                      </div>
                      <div className={styles.certRow}>
                        <span className={styles.certRowLabel}>Issued On</span>
                        <span className={styles.certRowValue}>
                          {new Date(result.certificate.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.invalidMsg}>
                  <XCircle size={28} color="#ef4444" />
                  <span className={styles.invalidLabel}>Certificate Not Found or Invalid</span>
                </div>
              )}
            </div>
          )}

          <p className={styles.hint}>
            The certificate ID is printed at the bottom of every Radiant Education Trust certificate.
          </p>
        </div>
      </div>
    </div>
  )
}
