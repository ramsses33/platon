create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete set null,
  receiver_id uuid references auth.users(id) on delete set null,
  sender_wallet text,
  receiver_wallet text not null,
  amount numeric(20,8) not null,
  type text not null default 'transfer',
  status text not null default 'completed',
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

drop policy if exists "Users can read own transactions" on public.transactions;

create policy "Users can read own transactions"
on public.transactions
for select
using (
  auth.uid() = sender_id
  or auth.uid() = receiver_id
);

create or replace function public.send_platon(
  receiver_address text,
  send_amount numeric
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  sender_wallet_row public.wallets;
  receiver_wallet_row public.wallets;
begin
  if send_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  select * into sender_wallet_row
  from public.wallets
  where user_id = auth.uid();

  if sender_wallet_row.id is null then
    raise exception 'Sender wallet not found';
  end if;

  if sender_wallet_row.balance < send_amount then
    raise exception 'Insufficient balance';
  end if;

  select * into receiver_wallet_row
  from public.wallets
  where wallet_address = receiver_address;

  if receiver_wallet_row.id is null then
    raise exception 'Receiver wallet not found';
  end if;

  update public.wallets
  set balance = balance - send_amount
  where id = sender_wallet_row.id;

  update public.wallets
  set balance = balance + send_amount
  where id = receiver_wallet_row.id;

  insert into public.transactions (
    sender_id,
    receiver_id,
    sender_wallet,
    receiver_wallet,
    amount,
    type,
    status
  )
  values (
    auth.uid(),
    receiver_wallet_row.user_id,
    sender_wallet_row.wallet_address,
    receiver_address,
    send_amount,
    'transfer',
    'completed'
  );

  return 'success';
end;
$$;

grant execute on function public.send_platon(text, numeric) to authenticated;