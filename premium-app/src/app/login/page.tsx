'use client';

import React from 'react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      alert('Gagal melakukan login Google: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Memverifikasi otentikasi...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.01)',
        textAlign: 'center',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#42567a',
          marginBottom: '10px',
          letterSpacing: '-0.5px'
        }}>
          MotoBooth Studio
        </div>
        <p style={{
          color: '#64748b',
          fontSize: '15px',
          lineHeight: '1.6',
          marginBottom: '40px'
        }}>
          Masuk untuk sinkronisasi riwayat transaksi, akses premium frame, dan DIY frame saving di seluruh perangkat Anda.
        </p>

        <button 
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            backgroundColor: 'white',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 700,
            color: '#334155',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#94a3b8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.82 2.96C6.18 7.37 8.87 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.02 3.67-8.64z"
            />
            <path
              fill="#FBBC05"
              d="M5.24 14.29c-.25-.76-.4-1.57-.4-2.41s.14-1.65.4-2.41L1.42 6.51C.51 8.32 0 10.36 0 12.5s.51 4.18 1.42 5.99l3.82-2.98z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.13 0-5.82-2.33-6.76-5.46L1.42 15.9C3.37 19.78 7.35 22.46 12 23z"
            />
          </svg>
          Masuk dengan Google
        </button>
      </div>
    </div>
  );
}
export default LoginPage;
