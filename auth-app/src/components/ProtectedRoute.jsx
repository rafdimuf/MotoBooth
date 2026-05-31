import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      // Trigger elegant toast notification once
      toast.error("Silakan login terlebih dahulu untuk melanjutkan pembayaran", {
        id: "auth-guard-redirect"
      })
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7]">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Custom Elegant Spinner */}
          <div className="relative h-16 w-16">
            <div className="absolute h-full w-full rounded-full border-4 border-brand-200 opacity-20"></div>
            <div className="absolute h-full w-full animate-spin rounded-full border-4 border-brand-400 border-t-transparent"></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-brand-500">MotoBooth Secure</h3>
            <p className="text-xs text-slate-400">Verifying session...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login while preserving the current route
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
