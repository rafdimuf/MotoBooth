import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { snap } from '../../../lib/midtrans';

export async function POST(request: Request) {
  try {
    // 1. Validasi otentikasi pengguna menggunakan cookie-based Supabase client
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { status: 'error', message: 'Anda harus login terlebih dahulu untuk melakukan pembayaran.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { plan_type } = await request.json();

    if (!plan_type || (plan_type !== '5' && plan_type !== '30')) {
      return NextResponse.json(
        { status: 'error', message: 'Paket langganan tidak valid.' },
        { status: 400 }
      );
    }

    // 2. Tentukan harga dan nama paket
    let amount = 0;
    let planName = '';

    if (plan_type === '5') {
      amount = 8000;
      planName = 'MotoBooth Premium 5 Hari';
    } else {
      amount = 30000;
      planName = 'MotoBooth Premium 30 Hari';
    }

    // 3. Hasilkan order_id unik: MB-[timestamp]-[random]
    const orderId = `MB-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // 4. Siapkan parameter Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      item_details: [
        {
          id: `premium_${plan_type}d`,
          price: amount,
          quantity: 1,
          name: planName
        }
      ],
      customer_details: {
        email: session.user.email,
        first_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
      },
      credit_card: {
        secure: true
      }
    };

    // 4. Pre-save pending payment ke database Supabase secara aman menggunakan supabaseAdmin
    const { supabaseAdmin } = await import('../../../lib/supabase/admin');
    const { error: dbError } = await supabaseAdmin.from('payments').insert({
      user_id: userId,
      order_id: orderId,
      amount: amount,
      plan_type: plan_type,
      payment_status: 'pending',
      created_at: new Date().toISOString()
    });

    if (dbError) throw dbError;

    // 5. Buat Snap Transaction di server Midtrans secara aman
    const transaction = await snap.createTransaction(parameter);

    console.log(`[Next.js Checkout] Transaksi dibuat & disimpan ke DB: ${orderId}. Token: ${transaction.token}`);

    return NextResponse.json({
      status: 'success',
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
      gross_amount: amount
    });

  } catch (error: any) {
    console.error('[Next.js Checkout API Error] Gagal memproses transaksi:', error);
    return NextResponse.json(
      { status: 'error', message: 'Gagal membuat invoice transaksi di server.', error: error.message },
      { status: 500 }
    );
  }
}
