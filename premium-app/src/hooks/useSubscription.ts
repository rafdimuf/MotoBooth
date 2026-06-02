'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../context/AuthContext';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: string;
  start_date: string;
  end_date: string;
  order_id: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  plan_type: string;
  payment_status: string;
  payment_method: string;
  transaction_time: string;
  created_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCloudData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setIsPremium(false);
      setSubscription(null);
      setPayments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Subscription status
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .maybeSingle();

      if (subError) throw subError;

      if (subData) {
        setSubscription(subData as Subscription);
        setIsPremium(true);
      } else {
        setSubscription(null);
        setIsPremium(false);
      }

      // 2. Fetch Payments history
      const { data: payData, error: payError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (payError) throw payError;

      setPayments(payData as Payment[] || []);

    } catch (e: any) {
      console.error('[Supabase Fetch Error] Gagal sinkronisasi data dari cloud database:', e);
      setError(e.message || 'Gagal sinkronisasi data dari server.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Set up real-time dynamic database listeners to sync statuses instantly across all devices
  useEffect(() => {
    fetchCloudData();

    if (!user) return;

    // Real-time channel for instant sync across devices when table records change
    const channel = supabase
      .channel('realtime_premium_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${user.id}` },
        () => {
          console.log('[Realtime Sync] Detected subscription update. Syncing...');
          fetchCloudData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `user_id=eq.${user.id}` },
        () => {
          console.log('[Realtime Sync] Detected payment history update. Syncing...');
          fetchCloudData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCloudData]);

  return {
    loading,
    isPremium,
    subscription,
    payments,
    error,
    refresh: fetchCloudData
  };
}
export default useSubscription;
