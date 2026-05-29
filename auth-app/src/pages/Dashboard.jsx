import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../components/Navbar'
import { Camera, Image as ImageIcon, History, ShieldCheck, Mail, Calendar, Key } from 'lucide-react'

export const Dashboard = () => {
  const { user } = useAuth()

  // Safely grab user details
  const userMetadata = user?.user_metadata || {}
  const avatarUrl = userMetadata.avatar_url || ''
  const fullName = userMetadata.full_name || user?.email?.split('@')[0] || 'User'
  const email = user?.email || ''
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A'
  
  const authProvider = user?.app_metadata?.provider || 'Google'

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-500 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage your account, view your photos, and create unique experiences.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Column 1 & 2: Main Info & Actions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Action Cards */}
            <div className="grid gap-6 sm:grid-cols-3">
              
              {/* Card 1: Let's photo */}
              <div className="group rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-400 transition-all group-hover:bg-brand-200">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-500">Take a Picture</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">Launch your photobooth camera.</p>
                <a href="/chooseFrame" className="mt-4 inline-flex items-center text-xs font-bold text-brand-400 group-hover:text-brand-300">
                  Start capture →
                </a>
              </div>

              {/* Card 2: Customize Frames */}
              <div className="group rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-400 transition-all group-hover:bg-brand-200">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-500">Manage Frames</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">Upload or customize your templates.</p>
                <a href="/frames" className="mt-4 inline-flex items-center text-xs font-bold text-brand-400 group-hover:text-brand-300">
                  Configure →
                </a>
              </div>

              {/* Card 3: Photo Log */}
              <div className="group rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-premium hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-400 transition-all group-hover:bg-brand-200">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-500">History Log</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">Browse through your taken photos.</p>
                <a href="/history" className="mt-4 inline-flex items-center text-xs font-bold text-brand-400 group-hover:text-brand-300">
                  Open history →
                </a>
              </div>

            </div>

            {/* Premium Info Panel */}
            <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-premium backdrop-blur-md">
              <h2 className="text-lg font-bold text-brand-500 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Authentication Session Verified
              </h2>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                Your connection with Google is encrypted and secured via Supabase Auth. You are fully authenticated to access premium MotoBooth assets, upload templates, and customize framing setups.
              </p>
              
              <div className="mt-6 border-t border-slate-100 pt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Current ID Provider</span>
                  <span className="mt-1 text-sm font-extrabold text-brand-500 flex items-center gap-1.5 capitalize">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    {authProvider}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Session Status</span>
                  <span className="mt-1 text-sm font-extrabold text-brand-500 flex items-center gap-1.5 capitalize">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Persistent
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3: User Details Profile Card */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-white/60 bg-white/70 p-6 shadow-premium backdrop-blur-md">
              
              {/* Profile Card Header */}
              <div className="text-center pb-6 border-b border-slate-100">
                <div className="relative inline-block">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={fullName} 
                      className="mx-auto h-24 w-24 rounded-full border-2 border-brand-200 shadow-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-brand-400">
                      <Camera className="h-10 w-10" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                  </span>
                </div>
                
                <h2 className="mt-4 text-xl font-extrabold text-brand-500">{fullName}</h2>
                <span className="inline-flex mt-1 items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-400 capitalize">
                  {authProvider} Account
                </span>
              </div>

              {/* User Metadata Fields */}
              <div className="mt-6 space-y-4 text-left">
                
                {/* Email Field */}
                <div className="flex items-center space-x-3 text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-semibold text-brand-500 truncate">{email}</p>
                  </div>
                </div>

                {/* Account Created At */}
                <div className="flex items-center space-x-3 text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-semibold text-brand-500">{createdAt}</p>
                  </div>
                </div>

                {/* User ID Field */}
                <div className="flex items-center space-x-3 text-slate-600">
                  <Key className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User UID</p>
                    <p className="text-xs font-mono font-bold text-slate-500 truncate">{user?.id || 'N/A'}</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
