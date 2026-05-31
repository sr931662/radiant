import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resetPassword } from '../../services/authService'
import styles from './Auth.module.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const prefillEmail = params.get('email') || ''
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { email: prefillEmail } })

  const mutation = useMutation({
    mutationFn: ({ email, otp, new_password }) => resetPassword(email, otp, new_password),
    onSuccess: () => { toast.success('Password reset successfully!'); navigate('/login') },
    onError: (err) => toast.error(err?.response?.data?.message || 'Invalid OTP or password. Please try again.'),
  })

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🔒</div>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.sub}>Enter the OTP sent to your email and set a new password</p>

        <form className={styles.form} onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input className={styles.input} type="email" {...register('email', { required: 'Required' })} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>OTP Code</label>
            <input className={styles.input} type="text" maxLength={6} placeholder="6-digit code" style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.4rem' }} {...register('otp', { required: 'OTP is required', pattern: { value: /^\d{6}$/, message: 'Must be 6 digits' } })} />
            {errors.otp && <p className={styles.err}>{errors.otp.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>New Password</label>
            <input className={styles.input} type="password" placeholder="Min 8 chars, uppercase & number" {...register('new_password', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, message: 'Must include uppercase, lowercase, number and special char' } })} />
            {errors.new_password && <p className={styles.err}>{errors.new_password.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm New Password</label>
            <input className={styles.input} type="password" placeholder="Re-enter password" {...register('confirm', { required: 'Required', validate: (v) => v === watch('new_password') || 'Passwords do not match' })} />
            {errors.confirm && <p className={styles.err}>{errors.confirm.message}</p>}
          </div>
          <button type="submit" className={styles.btn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p className={styles.switchText}>
          <Link to="/login" className={styles.switchLink}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
