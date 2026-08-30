import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { getAdminUsers, updateAdminUser } from '@/services/admin'
import { useAuthStore } from '@/store/auth'
import type { User } from '@/types/user'

export function AdminUsersPage() {
  const { user, token } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || user?.role !== 'admin') return

    void (async () => {
      try {
        setLoading(true)
        const response = await getAdminUsers(token)
        setUsers(response.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load users.')
      } finally {
        setLoading(false)
      }
    })()
  }, [token, user])

  if (!user || !token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/explore" replace />

  async function saveSelected(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || !token) return

    try {
      const response = await updateAdminUser(
        selected.id,
        {
          name: selected.name,
          email: selected.email,
          role: selected.role,
          status: selected.status,
          phone: selected.phone || '',
          profile_image: selected.profile_image || '',
        },
        token,
      )
      setUsers((state) => state.map((item) => item.id === selected.id ? response.data : item))
      setSelected(response.data)
      toast.success('User updated.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to update user.')
    }
  }

  return (
    <main className="page admin-page">
      <p className="kicker">ADMIN USERS</p>
      <h1>Manage registered accounts.</h1>
      {loading ? <AsyncState message="Loading users..." /> : error ? <AsyncState message={error} tone="error" /> : (
        <div className="admin-layout">
          <section className="panel">
            <h2>Users</h2>
            <div className="stack-list">
              {users.map((item) => (
                <button key={item.id} type="button" className="stop" onClick={() => setSelected({ ...item })}>
                  {item.name}
                  <small>{item.email} · {item.role} · {item.status}</small>
                </button>
              ))}
            </div>
          </section>
          <section className="panel">
            <h2>{selected ? 'Edit user' : 'Select a user'}</h2>
            {selected ? (
              <form className="auth-form compact-form" onSubmit={saveSelected}>
                <label>Name<input value={selected.name} onChange={(event) => setSelected((state) => state ? { ...state, name: event.target.value } : state)} /></label>
                <label>Email<input value={selected.email} onChange={(event) => setSelected((state) => state ? { ...state, email: event.target.value } : state)} /></label>
                <label>
                  Role
                  <select value={selected.role} onChange={(event) => setSelected((state) => state ? { ...state, role: event.target.value as User['role'] } : state)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <label>
                  Status
                  <select value={selected.status} onChange={(event) => setSelected((state) => state ? { ...state, status: event.target.value as User['status'] } : state)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <label>Phone<input value={selected.phone || ''} onChange={(event) => setSelected((state) => state ? { ...state, phone: event.target.value } : state)} /></label>
                <label>Profile image URL<input value={selected.profile_image || ''} onChange={(event) => setSelected((state) => state ? { ...state, profile_image: event.target.value } : state)} /></label>
                <button className="primary" type="submit">Save user</button>
              </form>
            ) : <p>Select a user from the left to edit account details.</p>}
          </section>
        </div>
      )}
    </main>
  )
}


