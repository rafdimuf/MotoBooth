'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
        border: '1px solid rgba(0,0,0,0.03)'
      }}>
        <div style={{ color: '#ef4444', fontSize: '64px', marginBottom: '20px' }}>
          <i className="fa-solid fa-lock" />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1e293b', margin: '0 0 15px 0', letterSpacing: '-0.5px' }}>
          Akses Premium Dibatasi
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '35px' }}>
          Maaf, halaman ini hanya dapat diakses oleh anggota Premium aktif MotoBooth. Aktifkan langganan awan Anda untuk menggunakan seluruh fitur studio.
        </p>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{
              flex: 1,
              backgroundColor: '#f1f5f9',
              color: '#475569',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontWeight: 700,
              fontSize: '14.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Kembali
          </button>
          <button 
            onClick={() => router.push('/pricing')}
            style={{
              flex: 1,
              backgroundColor: '#3ca55c',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontWeight: 800,
              fontSize: '14.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(60, 165, 92, 0.2)'
            }}
          >
            Upgrade Premium
          </button>
        </div>
      </div>
    </div>
  );
}
export default UnauthorizedPage;
