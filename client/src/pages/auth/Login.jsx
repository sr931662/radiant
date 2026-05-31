import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: () => { toast.success('Welcome back!'); navigate(from, { replace: true }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Invalid email or password.'),
  })

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🌟</div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.sub}>Sign in to your Radiant account</p>

        <form className={styles.form} onSubmit={handleSubmit((d) => mutation.mutate(d))}>
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
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className={styles.err}>{errors.password.message}</p>}
          </div>
          <div className={styles.forgotRow}>
            <Link to="/auth/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <button type="submit" className={styles.btn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
