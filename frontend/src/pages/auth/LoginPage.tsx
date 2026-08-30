import { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
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
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-sm">
            <Compass size={22} />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-stone-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-stone-500">Sign in to keep your travel plans in sync.</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(async (values) => {
              await login({
                email: values.email.trim(),
                password: values.password,
              })
              navigate('/explore')
            })}
          >
            <Field htmlFor="email" label="Email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" placeholder="you@example.com" {...form.register('email')} />
            </Field>
            <Field htmlFor="password" label="Password" error={form.formState.errors.password?.message}>
              <Input id="password" type="password" placeholder="••••••••" {...form.register('password')} />
            </Field>

            {error ? <p className="text-sm font-medium text-danger-700">{error}</p> : null}

            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-500">
            New here?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-100/60 p-4 text-xs text-stone-500">
          <p className="font-medium text-stone-700">Demo accounts</p>
          <p className="mt-1">User: user@example.com / Password123!</p>
          <p className="mt-0.5">Admin: admin@example.com / Password123!</p>
        </div>
      </div>
    </main>
  )
}
