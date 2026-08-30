import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Compass, LogOut, Map, Menu, Search, User, X } from 'lucide-react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import 'leaflet/dist/leaflet.css'
import { Avatar } from '@/components/ui/Avatar'
import { AsyncState } from '@/components/AsyncState'
import { useAuthStore } from '@/store/auth'

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })))
const ExplorePage = lazy(() => import('@/pages/ExplorePage').then((module) => ({ default: module.ExplorePage })))
const PlaceDetailPage = lazy(() => import('@/pages/PlaceDetailPage').then((module) => ({ default: module.PlaceDetailPage })))
const MapPage = lazy(() => import('@/pages/MapPage').then((module) => ({ default: module.MapPage })))
const PlannerPage = lazy(() => import('@/pages/PlannerPage').then((module) => ({ default: module.PlannerPage })))
const FavouritesPage = lazy(() => import('@/pages/FavouritesPage').then((module) => ({ default: module.FavouritesPage })))
const SavedTripsPage = lazy(() => import('@/pages/SavedTripsPage').then((module) => ({ default: module.SavedTripsPage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })))
const AdminPlacesPage = lazy(() => import('@/pages/admin/AdminPlacesPage').then((module) => ({ default: module.AdminPlacesPage })))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })))

function RouteFallback() {
  return (
    <main className="mx-auto flex w-full max-w-[1320px] px-6 py-16">
      <AsyncState message="Loading page..." className="w-full" />
    </main>
  )
}

function Header() {
  const navigate = useNavigate()
  const { user, ready, logout } = useAuthStore()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const navItems = useMemo(
    () => [
      { to: '/explore', label: 'Explore' },
      { to: '/map', label: 'Map' },
      { to: '/planner', label: 'Planner' },
    ],
    [],
  )

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/explore?search=${encodeURIComponent(query)}` : '/explore')
    setMenuOpen(false)
  }

  async function handleSignOut() {
    await logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-brand-600 font-semibold'
      : 'text-stone-600 hover:text-stone-900 font-medium'

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link className="flex items-center gap-2.5" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Compass size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-900">VisitFlow</span>
        </Link>

        <form className="hidden max-w-md flex-1 md:block" onSubmit={submitSearch} role="search">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              aria-label="Search destinations"
              placeholder="Search destinations, beaches, places..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}

          {ready && user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-stone-100"
                aria-haspopup="menu"
                aria-expanded={userOpen}
              >
                <Avatar name={user.name} size={34} />
                <ChevronDown size={16} className="text-stone-400" />
              </button>
              <AnimatePresence>
                {userOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg"
                  >
                    <div className="border-b border-stone-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-stone-900">{user.name}</p>
                      <p className="truncate text-xs text-stone-400">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link to="/saved-trips" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900">
                        <Map size={16} /> My Trips
                      </Link>
                      <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900">
                        <User size={16} /> Profile
                      </Link>
                      {user.role === 'admin' ? (
                        <Link to="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900">
                          <Compass size={16} /> Admin
                        </Link>
                      ) : null}
                      <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger-700 transition hover:bg-danger-50">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <User size={16} /> Login
            </Link>
          )}
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-stone-700 transition hover:bg-stone-100 lg:hidden"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((state) => !state)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-stone-100 bg-white lg:hidden"
          >
            <div className="shell flex flex-col gap-1 py-3">
              <form className="mb-2 md:hidden" onSubmit={submitSearch} role="search">
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    aria-label="Search destinations"
                    placeholder="Search destinations..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </form>
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-700 hover:bg-stone-100'}`} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              {ready && user ? (
                <>
                  <NavLink to="/saved-trips" className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100" onClick={() => setMenuOpen(false)}>
                    My Trips
                  </NavLink>
                  <NavLink to="/profile" className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100" onClick={() => setMenuOpen(false)}>
                    Profile
                  </NavLink>
                  {user.role === 'admin' ? (
                    <NavLink to="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100" onClick={() => setMenuOpen(false)}>
                      Admin
                    </NavLink>
                  ) : null}
                  <button type="button" onClick={handleSignOut} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger-700 transition hover:bg-danger-50">
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50" onClick={() => setMenuOpen(false)}>
                  <span className="inline-flex items-center gap-2"><User size={16} /> Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white mt-16">
      <div className="shell grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <Compass size={16} />
            </span>
            <span className="text-lg font-bold tracking-tight text-stone-900">VisitFlow</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-500">
            Discover nearby places and craft the perfect one-day itinerary around your region.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-stone-500">
            <li><Link to="/explore" className="transition hover:text-stone-900">Places</Link></li>
            <li><Link to="/map" className="transition hover:text-stone-900">Map</Link></li>
            <li><Link to="/planner" className="transition hover:text-stone-900">Planner</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Account</h3>
          <ul className="mt-3 space-y-2 text-sm text-stone-500">
            <li><Link to="/login" className="transition hover:text-stone-900">Sign in</Link></li>
            <li><Link to="/register" className="transition hover:text-stone-900">Create account</Link></li>
            <li><Link to="/saved-trips" className="transition hover:text-stone-900">My Trips</Link></li>
            <li><Link to="/favourites" className="transition hover:text-stone-900">Favourites</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Platform</h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">
            Powered by Laravel + MySQL as the source of truth and React for the travel experience.
          </p>
        </div>
      </div>
      <div className="border-t border-stone-100">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-stone-400 sm:flex-row">
          <span>© {new Date().getFullYear()} VisitFlow. All rights reserved.</span>
          <span>Local day visit planner</span>
        </div>
      </div>
    </footer>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname + location.search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/places/:slug" element={<PlaceDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/saved-trips" element={<SavedTripsPage />} />
            <Route path="/my-trips" element={<SavedTripsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/places" element={<AdminPlacesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="*" element={<Navigate to="/explore" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  )
}

export default function App() {
  const { bootstrap } = useAuthStore()

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-stone-50">
        <Header />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
      <Toaster richColors />
    </BrowserRouter>
  )
}
