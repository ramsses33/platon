create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  full_name text,

  email text,

  created_at timestamptz
    default now()
);

alter table public.profiles
  add column if not exists full_name text;

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists created_at timestamptz
    default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid =
      'public.profiles'::regclass
      and contype = 'p'
  ) then
    alter table public.profiles
      add constraint profiles_pkey
      primary key (id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid =
      'public.profiles'::regclass
      and conname =
        'profiles_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id)
      references auth.users(id)
      on delete cascade;
  end if;
end;
$$;

alter table public.profiles
  enable row level security;

revoke all
on table public.profiles
from anon;

grant select, insert, update
on table public.profiles
to authenticated;

grant all
on table public.profiles
to service_role;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname =
        'Users can read own profile'
  ) then
    create policy
      "Users can read own profile"
    on public.profiles
    for select
    to authenticated
    using (
      auth.uid() = id
    );
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname =
        'Users can insert own profile'
  ) then
    create policy
      "Users can insert own profile"
    on public.profiles
    for insert
    to authenticated
    with check (
      auth.uid() = id
    );
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname =
        'Users can update own profile'
  ) then
    create policy
      "Users can update own profile"
    on public.profiles
    for update
    to authenticated
    using (
      auth.uid() = id
    )
    with check (
      auth.uid() = id
    );
  end if;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  generated_wallet_address text;

  clean_full_name text;
begin
  if new.id is null then
    raise exception
      'New user ID is missing';
  end if;

  generated_wallet_address :=
    'platon_'
    ||
    replace(
      new.id::text,
      '-',
      ''
    );

  clean_full_name :=
    nullif(
      left(
        trim(
          coalesce(
            new.raw_user_meta_data
              ->>
              'full_name',
            ''
          )
        ),
        120
      ),
      ''
    );

  insert into public.profiles (
    id,
    full_name,
    email
  )
  values (
    new.id,
    clean_full_name,
    new.email
  )
  on conflict (id)
  do nothing;

  insert into public.wallets (
    user_id,
    wallet_address,
    balance,
    locked_platon,
    usdt_balance,
    locked_usdt
  )
  values (
    new.id,
    generated_wallet_address,
    0,
    0,
    0,
    0
  )
  on conflict (user_id)
  do nothing;

  if not exists (
    select 1
    from public.wallets
    where user_id =
      new.id
      and wallet_address =
        generated_wallet_address
  ) then
    raise exception
      'Unable to create a valid PLATON wallet';
  end if;

  return new;
end;
$function$;

revoke all
on function public.handle_new_user()
from public;

revoke all
on function public.handle_new_user()
from anon;

revoke all
on function public.handle_new_user()
from authenticated;

drop trigger if exists
  on_auth_user_created
on auth.users;

create trigger
  on_auth_user_created
after insert
on auth.users
for each row
execute function
  public.handle_new_user();

insert into public.profiles (
  id,
  full_name,
  email
)
select
  users.id,

  nullif(
    left(
      trim(
        coalesce(
          users.raw_user_meta_data
            ->>
            'full_name',
          ''
        )
      ),
      120
    ),
    ''
  ),

  users.email
from auth.users as users
on conflict (id)
do nothing;
