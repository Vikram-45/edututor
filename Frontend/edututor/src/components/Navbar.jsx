import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: '/mcq',
    label: 'Take a Test',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/chatbot',
    label: 'AI Tutor Chat',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function Navbar() {
  const navigate = useNavigate()
  const email = localStorage.getItem('email') || ''
  const role = localStorage.getItem('role') || 'student'

  const navItemsWithRole = [...navItems]
  if (role === 'teacher') {
    navItemsWithRole.push({
      to: '/teacher',
      label: 'Teacher Panel',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path d="M8 6h8M8 10h8M8 14h8M8 18h8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    })
  }

  function handleLogout() {
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 shadow-sm hidden md:flex flex-col">
      <div className="px-7 py-7 border-b border-slate-100">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Edu<span className="text-indigo-600">tutor</span></h2>
        <p className="text-xs text-slate-500 mt-1">Smart learning experience</p>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1">
        {navItemsWithRole.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">
            {email.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-800 truncate">{email || 'Guest'}</p>
            <p className="text-xs text-slate-500">{role === 'teacher' ? 'Teacher' : 'Student'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  )
}
