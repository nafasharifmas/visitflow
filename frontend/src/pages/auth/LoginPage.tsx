import { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/auth'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login, user, ready, busy, error, bootstrap } = useAuthStore()

  useEffect(() => {
    if (!ready) {
      void bootstrap()
    }
  }, [ready, bootstrap])

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'user@example.com',
      password: 'Password123!',
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
            <p className="kicker">WELCOME BACK</p>
            <h1>Sign in to keep your travel plans in sync.</h1>
            <p>Use your Visit Flow account to save itineraries, favourites, and profile-backed travel history.</p>
          </div>

          <form
            className="auth-form"
            onSubmit={form.handleSubmit(async (values) => {
              await login({
                email: values.email.trim(),
                password: values.password,
              })
              navigate('/explore')
            })}
          >
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
            {error ? <p className="auth-error">{error}</p> : null}
            <button className="primary" type="submit" disabled={busy}>
              {busy ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="auth-meta">
            <p>
              New here? <Link to="/register">Create an account</Link>
            </p>
            <p className="auth-note">Demo user: `user@example.com` / `Password123!`</p>
            <p className="auth-note">Demo admin: `admin@example.com` / `Password123!`</p>
          </div>
        </section>
      </section>
    </main>
  )
}