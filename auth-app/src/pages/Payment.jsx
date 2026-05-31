import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../components/Navbar'
import { CheckCircle2, ArrowLeft, Sparkles, ShieldCheck, Loader2, CreditCard, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

export const Payment = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Selection states
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [processing, setProcessing] = useState(false)

  const packages = [
    { 
      id: '5', 
      name: '5 Hari Premium', 
      price: 8000, 
      description: 'Akses instan cepat. Sempurna untuk acara akhir pekan atau event sekali pakai.' 
    },
    { 
      id: '30', 
      name: '30 Hari Premium', 
      price: 30000, 
      description: 'Nilai terbaik. Pilihan ideal untuk kreator konten aktif dan pencinta studio digital.',
      popular: true 
    }
  ]

  const paymentMethods = [
    { 
      id: 'QRIS', 
      name: 'QRIS (Instant Settlement)', 
      fee: 1000, 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg',
      height: 'h-6'
    },
    { 
      id: 'BCA', 
      name: 'BCA Virtual Account', 
      fee: 2500, 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
      height: 'h-5'
    }
  ]

  const benefits = [
    "Akses Tanpa Batas ke Semua Filter & Efek Premium",
    "Unduh Foto Kualitas Resolusi Tinggi (Ultra HD)",
    "Bebas Kustomisasi Bingkai (Custom Overlay & Frames)",
    "Penyimpanan Cloud Aman untuk Hasil Foto Anda",
    "Bebas Iklan dan Watermark MotoBooth"
  ]

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number)
  }

  const handlePayment = () => {
    if (!selectedPackage || !selectedMethod) return
    setProcessing(true)
    
    // Simulate real gateway processing with elegant delay
    setTimeout(() => {
      setProcessing(false)
      toast.success(
        `Pembayaran ${formatRupiah(selectedPackage.price + selectedMethod.fee)} Berhasil! Paket ${selectedPackage.name} Anda kini aktif.`,
        {
          duration: 5000,
          icon: '🎉',
          style: {
            border: '1px solid #10B981',
            padding: '16px',
            color: '#064E3B',
          }
        }
      )
      navigate('/dashboard')
    }, 2500)
  }

  const subtotal = selectedPackage ? selectedPackage.price : 0
  const fee = selectedMethod ? selectedMethod.fee : 0
  const total = subtotal + fee

  return (
    <div className="min-h-screen bg-[#fdfbf7] pb-16">
      {/* Dynamic Top Navbar */}
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 animate-fadeIn">
        
        {/* Navigation back and header */}
        <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Kembali ke Dashboard</span>
          </button>
          
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 border border-amber-100">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Studio Digital Premium</span>
          </div>
        </div>

        {/* Title Block */}
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-500 sm:text-4xl">
            Pembayaran Langganan
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium max-w-2xl">
            Satu langkah lagi untuk membuka potensi penuh kreativitas Anda di MotoBooth. Pilih paket dan selesaikan pembayaran Anda dengan aman.
          </p>
        </div>

        {/* Layout grid */}
        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* LEFT SIDE: Benefits & Packages (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Premium Benefits List */}
            <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-premium backdrop-blur-md">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-5">
                Fitur Premium MotoBooth Yang Didapatkan
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold leading-relaxed text-brand-500">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Package Selector */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Pilih Durasi Paket Premium
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {packages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative flex flex-col justify-between cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected 
                          ? 'border-brand-400 ring-2 ring-brand-400/20 bg-brand-50/20' 
                          : 'border-slate-200/80 hover:border-brand-200'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 right-4 rounded-full bg-brand-400 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white shadow-premium">
                          Populer
                        </span>
                      )}
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-extrabold text-brand-500">{pkg.name}</h4>
                          <span className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                            {isSelected && <span className="h-3 w-3 rounded-full bg-brand-400 animate-scaleIn"></span>}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50">
                        <span className="text-2xl font-black text-brand-500">{formatRupiah(pkg.price)}</span>
                        <span className="text-xs text-slate-400 font-medium"> / paket</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Payment Method & Dynamic Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Pilih Metode Pembayaran
              </h3>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod?.id === method.id
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      className={`flex items-center justify-between cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all duration-150 hover:border-brand-200 hover:shadow-sm ${
                        isSelected 
                          ? 'border-brand-400 ring-2 ring-brand-400/10' 
                          : 'border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0">
                          {isSelected && <span className="h-3 w-3 rounded-full bg-brand-400"></span>}
                        </span>
                        <span className="text-sm font-bold text-brand-500">{method.name}</span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <img 
                          src={method.logo} 
                          alt={method.id} 
                          className={`${method.height} object-contain opacity-90`}
                        />
                        <span className="text-[10px] text-slate-400 font-bold">
                          Admin Fee: {formatRupiah(method.fee)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary Widget */}
            <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-premium backdrop-blur-md space-y-6">
              <h3 className="text-base font-bold text-brand-500 flex items-center gap-2 pb-4 border-b border-slate-100">
                <CreditCard className="h-5 w-5 text-brand-400" />
                Ringkasan Order
              </h3>

              {selectedPackage && selectedMethod ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-semibold">Premium ({selectedPackage.name})</span>
                    <span className="font-extrabold text-brand-500">{formatRupiah(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm pb-4 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Biaya Admin ({selectedMethod.id})</span>
                    <span className="font-extrabold text-brand-500">{formatRupiah(fee)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-brand-500">Total Pembayaran</span>
                    <span className="text-xl font-black text-brand-500">{formatRupiah(total)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-xs font-semibold leading-relaxed">
                    Silakan pilih paket langganan dan metode pembayaran untuk menampilkan rincian tagihan Anda.
                  </p>
                </div>
              )}

              {/* Security guarantee */}
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] leading-relaxed text-slate-400 font-semibold">
                  Semua transaksi diproses secara aman menggunakan protokol enkripsi standar industri. Supabase Auth memastikan data sesi Anda terverifikasi dengan benar.
                </p>
              </div>

              {/* Bayar Action Button */}
              <button
                onClick={handlePayment}
                disabled={!selectedPackage || !selectedMethod || processing}
                className="group relative flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-400 py-3.5 px-4 font-bold text-white shadow-premium transition-all duration-200 hover:bg-brand-400/90 active:scale-98 disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-400"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Memproses Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <span>Bayar Sekarang</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  )
}
