create or replace function public.send_platon_payment(
  receiver_address text,
  send_amount numeric,
  payment_note text default ''
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_user_id uuid;

  clean_receiver_address text;
  clean_note text;

  sender_wallet_id uuid;
  receiver_wallet_id uuid;

  sender_wallet_row public.wallets%rowtype;
  receiver_wallet_row public.wallets%rowtype;

  available_balance numeric(20,8);
begin
  current_user_id :=
    auth.uid();

  if current_user_id is null then
    raise exception
      'Unauthorized';
  end if;

  if
    receiver_address is null
    or trim(receiver_address) = ''
  then
    raise exception
      'Receiver wallet address is required';
  end if;

  clean_receiver_address :=
    trim(receiver_address);

  if
    clean_receiver_address
    not like 'platon_%'
  then
    raise exception
      'Invalid receiver wallet address';
  end if;

  if send_amount is null then
    raise exception
      'Amount is required';
  end if;

  if send_amount::text in (
    'NaN',
    'Infinity',
    '-Infinity'
  ) then
    raise exception
      'Invalid amount';
  end if;

  send_amount :=
    round(send_amount, 8);

  if send_amount <= 0 then
    raise exception
      'Amount must be greater than zero';
  end if;

  clean_note :=
    left(
      coalesce(
        trim(payment_note),
        ''
      ),
      120
    );

  select id
  into sender_wallet_id
  from public.wallets
  where user_id =
    current_user_id;

  if sender_wallet_id is null then
    raise exception
      'Sender wallet not found';
  end if;

  select id
  into receiver_wallet_id
  from public.wallets
  where wallet_address =
    clean_receiver_address;

  if receiver_wallet_id is null then
    raise exception
      'Receiver wallet not found';
  end if;

  if
    sender_wallet_id =
    receiver_wallet_id
  then
    raise exception
      'You cannot send a payment to your own wallet';
  end if;

  perform 1
  from public.wallets
  where id in (
    sender_wallet_id,
    receiver_wallet_id
  )
  order by id
  for update;

  select *
  into sender_wallet_row
  from public.wallets
  where id =
    sender_wallet_id;

  select *
  into receiver_wallet_row
  from public.wallets
  where id =
    receiver_wallet_id;

  if sender_wallet_row.id is null then
    raise exception
      'Sender wallet not found';
  end if;

  if receiver_wallet_row.id is null then
    raise exception
      'Receiver wallet not found';
  end if;

  if
    sender_wallet_row.user_id
    <>
    current_user_id
  then
    raise exception
      'Unauthorized sender wallet';
  end if;

  available_balance :=
    round(
      coalesce(
        sender_wallet_row.balance,
        0
      )
      -
      coalesce(
        sender_wallet_row.locked_platon,
        0
      ),
      8
    );

  if
    available_balance
    <
    send_amount
  then
    raise exception
      'Insufficient available balance';
  end if;

  update public.wallets
  set
    balance =
      coalesce(balance, 0)
      -
      send_amount
  where id =
    sender_wallet_row.id;

  update public.wallets
  set
    balance =
      coalesce(balance, 0)
      +
      send_amount
  where id =
    receiver_wallet_row.id;

  insert into public.transactions (
    sender_id,
    receiver_id,
    sender_wallet,
    receiver_wallet,
    amount,
    type,
    status,
    note
  )
  values (
    current_user_id,
    receiver_wallet_row.user_id,
    sender_wallet_row.wallet_address,
    receiver_wallet_row.wallet_address,
    send_amount,
    'payment',
    'completed',
    clean_note
  );

  return 'success';
end;
$function$;

revoke all
on function public.send_platon_payment(
  text,
  numeric,
  text
)
from public;

revoke all
on function public.send_platon_payment(
  text,
  numeric,
  text
)
from anon;

grant execute
on function public.send_platon_payment(
  text,
  numeric,
  text
)
to authenticated;

grant execute
on function public.send_platon_payment(
  text,
  numeric,
  text
)
to service_role;
