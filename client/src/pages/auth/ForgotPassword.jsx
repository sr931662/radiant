import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { forgotPassword } from '../../services/authService'
import styles from './Auth.module.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { register, handleSubmit, getValues, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: ({ email }) => forgotPassword(email),
    onSuccess: () => {
      toast.success('OTP sent to your email address.')
      navigate(`/auth/reset-password?email=${encodeURIComponent(getValues('email'))}`)
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Could not send OTP. Check the email and try again.'),
  })

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🔑</div>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.sub}>Enter your email and we'll send you a reset code</p>

        <form className={styles.form} onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input className={styles.input} type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
            {errors.email && <p className={styles.err}>{errors.email.message}</p>}
          </div>
          <button type="submit" className={styles.btn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Sending OTP…' : 'Send Reset Code'}
          </button>
        </form>

        <p className={styles.switchText}>
          <Link to="/login" className={styles.switchLink}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
