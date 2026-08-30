import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Compass, MapPin, MessageSquare, Star, UserCog, Users } from 'lucide-react'
import { AsyncState } from '@/components/AsyncState'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getAdminOverview } from '@/services/admin'
import { useAuthStore } from '@/store/auth'

export function AdminDashboardPage() {
  const { user, token } = useAuthStore()
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof getAdminOverview>>['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || user?.role !== 'admin') return

    void (async () => {
      try {
        const response = await getAdminOverview(token)
        setOverview(response.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load admin overview.')
      } finally {
        setLoading(false)
      }
    })()
  }, [token, user])

  if (!user || !token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/explore" replace />

  return (
    <main className="shell py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Admin Dashboard</p>
          <h1 className="heading-1 mt-2">Operations at a glance.</h1>
          <p className="mt-3 max-w-2xl text-stone-500">
            Manage the live tourism catalogue, review account activity, and monitor what the public experience will reflect from MySQL.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button to="/admin/places">Manage places</Button>
          <Button to="/admin/users" variant="secondary">Manage users</Button>
        </div>
      </header>

      {loading ? (
        <div className="mt-10"><AsyncState message="Loading admin overview..." /></div>
      ) : error ? (
        <div className="mt-10"><AsyncState message={error} tone="error" /></div>
      ) : overview ? (
        <>
          <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            <Card padding="md" className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Users size={19} /></span>
              <div>
                <p className="text-2xl font-bold text-stone-900">{overview.users_total}</p>
                <p className="text-sm text-stone-500">Users</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><UserCog size={19} /></span>
              <div>
                <p className="text-2xl font-bold text-stone-900">{overview.admins_total}</p>
                <p className="text-sm text-stone-500">Admins</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><MapPin size={19} /></span>
              <div>
                <p className="text-2xl font-bold text-stone-900">{overview.active_places}</p>
                <p className="text-sm text-stone-500">Active places</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Star size={19} /></span>
              <div>
                <p className="text-2xl font-bold text-stone-900">{overview.featured_places}</p>
                <p className="text-sm text-stone-500">Featured places</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><MessageSquare size={19} /></span>
              <div>
                <p className="text-2xl font-bold text-stone-900">{overview.pending_reviews}</p>
                <p className="text-sm text-stone-500">Pending reviews</p>
              </div>
            </Card>
            <Card padding="md" className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Compass size={19} /></span>
              <div>
                <p className="text-2xl font-bold text-stone-900">{overview.trip_plans_total}</p>
                <p className="text-sm text-stone-500">Trip plans</p>
              </div>
            </Card>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card padding="lg">
              <h2 className="heading-3">Recent places</h2>
              {overview.recent_places.length === 0 ? (
                <p className="mt-4 text-sm text-stone-500">No places recorded yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-stone-100">
                  {overview.recent_places.map((place) => (
                    <li key={place.id} className="flex items-center justify-between gap-3 py-3">
                      <span className="font-medium text-stone-900">{place.name}</span>
                      <Badge variant={place.status === 'active' ? 'success' : 'neutral'}>{place.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card padding="lg">
              <h2 className="heading-3">Recent users</h2>
              {overview.recent_users.length === 0 ? (
                <p className="mt-4 text-sm text-stone-500">No registered users yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-stone-100">
                  {overview.recent_users.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-3">
                      <Avatar name={item.name} size={36} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                        <p className="truncate text-sm text-stone-500">{item.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        </>
      ) : null}
    </main>
  )
}