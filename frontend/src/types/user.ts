export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  phone?: string | null
  profile_image?: string | null
  created_at?: string
  updated_at?: string
}

