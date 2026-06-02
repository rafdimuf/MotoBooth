-- SQL Schema for MotoBooth Premium Payment & Subscription Syncing
-- Database: Supabase PostgreSQL (auth.users integration)

-- 1. Create Subscriptions Table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_type text not null, -- '5' (5 Hari) atau '30' (30 Hari)
  status text not null, -- 'active', 'expired', 'pending'
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  order_id text not null unique,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS for Subscriptions
alter table public.subscriptions enable row level security;

-- Create Select Policy for Subscriptions
create policy "Users can view own subscriptions"
on public.subscriptions
for select
using (auth.uid() = user_id);

-- Create Index for faster lookup on user_id
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_order_id on public.subscriptions(order_id);


-- 2. Create Payments Table
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  order_id text not null unique,
  amount integer not null,
  plan_type text not null,
  payment_status text not null, -- 'success', 'pending', 'cancel', 'failed'
  payment_method text, -- 'gopay', 'credit_card', 'bank_transfer', etc.
  transaction_time timestamp with time zone,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS for Payments
alter table public.payments enable row level security;

-- Create Select Policy for Payments
create policy "Users can view own payments"
on public.payments
for select
using (auth.uid() = user_id);

-- Create Index for faster lookup on user_id
create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_order_id on public.payments(order_id);


-- 3. Additional Admin Policies (for service role key / webhook updates)
-- Catatan: Supabase service role key mem-bypass RLS secara otomatis pada level serverless backend, 
-- sehingga kueri INSERT/UPDATE dari rute API Webhook Midtrans akan bekerja sempurna secara default.
