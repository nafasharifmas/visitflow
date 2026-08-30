import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AsyncState } from '@/components/AsyncState'
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
    <main className="page admin-page shell-page">
      <div className="shell section-stack">
        <div className="section-heading section-heading-start">
          <div>
            <p className="kicker">ADMIN DASHBOARD</p>
            <h1>Operations at a glance.</h1>
            <p>Manage the live tourism catalogue, review account activity, and monitor what the public experience will reflect from MySQL.</p>
          </div>
          <div className="button-row compact-row">
            <Link className="nav-pill" to="/admin/places">Manage places</Link>
            <Link className="secondary" to="/admin/users">Manage users</Link>
          </div>
        </div>

        {loading ? <AsyncState message="Loading admin overview..." /> : error ? <AsyncState message={error} tone="error" /> : overview ? (
          <>
            <section className="admin-grid admin-metric-grid">
              <article><strong>{overview.users_total}</strong><span>Users</span></article>
              <article><strong>{overview.admins_total}</strong><span>Admins</span></article>
              <article><strong>{overview.active_places}</strong><span>Active places</span></article>
              <article><strong>{overview.featured_places}</strong><span>Featured places</span></article>
              <article><strong>{overview.pending_reviews}</strong><span>Pending reviews</span></article>
              <article><strong>{overview.trip_plans_total}</strong><span>Trip plans</span></article>
            </section>
            <section className="admin-panels admin-overview-panels">
              <div>
                <h2>Recent places</h2>
                <ul>
                  {overview.recent_places.map((place) => <li key={place.id}>{place.name}<small>{place.status}</small></li>)}
                </ul>
              </div>
              <div>
                <h2>Recent users</h2>
                <ul>
                  {overview.recent_users.map((item) => <li key={item.id}>{item.name}<small>{item.email}</small></li>)}
                </ul>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}