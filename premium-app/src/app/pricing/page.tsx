'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSubscription } from '../../hooks/useSubscription';

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function PricingPage() {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription();
  const router = useRouter();
  
  const [selectedPlan, setSelectedPlan] = useState<'5' | '30'>('5');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 1. Muat skrip Snap JS Midtrans secara dinamis pada saat render halaman
  useEffect(() => {
    const midtransScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';

    const script = document.createElement('script');
    script.src = midtransScriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert('Anda harus login terlebih dahulu.');
      router.push('/login');
      return;
    }

    if (!scriptLoaded) {
      alert('Skrip gerbang pembayaran Midtrans sedang dimuat, silakan coba beberapa saat lagi.');
      return;
    }

    try {
      setCheckoutLoading(true);

      // Panggil rute API serverless Next.js secure checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_type: selectedPlan })
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Gagal memulai pemrosesan checkout.');
      }

      // Triger modal pembayaran Midtrans Snap secara instan di browser
      window.snap.pay(data.snap_token, {
        onSuccess: (result: any) => {
          console.log('[Midtrans Snap] Pembayaran sukses:', result);
          alert('Pembayaran sukses! Keanggotaan premium Anda langsung aktif.');
          router.push('/dashboard');
        },
        onPending: (result: any) => {
          console.log('[Midtrans Snap] Menunggu pembayaran:', result);
          alert('Pesanan pending, silakan selesaikan pembayaran Anda.');
          router.push('/dashboard');
        },
        onError: (result: any) => {
          console.error('[Midtrans Snap] Kesalahan pembayaran:', result);
          alert('Terjadi kesalahan selama proses pembayaran.');
          setCheckoutLoading(false);
        },
        onClose: () => {
          console.log('[Midtrans Snap] Modal ditutup oleh user');
          setCheckoutLoading(false);
        }
      });

    } catch (e: any) {
      alert('Kesalahan checkout: ' + e.message);
      setCheckoutLoading(false);
    }
  };

  if (authLoading || subLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Memuat halaman paket...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '60px 20px', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Paket Langganan
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#1e293b', marginTop: '15px', marginBottom: '15px' }}>
            Buka Keunggulan Premium MotoBooth
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '580px', margin: '0 auto' }}>
            Beralih ke Premium dan nikmati sinkronisasi awan otomatis di semua perangkat Anda. Tanpa batasan lokal.
          </p>
        </div>

        {isPremium && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '45px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#166534'
          }}>
            <i className="fa-solid fa-crown" style={{ fontSize: '24px', color: '#15803d' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Anda adalah Anggota Premium Aktif!</div>
              <div style={{ fontSize: '13.5px', opacity: 0.85 }}>Seluruh frame premium, DIY saving, dan studio filter telah terbuka. Nikmati kemudahan akses di Laptop dan HP Anda.</div>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              style={{
                marginLeft: 'auto',
                backgroundColor: '#16803d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13.5px'
              }}
            >
              Ke Dashboard
            </button>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {/* Plan 1: 5 Days */}
          <div 
            onClick={() => setSelectedPlan('5')}
            style={{
              backgroundColor: 'white',
              border: selectedPlan === '5' ? '2.5px solid #3ca55c' : '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '35px 30px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease',
              boxShadow: selectedPlan === '5' ? '0 10px 25px rgba(60, 165, 92, 0.08)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#1e293b' }}>5 Hari Premium</h3>
              <input 
                type="radio" 
                name="plan" 
                checked={selectedPlan === '5'} 
                onChange={() => setSelectedPlan('5')} 
                style={{ width: '18px', height: '18px', accentColor: '#3ca55c' }}
              />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', marginBottom: '15px' }}>
              Rp8.000 <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>/ paket</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
              Pilihan ideal untuk acara akhir pekan atau sesi photostrip santai bersama teman-teman terdekat.
            </p>
            <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, color: '#475569', fontSize: '13.5px' }}>
              <li style={{ marginBottom: '10px' }}><i className="fa-solid fa-circle-check" style={{ color: '#3ca55c', marginRight: '8px' }} /> Akses seluruh Frame Premium 6-9</li>
              <li style={{ marginBottom: '10px' }}><i className="fa-solid fa-circle-check" style={{ color: '#3ca55c', marginRight: '8px' }} /> DIY Frame Custom & Stiker Bebas</li>
              <li style={{ marginBottom: '10px' }}><i className="fa-solid fa-circle-check" style={{ color: '#3ca55c', marginRight: '8px' }} /> Sinkronisasi Awan instan multi-device</li>
            </ul>
          </div>

          {/* Plan 2: 30 Days */}
          <div 
            onClick={() => setSelectedPlan('30')}
            style={{
              backgroundColor: 'white',
              border: selectedPlan === '30' ? '2.5px solid #3ca55c' : '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '35px 30px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease',
              boxShadow: selectedPlan === '30' ? '0 10px 25px rgba(60, 165, 92, 0.08)' : 'none'
            }}
          >
            <div style={{ position: 'absolute', top: '-14px', right: '30px', backgroundColor: '#e11d48', color: 'white', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', letterSpacing: '0.5px' }}>TERPOPULER</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#1e293b' }}>30 Hari Premium</h3>
              <input 
                type="radio" 
                name="plan" 
                checked={selectedPlan === '30'} 
                onChange={() => setSelectedPlan('30')}
                style={{ width: '18px', height: '18px', accentColor: '#3ca55c' }}
              />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', marginBottom: '15px' }}>
              Rp30.000 <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>/ paket</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
              Solusi bulanan tak terbatas untuk studio booth pribadi, bebas cetak, dan kreasi stiker tak terbatas.
            </p>
            <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, color: '#475569', fontSize: '13.5px' }}>
              <li style={{ marginBottom: '10px' }}><i className="fa-solid fa-circle-check" style={{ color: '#3ca55c', marginRight: '8px' }} /> Seluruh keuntungan paket 5 hari</li>
              <li style={{ marginBottom: '10px' }}><i className="fa-solid fa-circle-check" style={{ color: '#3ca55c', marginRight: '8px' }} /> Galeri awan "Frameku" & "Fotoku" aktif</li>
              <li style={{ marginBottom: '10px' }}><i className="fa-solid fa-circle-check" style={{ color: '#3ca55c', marginRight: '8px' }} /> Hemat lebih dari 35% dibanding harian</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleCheckout}
            disabled={checkoutLoading}
            style={{
              backgroundColor: '#3ca55c',
              color: 'white',
              border: 'none',
              padding: '16px 80px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '16px',
              cursor: checkoutLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(60, 165, 92, 0.2)'
            }}
            onMouseOver={(e) => {
              if (!checkoutLoading) e.currentTarget.style.backgroundColor = '#2d8146';
            }}
            onMouseOut={(e) => {
              if (!checkoutLoading) e.currentTarget.style.backgroundColor = '#3ca55c';
            }}
          >
            {checkoutLoading ? 'Memproses checkout...' : 'Beli Paket Premium Sekarang'}
          </button>
          <p style={{ color: '#64748b', fontSize: '12.5px', marginTop: '15px' }}>
            Gerbang pembayaran aman dienkripsi oleh <span style={{ fontWeight: 700, color: '#475569' }}>Midtrans</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
export default PricingPage;
