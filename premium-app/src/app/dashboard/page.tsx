'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { payments, isPremium, subscription, loading: subLoading, error } = useSubscription();
  const router = useRouter();

  const handleSignOut = async () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      await signOut();
      router.replace('/login');
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || subLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Menghubungkan ke Cloud Database...</p>
      </div>
    );
  }

  const userAvatar = user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f1f5f9' }}>
      
      {/* Sidebar Navigation */}
      <div style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#42567a', letterSpacing: '-0.5px' }}>
          <i className="fa-solid fa-camera-retro" style={{ marginRight: '8px' }} /> MotoBooth
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={userAvatar} 
            alt={userName} 
            referrerPolicy="no-referrer"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userName}</div>
            <div style={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
          </div>
        </div>

        {/* Navigation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#f1f5f9',
            color: '#3ca55c',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14.5px',
            textAlign: 'left',
            cursor: 'pointer'
          }}>
            <i className="fa-solid fa-gauge" style={{ width: '20px' }} /> Dashboard
          </button>

          <button 
            onClick={() => router.push('/pricing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: '#475569',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14.5px',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-crown" style={{ width: '20px' }} /> Beli Paket
          </button>
        </div>

        <button 
          onClick={handleSignOut}
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: '#ef4444',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14.5px',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-right-from-bracket" style={{ width: '20px' }} /> Logout
        </button>
      </div>

      {/* Main Panel Content */}
      <div style={{ flexGrow: 1, padding: '40px 50px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: '0 0 30px 0' }}>Panel Dashboard</h2>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', padding: '15px 20px', borderRadius: '12px', marginBottom: '30px', fontSize: '14px' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }} /> {error}
          </div>
        )}

        {/* Real-time Premium Card */}
        <div style={{
          background: isPremium 
            ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)' 
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '24px',
          padding: '40px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
        }}>
          {/* Sparkles background */}
          <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.15, pointerEvents: 'none', fontSize: '180px', transform: 'translate(40px, -40px)' }}>
            <i className="fa-solid fa-crown" />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              backgroundColor: isPremium ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: '100px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px'
            }}>
              {isPremium ? 'AKUN PREMIUM' : 'AKUN GRATIS (FREE)'}
            </span>

            {isPremium && subscription ? (
              <div style={{ marginTop: '25px' }}>
                <h3 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 10px 0' }}>MotoBooth Premium {subscription.plan_type === '5' ? '5 Hari' : '30 Hari'}</h3>
                <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>
                  Masa Aktif: <span style={{ fontWeight: 700 }}>{formatDate(subscription.start_date)}</span> s.d. <span style={{ fontWeight: 700 }}>{formatDate(subscription.end_date)}</span>
                </p>
                <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
                  <span style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '8px', fontWeight: 600 }}>
                    Order ID: {subscription.order_id}
                  </span>
                  <span style={{ fontSize: '13px', backgroundColor: '#3ca55c', padding: '6px 14px', borderRadius: '8px', fontWeight: 800 }}>
                    <i className="fa-solid fa-circle-check" /> Cloud Synced
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '25px' }}>
                <h3 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 15px 0' }}>Beralih ke Premium</h3>
                <p style={{ margin: '0 0 30px 0', fontSize: '15px', opacity: 0.8, maxWidth: '500px', lineHeight: '1.6' }}>
                  Buka akses seluruh frame premium kreatif, DIY frame, filter khusus, stiker, dan nikmati fitur sinkronisasi cloud real-time di HP dan Laptop Anda.
                </p>
                <button 
                  onClick={() => router.push('/pricing')}
                  style={{
                    backgroundColor: '#3ca55c',
                    color: 'white',
                    border: 'none',
                    padding: '14px 35px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '14.5px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(60,165,92,0.3)'
                  }}
                >
                  Langganan Sekarang
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cloud database payment history section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '35px 30px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: '0 0 25px 0' }}>
            <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '8px', color: '#64748b' }} /> Riwayat Transaksi (Cloud Database)
          </h3>

          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <i className="fa-solid fa-receipt" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '15px' }} />
              <p style={{ margin: 0, fontSize: '14.5px', fontWeight: 600 }}>Belum ada riwayat transaksi.</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12.5px', color: '#94a3b8' }}>Seluruh transaksi Anda di awan database akan terdaftar di sini secara instan.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #cbd5e1', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '12px 10px' }}>Order ID</th>
                    <th style={{ padding: '12px 10px' }}>Paket</th>
                    <th style={{ padding: '12px 10px' }}>Metode</th>
                    <th style={{ padding: '12px 10px' }}>Tanggal</th>
                    <th style={{ padding: '12px 10px' }}>Nominal</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                      <td style={{ padding: '16px 10px', fontFamily: 'monospace', fontWeight: 600 }}>{payment.order_id}</td>
                      <td style={{ padding: '16px 10px' }}>
                        {payment.plan_type === '5' ? 'Premium 5 Hari' : 'Premium 30 Hari'}
                      </td>
                      <td style={{ padding: '16px 10px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        {payment.payment_method || 'MIDTRANS'}
                      </td>
                      <td style={{ padding: '16px 10px', color: '#64748b' }}>{formatDate(payment.created_at)}</td>
                      <td style={{ padding: '16px 10px', fontWeight: 700 }}>{formatRupiah(payment.amount)}</td>
                      <td style={{ padding: '16px 10px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: payment.payment_status === 'success' ? '#dcfce7' : payment.payment_status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: payment.payment_status === 'success' ? '#166534' : payment.payment_status === 'pending' ? '#92400e' : '#991b1b',
                          padding: '4px 12px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'capitalize'
                        }}>
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
