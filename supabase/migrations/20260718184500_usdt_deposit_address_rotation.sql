begin;

alter table public.usdt_deposit_addresses
drop constraint if exists
  usdt_deposit_addresses_user_network_key;

create unique index
if not exists
  usdt_deposit_addresses_one_active_user_network_idx
on public.usdt_deposit_addresses (
  user_id,
  network
)
where is_active = true;

commit;