import { Compass, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-slate-300">
      <div className="shell grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-ocean-500 to-nature-500 text-white">
              <Compass size={18} />
            </span>
            <strong className="text-lg font-extrabold text-white">Visit Flow</strong>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Local tourist day-visit planning. Discover beaches, culture, nature, and hidden local places.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Explore</h3>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <li><Link className="transition-colors hover:text-white" to="/explore">Places</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/map">Map</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/planner">Planner</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Support</h3>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <li><Link className="transition-colors hover:text-white" to="/login">Account</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/saved-trips">My Trips</Link></li>
            <li><Link className="transition-colors hover:text-white" to="/favourites">Favourites</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Contact</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-slate-400">
            <li className="flex items-center gap-2"><Mail size={15} className="text-ocean-400" /> support@visitflow.test</li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-ocean-400" /> +94 00 000 0000</li>
          </ul>
          <p className="mt-5 text-xs text-slate-500">React experience · Laravel + MySQL data</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Visit Flow. All rights reserved.</span>
          <span>Crafted for local one-day tourism discovery.</span>
        </div>
      </div>
    </footer>
  )
}