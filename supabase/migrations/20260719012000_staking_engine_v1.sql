create table if not exists public.staking_positions (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  staked_balance numeric(20, 8)
    not null
    default 0
    check (staked_balance >= 0),

  accrued_rewards numeric(20, 8)
    not null
    default 0
    check (accrued_rewards >= 0),

  reward_updated_at timestamptz
    not null
    default now(),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);

create table if not exists public.staking_transactions (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  transaction_type text not null
    check (
      transaction_type in (
        'STAKE',
        'UNSTAKE'
      )
    ),

  amount numeric(20, 8)
    not null
    check (amount > 0),

  reward_amount numeric(20, 8)
    not null
    default 0
    check (reward_amount >= 0),

  wallet_balance_after numeric(20, 8)
    not null
    check (wallet_balance_after >= 0),

  staked_balance_after numeric(20, 8)
    not null
    check (staked_balance_after >= 0),

  created_at timestamptz
    not null
    default now()
);

create index if not exists
  staking_transactions_user_created_idx
on public.staking_transactions (
  user_id,
  created_at desc
);

alter table public.staking_positions
enable row level security;

alter table public.staking_transactions
enable row level security;

drop policy if exists
  "Users can read own staking position"
on public.staking_positions;

create policy
  "Users can read own staking position"
on public.staking_positions
for select
to authenticated
using (
  auth.uid() = user_id
);

drop policy if exists
  "Users can read own staking transactions"
on public.staking_transactions;

create policy
  "Users can read own staking transactions"
on public.staking_transactions
for select
to authenticated
using (
  auth.uid() = user_id
);

revoke all privileges
on table public.staking_positions
from anon, authenticated;

revoke all privileges
on table public.staking_transactions
from anon, authenticated;

grant select
on table public.staking_positions
to authenticated;

grant select
on table public.staking_transactions
to authenticated;

create or replace function public.stake_platon(
  stake_amount numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_now timestamptz;
  v_wallet public.wallets%rowtype;
  v_position public.staking_positions%rowtype;
  v_elapsed_seconds numeric;
  v_pending_reward numeric(20, 8);
  v_new_wallet_balance numeric(20, 8);
  v_new_staked_balance numeric(20, 8);
  v_new_accrued_rewards numeric(20, 8);
begin
  v_user_id := auth.uid();
  v_now := clock_timestamp();

  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  if stake_amount is null or stake_amount <= 0 then
    raise exception 'Stake amount must be greater than zero';
  end if;

  if stake_amount <> round(stake_amount, 8) then
    raise exception 'Stake amount supports up to 8 decimal places';
  end if;

  select *
  into v_wallet
  from public.wallets
  where user_id = v_user_id
  for update;

  if not found then
    raise exception 'Wallet not found';
  end if;

  if (
    v_wallet.balance -
    coalesce(v_wallet.locked_platon, 0)
  ) < stake_amount then
    raise exception 'Insufficient available PLATON balance';
  end if;

  insert into public.staking_positions (
    user_id
  )
  values (
    v_user_id
  )
  on conflict (user_id)
  do nothing;

  select *
  into v_position
  from public.staking_positions
  where user_id = v_user_id
  for update;

  v_elapsed_seconds :=
    greatest(
      extract(
        epoch
        from (
          v_now -
          v_position.reward_updated_at
        )
      ),
      0
    )::numeric;

  v_pending_reward :=
    round(
      v_position.staked_balance *
      0.084::numeric *
      v_elapsed_seconds /
      31536000::numeric,
      8
    );

  v_new_wallet_balance :=
    v_wallet.balance -
    stake_amount;

  v_new_staked_balance :=
    v_position.staked_balance +
    stake_amount;

  v_new_accrued_rewards :=
    v_position.accrued_rewards +
    v_pending_reward;

  update public.wallets
  set balance =
    v_new_wallet_balance
  where id =
    v_wallet.id;

  update public.staking_positions
  set
    staked_balance =
      v_new_staked_balance,

    accrued_rewards =
      v_new_accrued_rewards,

    reward_updated_at =
      v_now,

    updated_at =
      v_now
  where user_id =
    v_user_id;

  insert into public.staking_transactions (
    user_id,
    transaction_type,
    amount,
    reward_amount,
    wallet_balance_after,
    staked_balance_after
  )
  values (
    v_user_id,
    'STAKE',
    stake_amount,
    0,
    v_new_wallet_balance,
    v_new_staked_balance
  );

  return jsonb_build_object(
    'success',
    true,

    'transactionType',
    'STAKE',

    'amount',
    stake_amount,

    'walletBalance',
    v_new_wallet_balance,

    'stakedBalance',
    v_new_staked_balance,

    'accruedRewards',
    v_new_accrued_rewards,

    'apr',
    8.4
  );
end;
$$;

create or replace function public.unstake_platon(
  unstake_amount numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_now timestamptz;
  v_wallet public.wallets%rowtype;
  v_position public.staking_positions%rowtype;
  v_elapsed_seconds numeric;
  v_pending_reward numeric(20, 8);
  v_total_reward numeric(20, 8);
  v_new_wallet_balance numeric(20, 8);
  v_new_staked_balance numeric(20, 8);
begin
  v_user_id := auth.uid();
  v_now := clock_timestamp();

  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  if unstake_amount is null or unstake_amount <= 0 then
    raise exception 'Unstake amount must be greater than zero';
  end if;

  if unstake_amount <> round(unstake_amount, 8) then
    raise exception 'Unstake amount supports up to 8 decimal places';
  end if;

  select *
  into v_wallet
  from public.wallets
  where user_id = v_user_id
  for update;

  if not found then
    raise exception 'Wallet not found';
  end if;

  select *
  into v_position
  from public.staking_positions
  where user_id = v_user_id
  for update;

  if not found then
    raise exception 'Staking position not found';
  end if;

  if v_position.staked_balance < unstake_amount then
    raise exception 'Insufficient staked PLATON balance';
  end if;

  v_elapsed_seconds :=
    greatest(
      extract(
        epoch
        from (
          v_now -
          v_position.reward_updated_at
        )
      ),
      0
    )::numeric;

  v_pending_reward :=
    round(
      v_position.staked_balance *
      0.084::numeric *
      v_elapsed_seconds /
      31536000::numeric,
      8
    );

  v_total_reward :=
    v_position.accrued_rewards +
    v_pending_reward;

  v_new_staked_balance :=
    v_position.staked_balance -
    unstake_amount;

  v_new_wallet_balance :=
    v_wallet.balance +
    unstake_amount +
    v_total_reward;

  update public.wallets
  set balance =
    v_new_wallet_balance
  where id =
    v_wallet.id;

  update public.staking_positions
  set
    staked_balance =
      v_new_staked_balance,

    accrued_rewards =
      0,

    reward_updated_at =
      v_now,

    updated_at =
      v_now
  where user_id =
    v_user_id;

  insert into public.staking_transactions (
    user_id,
    transaction_type,
    amount,
    reward_amount,
    wallet_balance_after,
    staked_balance_after
  )
  values (
    v_user_id,
    'UNSTAKE',
    unstake_amount,
    v_total_reward,
    v_new_wallet_balance,
    v_new_staked_balance
  );

  return jsonb_build_object(
    'success',
    true,

    'transactionType',
    'UNSTAKE',

    'amount',
    unstake_amount,

    'rewardPaid',
    v_total_reward,

    'walletBalance',
    v_new_wallet_balance,

    'stakedBalance',
    v_new_staked_balance,

    'accruedRewards',
    0,

    'apr',
    8.4
  );
end;
$$;

create or replace function public.get_staking_summary()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_now timestamptz;
  v_wallet public.wallets%rowtype;
  v_position public.staking_positions%rowtype;
  v_elapsed_seconds numeric;
  v_pending_reward numeric(20, 8);
  v_total_reward numeric(20, 8);
begin
  v_user_id := auth.uid();
  v_now := clock_timestamp();

  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select *
  into v_wallet
  from public.wallets
  where user_id = v_user_id;

  if not found then
    raise exception 'Wallet not found';
  end if;

  select *
  into v_position
  from public.staking_positions
  where user_id = v_user_id;

  if not found then
    return jsonb_build_object(
      'walletBalance',
      v_wallet.balance,

      'availableWalletBalance',
      v_wallet.balance -
      coalesce(
        v_wallet.locked_platon,
        0
      ),

      'stakedBalance',
      0,

      'accruedRewards',
      0,

      'apr',
      8.4
    );
  end if;

  v_elapsed_seconds :=
    greatest(
      extract(
        epoch
        from (
          v_now -
          v_position.reward_updated_at
        )
      ),
      0
    )::numeric;

  v_pending_reward :=
    round(
      v_position.staked_balance *
      0.084::numeric *
      v_elapsed_seconds /
      31536000::numeric,
      8
    );

  v_total_reward :=
    v_position.accrued_rewards +
    v_pending_reward;

  return jsonb_build_object(
    'walletBalance',
    v_wallet.balance,

    'availableWalletBalance',
    v_wallet.balance -
    coalesce(
      v_wallet.locked_platon,
      0
    ),

    'stakedBalance',
    v_position.staked_balance,

    'accruedRewards',
    v_total_reward,

    'apr',
    8.4
  );
end;
$$;

revoke all
on function public.stake_platon(numeric)
from public, anon, authenticated;

revoke all
on function public.unstake_platon(numeric)
from public, anon, authenticated;

revoke all
on function public.get_staking_summary()
from public, anon, authenticated;

grant execute
on function public.stake_platon(numeric)
to authenticated;

grant execute
on function public.unstake_platon(numeric)
to authenticated;

grant execute
on function public.get_staking_summary()
to authenticated;