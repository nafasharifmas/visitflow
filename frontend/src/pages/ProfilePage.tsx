import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { getProfile, updateProfile } from '@/services/profile'
import { useAuthStore } from '@/store/auth'

export function ProfilePage() {
  const { user, token, bootstrap } = useAuthStore()
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    void (async () => {
      try {
        const response = await getProfile(token)
        setForm({ name: response.data.name, phone: response.data.phone || '' })
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load profile.')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  if (!user || !token) return <Navigate to="/login" replace />
  if (loading) return <main className="shell py-10"><AsyncState message="Loading profile..." /></main>
  if (error) return <main className="shell py-10"><AsyncState message={error} tone="error" /></main>

  return (
    <main className="shell py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center gap-4">
          <Avatar name={form.name || user.name} size={56} />
          <div>
            <p className="kicker">Profile</p>
            <h1 className="heading-2 mt-1">Account details.</h1>
          </div>
        </div>

        <Card padding="lg" className="shadow-sm">
          <form
            className="space-y-5"
            onSubmit={async (event) => {
              event.preventDefault()
              try {
                await updateProfile({ name: form.name, phone: form.phone }, token)
                await bootstrap()
                toast.success('Profile updated.')
              } catch (caught) {
                toast.error(caught instanceof Error ? caught.message : 'Unable to update profile.')
              }
            }}
          >
            <Field htmlFor="name" label="Name">
              <Input id="name" value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} />
            </Field>
            <Field htmlFor="phone" label="Phone">
              <Input id="phone" value={form.phone} onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))} />
            </Field>
            <Button type="submit" className="w-full" size="lg">
              Save profile
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
