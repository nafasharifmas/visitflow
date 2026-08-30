import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Menu, Search, UserCircle2, X } from 'lucide-react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import 'leaflet/dist/leaflet.css'
import './App.css'
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
    <main className="page shell-page">
      <AsyncState message="Loading page..." />
    </main>
  )
}

function Header() {
  const navigate = useNavigate()
  const { user, ready, logout } = useAuthStore()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = useMemo(
    () => [
      { to: '/explore', label: 'Explore' },
      { to: '/map', label: 'Map' },
      { to: '/planner', label: 'Planner' },
    ],
    [],
  )

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

  return (
    <header className="site-header">
      <div className="shell shell-header">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Compass size={18} />
          </span>
          <span>
            <strong>Visit Flow</strong>
            <small>Local day visit planner</small>
          </span>
        </Link>

        <form className="global-search" onSubmit={submitSearch} role="search">
          <Search size={18} />
          <input
            aria-label="Search destinations"
            placeholder="Search destinations, beaches, places..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav className="nav-desktop" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
          {ready && user ? (
            <>
              <NavLink to="/saved-trips" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                My Trips
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Profile
              </NavLink>
              {user.role === 'admin' ? (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Admin
                </NavLink>
              ) : null}
              <button className="nav-pill" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link className="nav-pill" to="/login">
              <UserCircle2 size={16} />
              Login
            </Link>
          )}
        </nav>

        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((state) => !state)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="shell mobile-menu-inner">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className="mobile-link" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              {ready && user ? (
                <>
                  <NavLink to="/saved-trips" className="mobile-link" onClick={() => setMenuOpen(false)}>
                    My Trips
                  </NavLink>
                  <NavLink to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>
                    Profile
                  </NavLink>
                  {user.role === 'admin' ? (
                    <NavLink to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>
                      Admin
                    </NavLink>
                  ) : null}
                  <button className="nav-pill mobile-cta" type="button" onClick={handleSignOut}>
                    Sign out
                  </button>
                </>
              ) : (
                <Link className="nav-pill mobile-cta" to="/login" onClick={() => setMenuOpen(false)}>
                  Login
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
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="footer-brand">Visit Flow</div>
          <p>API-driven local tourism discovery for one-day travel plans around your region.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/explore">Places</Link>
          <Link to="/map">Map</Link>
          <Link to="/planner">Planner</Link>
        </div>
        <div>
          <h3>Support</h3>
          <Link to="/login">Account</Link>
          <Link to="/saved-trips">My Trips</Link>
          <Link to="/favourites">Favourites</Link>
        </div>
        <div>
          <h3>Platform</h3>
          <p>Powered by Laravel + MySQL as the source of truth and React for the travel experience.</p>
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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
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
      <div className="app-shell">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
      <Toaster richColors />
    </BrowserRouter>
  )
}