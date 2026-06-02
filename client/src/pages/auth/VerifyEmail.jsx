import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MailCheck, RefreshCw } from 'lucide-react'
import { verifyEmail, resendOtp } from '../../services/authService'
import styles from './Auth.module.css'

const COOLDOWN = 60 // seconds

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const prefillEmail = params.get('email') || ''

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { email: prefillEmail },
  })

  const [countdown, setCountdown] = useState(COOLDOWN)
  const [canResend, setCanResend] = useState(false)
  const timerRef = useRef(null)

  const startCountdown = useCallback(() => {
    setCanResend(false)
    setCountdown(COOLDOWN)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Auto-start cooldown on mount (OTP was just sent during registration)
  useEffect(() => {
    if (prefillEmail) startCountdown()
    return () => clearInterval(timerRef.current)
  }, [prefillEmail, startCountdown])

  const verifyMutation = useMutation({
    mutationFn: ({ email, otp }) => verifyEmail(email, otp),
    onSuccess: () => {
      toast.success('Email verified! You can now sign in.')
      navigate('/login')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Invalid or expired OTP.'),
  })

  const resendMutation = useMutation({
    mutationFn: (email) => resendOtp(email, 'VERIFY_EMAIL'),
    onSuccess: () => {
      toast.success('New OTP sent! Check your inbox.')
      startCountdown()
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Failed to resend OTP.'
      toast.error(msg)
      // If backend says "wait X seconds", honour it without resetting the timer
    },
  })

  const currentEmail = watch('email')

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <MailCheck size={40} color="var(--clr-primary)" strokeWidth={1.5} />
        </div>
        <h1 className={styles.title}>Verify Your Email</h1>
        <p className={styles.sub}>
          Enter the 6-digit OTP sent to{' '}
          {prefillEmail ? <strong>{prefillEmail}</strong> : 'your email address'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit((d) => verifyMutation.mutate(d))}>
          {/* Only show email field if no prefill */}
          {!prefillEmail && (
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className={styles.err}>{errors.email.message}</p>}
            </div>
          )}

          {/* Hidden email for form submission when prefilled */}
          {prefillEmail && (
            <input type="hidden" {...register('email')} />
          )}

          <div className={styles.field}>
            <label className={styles.label}>OTP Code</label>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="• • • • • •"
              autoFocus
              style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 }}
              {...register('otp', {
                required: 'OTP is required',
                pattern: { value: /^\d{6}$/, message: 'Must be exactly 6 digits' },
              })}
            />
            {errors.otp && <p className={styles.err}>{errors.otp.message}</p>}
          </div>

          <button type="submit" className={styles.btn} disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? 'Verifying…' : 'Verify Email'}
          </button>
        </form>

        {/* Resend section */}
        <div className={styles.resendSection}>
          <p className={styles.resendText}>Didn't receive the code?</p>
          {canResend ? (
            <button
              type="button"
              className={styles.resendBtn}
              onClick={() => resendMutation.mutate(currentEmail)}
              disabled={resendMutation.isPending || !currentEmail}
            >
              <RefreshCw size={14} className={resendMutation.isPending ? styles.spinning : ''} />
              {resendMutation.isPending ? 'Sending…' : 'Resend OTP'}
            </button>
          ) : (
            <p className={styles.countdownText}>
              Resend available in <strong>{countdown}s</strong>
            </p>
          )}
        </div>

        <p className={styles.switchText} style={{ marginTop: '0.75rem' }}>
          <Link to="/login" className={styles.switchLink}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
