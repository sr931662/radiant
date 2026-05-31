import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Auth.module.css'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: (d) => registerUser({ name: d.name, email: d.email, password: d.password, phone: d.phone || undefined }),
    onSuccess: (_, vars) => {
      toast.success('Account created! Please verify your email.')
      navigate(`/auth/verify-email?email=${encodeURIComponent(vars.email)}`)
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Registration failed. Try again.'),
  })

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🌟</div>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.sub}>Join Radiant Education Trust</p>

        <form className={styles.form} onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input className={styles.input} type="text" placeholder="Your full name" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
            {errors.name && <p className={styles.err}>{errors.name.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input className={styles.input} type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
            {errors.email && <p className={styles.err}>{errors.email.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone (optional)</label>
            <input className={styles.input} type="tel" placeholder="+91 98765 43210" {...register('phone')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" placeholder="Min 8 chars, include uppercase & number" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, message: 'Must include uppercase, lowercase, number and special char' } })} />
            {errors.password && <p className={styles.err}>{errors.password.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input className={styles.input} type="password" placeholder="Re-enter password" {...register('confirmPassword', { required: 'Please confirm password', validate: (v) => v === watch('password') || 'Passwords do not match' })} />
            {errors.confirmPassword && <p className={styles.err}>{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className={styles.btn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
