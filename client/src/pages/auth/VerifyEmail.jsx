import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyEmail } from '../../services/authService'
import styles from './Auth.module.css'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const prefillEmail = params.get('email') || ''
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: prefillEmail } })

  const mutation = useMutation({
    mutationFn: ({ email, otp }) => verifyEmail(email, otp),
    onSuccess: () => { toast.success('Email verified! You can now sign in.'); navigate('/login') },
    onError: (err) => toast.error(err?.response?.data?.message || 'Invalid or expired OTP.'),
  })

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>📧</div>
        <h1 className={styles.title}>Verify Your Email</h1>
        <p className={styles.sub}>Enter the 6-digit OTP sent to your email address</p>

        <form className={styles.form} onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input className={styles.input} type="email" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className={styles.err}>{errors.email.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>OTP Code</label>
            <input className={styles.input} type="text" maxLength={6} placeholder="6-digit code" style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.4rem' }} {...register('otp', { required: 'OTP is required', pattern: { value: /^\d{6}$/, message: 'Must be exactly 6 digits' } })} />
            {errors.otp && <p className={styles.err}>{errors.otp.message}</p>}
          </div>
          <button type="submit" className={styles.btn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Verifying…' : 'Verify Email'}
          </button>
        </form>

        <p className={styles.switchText}>
          <Link to="/login" className={styles.switchLink}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
