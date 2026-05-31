import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Payment } from './pages/Payment'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AuthProvider>
      {/* Toast Notification Provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'font-sans font-semibold text-sm text-brand-500 rounded-xl shadow-premium border border-slate-100 bg-white/90 backdrop-blur-sm',
          duration: 4000,
          style: {
            padding: '12px 16px',
          },
        }}
      />
      
      {/* App Router */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />
          {/* Catch-all redirect to Dashboard (which will auto-guard to login if unauthenticated) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
