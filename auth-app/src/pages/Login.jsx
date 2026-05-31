import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AlertCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export const Login = () => {
  const { user, loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // If user session already exists, auto redirect to intended route or dashboard
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard'
      const search = location.state?.from?.search || ''
      navigate(from + search, { replace: true })
    }
  }, [user, navigate, location])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await loginWithGoogle()
      // Note: redirection will be handled by Supabase OAuth flow to Google and back
    } catch (err) {
      setLoading(false)
      const errorMsg = err.message || "Failed to initialize Google Login"
      toast.error(errorMsg)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Premium Ambient Gradients */}
      <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"></div>
      <div className="absolute -right-48 -bottom-48 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl"></div>

      {/* Main card wrapper */}
      <div className="relative w-full max-w-md transform transition-all duration-300">
        <div className="rounded-2xl border border-white/60 bg-white/70 p-8 shadow-premium backdrop-blur-md sm:p-10">
          
          {/* Brand Logo & Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-400 text-white font-extrabold text-2xl shadow-premium animate-bounce">
              M
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-brand-500">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Start your premium photo journey with MotoBooth
            </p>
          </div>

          {/* Core Sign-In Container */}
          <div className="mt-8 space-y-4">
            
            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group relative flex w-full items-center justify-center space-x-3 rounded-xl border border-slate-200 bg-white py-3.5 px-4 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-98 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-400 border-t-transparent"></div>
              ) : (
                /* High Fidelity Google SVG Logo */
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.84-4.53z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span className="text-sm font-bold">
                {loading ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            {/* Privacy Guarantee Note */}
            <p className="text-center text-xs text-slate-400 font-medium">
              We value your privacy. We will never post or share private data.
            </p>
          </div>

          {/* Visual Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-3 text-[10px] font-bold text-slate-400 tracking-wider">
                Digital Studio
              </span>
            </div>
          </div>

          {/* Quick Info card */}
          <div className="mt-6 rounded-xl bg-brand-50 p-4 border border-brand-100/50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="mt-0.5 h-4 w-4 text-brand-300 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-brand-500">Google OAuth Setup</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400 font-medium">
                  Ensure you configure your Redirect URLs in your Supabase Dashboard to point to your live domain or <code>http://localhost:3000</code>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
