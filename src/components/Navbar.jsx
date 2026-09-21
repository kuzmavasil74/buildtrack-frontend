import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { logout as apiLogout } from '../api/api.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'

const linkClasses = (active) =>
  `block whitespace-nowrap px-2.5 py-2 rounded-lg text-sm font-medium transition ${
    active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const links = [
    { to: '/dashboard', label: t('nav.newRecord') },
    { to: '/records', label: t('nav.records') },
    { to: '/crews', label: t('nav.crews') },
    { to: '/sites', label: t('nav.sites') },
    { to: '/receipts', label: t('nav.receipts') },
  ]

  const handleLogout = async () => {
    setOpen(false)
    await apiLogout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-2">
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <img src="/logo-sanjo.svg" alt={t('app.name')} className="h-7 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto min-w-0">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={linkClasses(location.pathname === link.to)}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher className="ml-2 shrink-0" />
            <button
              onClick={handleLogout}
              className="ml-1 shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              {t('nav.logout')}
            </button>
          </nav>

          <button
            type="button"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={linkClasses(location.pathname === link.to)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 pt-1">
              <LanguageSwitcher className="w-full" />
            </div>
            <button
              onClick={handleLogout}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              {t('nav.logout')}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar
