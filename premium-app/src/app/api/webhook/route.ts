import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('[Midtrans Webhook] Received payload:', JSON.stringify(payload));

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_time
    } = payload;

    // 1. Verifikasi tanda tangan kriptografi (Signature Key) dari Midtrans
    // Rumus: SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const verifyString = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const computedSignature = crypto
      .createHash('sha512')
      .update(verifyString)
      .digest('hex');

    if (computedSignature !== signature_key) {
      console.error(`[Midtrans Webhook] Verifikasi Gagal! Signature key tidak cocok. Order ID: ${order_id}`);
      return NextResponse.json(
        { status: 'error', message: 'Tanda tangan transaksi tidak valid.' },
        { status: 401 }
      );
    }

    console.log(`[Midtrans Webhook] Verifikasi Berhasil untuk Order ID: ${order_id}`);

    // 2. Ambil catatan transaksi pending dari database untuk mendapatkan user_id
    const { data: existingPayment, error: fetchError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle();

    if (fetchError || !existingPayment) {
      console.error(`[Midtrans Webhook] Transaksi tidak ditemukan di DB. Order ID: ${order_id}`, fetchError);
      return NextResponse.json(
        { status: 'error', message: 'Transaksi tagihan tidak ditemukan di database.' },
        { status: 404 }
      );
    }

    const userId = existingPayment.user_id;
    const planType = existingPayment.plan_type;

    // 3. Tentukan status pembayaran akhir
    let finalPaymentStatus = 'pending';
    let isSuccess = false;

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      finalPaymentStatus = 'success';
      isSuccess = true;
    } else if (transaction_status === 'pending') {
      finalPaymentStatus = 'pending';
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'refund'
    ) {
      finalPaymentStatus = 'cancel';
    }

    // 4. Update tabel payments secara aman (Bypass RLS via admin client)
    const { error: payUpdateError } = await supabaseAdmin
      .from('payments')
      .update({
        payment_status: finalPaymentStatus,
        payment_method: payment_type,
        transaction_time: transaction_time ? new Date(transaction_time).toISOString() : new Date().toISOString()
      })
      .eq('order_id', order_id);

    if (payUpdateError) throw payUpdateError;

    // 5. Aktifkan/Update status subscription jika pembayaran sukses
    if (isSuccess) {
      const durationDays = planType === '5' ? 5 : 30;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + durationDays);

      // Gunakan upsert pada order_id agar tidak terjadi data ganda saat webhook terpanggil berulang kali
      const { error: subUpsertError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_type: planType,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          order_id: order_id
        }, {
          onConflict: 'order_id'
        });

      if (subUpsertError) throw subUpsertError;
      console.log(`[Midtrans Webhook] Subscription diaktifkan untuk user ${userId} selama ${durationDays} hari. Order ID: ${order_id}`);
    } else if (finalPaymentStatus === 'cancel') {
      // Jika dibatalkan, update status subscription terkait jika ada
      const { error: subCancelError } = await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('order_id', order_id);

      if (subCancelError) console.warn('[Midtrans Webhook] Gagal membatalkan subscription:', subCancelError.message);
    }

    return NextResponse.json({ status: 'success', message: 'Notifikasi webhook diproses sempurna.' });

  } catch (error: any) {
    console.error('[Midtrans Webhook Error] Gagal memproses webhook:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error.', error: error.message },
      { status: 500 }
    );
  }
}
