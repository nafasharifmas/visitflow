import { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/auth'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Enter your name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(8, 'Confirm your password'),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: createAccount, user, ready, busy, error, bootstrap } = useAuthStore()

  useEffect(() => {
    if (!ready) {
      void bootstrap()
    }
  }, [ready, bootstrap])

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  if (ready && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/explore'} replace />
  }

  return (
    <main className="page auth-page shell-page">
      <section className="shell auth-shell">
        <section className="auth-card premium-auth-card">
          <div>
            <p className="kicker">CREATE ACCOUNT</p>
            <h1>Join Visit Flow.</h1>
            <p>Create an account to save day-trip plans, favourites, and future local travel ideas.</p>
          </div>

          <form
            className="auth-form"
            onSubmit={form.handleSubmit(async (values) => {
              await createAccount(values)
              navigate('/explore')
            })}
          >
            <label>
              Name
              <input {...form.register('name')} />
              <span>{form.formState.errors.name?.message}</span>
            </label>
            <label>
              Email
              <input type="email" {...form.register('email')} />
              <span>{form.formState.errors.email?.message}</span>
            </label>
            <label>
              Password
              <input type="password" {...form.register('password')} />
              <span>{form.formState.errors.password?.message}</span>
            </label>
            <label>
              Confirm password
              <input type="password" {...form.register('password_confirmation')} />
              <span>{form.formState.errors.password_confirmation?.message}</span>
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <button className="primary" type="submit" disabled={busy}>
              {busy ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="auth-meta">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}