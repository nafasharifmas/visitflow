import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Menu, Search, UserCircle2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, ready, logout } = useAuthStore()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
      isActive ? 'bg-ocean-50 text-ocean-600' : 'text-muted hover:text-ocean-600',
    )

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled ? 'border-b border-line bg-sand/85 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl' : 'bg-sand/70 backdrop-blur-md',
      )}
    >
      <div className="shell grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-5">
        <Link to="/" className="flex items-center gap-3" aria-label="Visit Flow home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-ocean-600 to-nature-600 text-white shadow-[0_12px_24px_rgba(2,132,199,0.28)]">
            <Compass size={20} />
          </span>
          <span className="hidden leading-tight sm:block">
            <strong className="block text-base font-extrabold">Visit Flow</strong>
            <small className="block text-xs font-medium text-muted">Local day visit planner</small>
          </span>
        </Link>

        <form role="search" onSubmit={submitSearch} className="mx-auto hidden w-full max-w-[500px] md:block">
          <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition focus-within:border-ocean-400 focus-within:ring-4 focus-within:ring-ocean-600/15">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              aria-label="Search destinations, beaches, places"
              placeholder="Search destinations, beaches, places..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
            />
          </label>
        </form>

        <nav className="flex items-center justify-end gap-1" aria-label="Primary">
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            {ready && user ? (
              <>
                <NavLink to="/saved-trips" className={linkClass}>
                  My Trips
                </NavLink>
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>
                {user.role === 'admin' ? (
                  <NavLink to="/admin" className={linkClass}>
                    Admin
                  </NavLink>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="ml-1 inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-bold transition-all hover:scale-105"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="ml-1 inline-flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-br from-ocean-600 to-sky-500 px-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(2,132,199,0.25)] transition-all hover:scale-105"
              >
                <UserCircle2 size={16} />
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((state) => !state)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="border-t border-line bg-sand/95 backdrop-blur-xl lg:hidden"
          >
            <div className="shell grid gap-2 py-4">
              <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4">
                <Search size={18} className="shrink-0 text-muted" />
                <input
                  aria-label="Search destinations, beaches, places"
                  placeholder="Search destinations, beaches, places..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-2xl bg-white px-4 py-3 font-bold',
                      isActive ? 'text-ocean-600' : 'text-ink',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {ready && user ? (
                <>
                  <NavLink to="/saved-trips" className="rounded-2xl bg-white px-4 py-3 font-bold">
                    My Trips
                  </NavLink>
                  <NavLink to="/profile" className="rounded-2xl bg-white px-4 py-3 font-bold">
                    Profile
                  </NavLink>
                  {user.role === 'admin' ? (
                    <NavLink to="/admin" className="rounded-2xl bg-white px-4 py-3 font-bold">
                      Admin
                    </NavLink>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="h-11 rounded-full bg-ink px-4 font-bold text-white"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" className="h-11 rounded-full bg-ocean-600 px-4 py-3 text-center font-bold text-white">
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