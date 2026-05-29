import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Successfully logged out!")
    } catch (err) {
      toast.error(err.message || "Failed to log out")
    }
  }

  // Get user profile details safely
  const userMetadata = user?.user_metadata || {}
  const avatarUrl = userMetadata.avatar_url || ''
  const fullName = userMetadata.full_name || user?.email?.split('@')[0] || 'User'
  const email = user?.email || ''

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e6e6e6] bg-[#fcfcfc]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-4">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400 text-white font-extrabold text-lg shadow-premium">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-400">
              Moto<span className="text-brand-500 font-extrabold">Booth</span>
            </span>
          </div>

          {/* Desktop User Info & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-3 rounded-full border border-slate-100 bg-white py-1.5 pl-2.5 pr-4 shadow-sm">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={fullName} 
                  className="h-8 w-8 rounded-full border border-brand-200 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-400">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="text-left leading-none">
                <p className="text-xs font-semibold text-brand-500">{fullName}</p>
                <p className="text-[10px] text-slate-400 max-w-[120px] truncate">{email}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 rounded-lg bg-brand-100 px-4 py-2 text-xs font-bold text-brand-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-500 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e6e6e6] bg-[#fcfcfc] px-4 py-4 md:hidden shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-3 mb-4 rounded-xl bg-slate-50 p-3">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={fullName} 
                className="h-12 w-12 rounded-full border border-brand-200 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-400">
                <User className="h-6 w-6" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-brand-500">{fullName}</p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  )
}
