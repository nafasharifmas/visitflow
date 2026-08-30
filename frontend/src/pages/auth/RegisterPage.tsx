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
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-sm">
            <Compass size={22} />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-stone-900">Join VisitFlow</h1>
          <p className="mt-1.5 text-sm text-stone-500">Create an account to save plans and favourites.</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              await createAccount(values)
              navigate('/explore')
            })}
          >
            <Field htmlFor="name" label="Name" error={form.formState.errors.name?.message}>
              <Input id="name" placeholder="Your name" {...form.register('name')} />
            </Field>
            <Field htmlFor="email" label="Email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" placeholder="you@example.com" {...form.register('email')} />
            </Field>
            <Field htmlFor="password" label="Password" error={form.formState.errors.password?.message}>
              <Input id="password" type="password" placeholder="••••••••" {...form.register('password')} />
            </Field>
            <Field htmlFor="password_confirmation" label="Confirm password" error={form.formState.errors.password_confirmation?.message}>
              <Input id="password_confirmation" type="password" placeholder="••••••••" {...form.register('password_confirmation')} />
            </Field>

            {error ? <p className="text-sm font-medium text-danger-700">{error}</p> : null}

            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
