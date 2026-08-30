import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
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
  if (loading) return <main className="page"><AsyncState message="Loading profile..." /></main>
  if (error) return <main className="page"><AsyncState message={error} tone="error" /></main>

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <p className="kicker">PROFILE</p>
        <h1>Account details.</h1>
        <form
          className="auth-form"
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
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))} />
          </label>
          <button className="primary" type="submit">Save profile</button>
        </form>
      </section>
    </main>
  )
}

