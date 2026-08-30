import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Pencil, Users } from 'lucide-react'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
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
    <main className="shell py-10">
      <header>
        <p className="kicker">Admin Users</p>
        <h1 className="heading-1 mt-2">Manage registered accounts.</h1>
        <p className="mt-3 max-w-2xl text-stone-500">
          Review accounts, update roles and manage account availability.
        </p>
      </header>

      {loading ? (
        <div className="mt-10"><AsyncState message="Loading users..." /></div>
      ) : error ? (
        <div className="mt-10"><AsyncState message={error} tone="error" /></div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="heading-3">Users</h2>
              <Badge variant="neutral">{users.length} total</Badge>
            </div>
            <DataTable<User>
              columns={[
                {
                  key: 'user',
                  header: 'User',
                  render: (item) => (
                    <div className="flex items-center gap-3">
                      <Avatar name={item.name} src={item.profile_image} size={36} />
                      <span className="font-medium text-stone-900">{item.name}</span>
                    </div>
                  ),
                },
                { key: 'email', header: 'Email', render: (item) => item.email },
                {
                  key: 'role',
                  header: 'Role',
                  render: (item) => <Badge variant={item.role === 'admin' ? 'brand' : 'neutral'}>{item.role}</Badge>,
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (item) => (
                    <Badge variant={item.status === 'active' ? 'success' : 'danger'}>{item.status}</Badge>
                  ),
                },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  render: (item) => (
                    <div className="flex justify-end">
                      <Button size="sm" variant="secondary" onClick={() => setSelected({ ...item })}>
                        <Pencil size={14} />
                        Edit
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={users}
              rowKey={(item) => item.id}
              onRowClick={(item) => setSelected({ ...item })}
              emptyMessage="No registered users yet."
            />
          </section>

          {selected ? (
            <Card padding="lg" className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="heading-3">Edit user</h2>
              <p className="mt-1 text-sm text-stone-500">Update the account details for {selected.name}.</p>
              <form className="mt-5 grid gap-4" onSubmit={saveSelected}>
                <Field htmlFor="name" label="Name">
                  <Input id="name" value={selected.name} onChange={(event) => setSelected((state) => state ? { ...state, name: event.target.value } : state)} />
                </Field>
                <Field htmlFor="email" label="Email">
                  <Input id="email" type="email" value={selected.email} onChange={(event) => setSelected((state) => state ? { ...state, email: event.target.value } : state)} />
                </Field>
                <Field htmlFor="role" label="Role">
                  <Select id="role" value={selected.role} onChange={(event) => setSelected((state) => state ? { ...state, role: event.target.value as User['role'] } : state)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </Field>
                <Field htmlFor="status" label="Status">
                  <Select id="status" value={selected.status} onChange={(event) => setSelected((state) => state ? { ...state, status: event.target.value as User['status'] } : state)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </Field>
                <Field htmlFor="phone" label="Phone">
                  <Input id="phone" value={selected.phone || ''} onChange={(event) => setSelected((state) => state ? { ...state, phone: event.target.value } : state)} />
                </Field>
                <Field htmlFor="profile_image" label="Profile image URL">
                  <Input id="profile_image" value={selected.profile_image || ''} onChange={(event) => setSelected((state) => state ? { ...state, profile_image: event.target.value } : state)} />
                </Field>
                <Button type="submit">Save user</Button>
              </form>
            </Card>
          ) : (
            <EmptyState
              icon={<Users size={24} />}
              title="Select a user"
              description="Choose a user from the list to edit their account details."
            />
          )}
        </div>
      )}
    </main>
  )
}