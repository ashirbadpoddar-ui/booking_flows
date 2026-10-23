create extension if not exists btree_gist;

create type public.user_role as enum ('customer', 'staff', 'admin');
create type public.booking_status as enum ('confirmed', 'completed', 'cancelled', 'no-show');

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'Europe/Warsaw',
  currency char(3) not null default 'PLN',
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text not null default '',
  duration_minutes integer not null check (duration_minutes between 10 and 480),
  price numeric(10,2) not null check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid unique references public.profiles(id) on delete set null,
  name text not null,
  role_title text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.staff_services (
  staff_id uuid not null references public.staff(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (staff_id, service_id)
);

create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (start_time < end_time),
  unique (staff_id, weekday, start_time, end_time)
);

create table public.blocked_periods (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  check (start_at < end_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  guest_name text,
  guest_email text,
  guest_phone text,
  service_id uuid not null references public.services(id),
  staff_id uuid not null references public.staff(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status public.booking_status not null default 'confirmed',
  price numeric(10,2) not null check (price >= 0),
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_at < end_at),
  check (customer_id is not null or (guest_name is not null and guest_email is not null))
);

alter table public.bookings add constraint bookings_staff_no_overlap
  exclude using gist (staff_id with =, tstzrange(start_at, end_at, '[)') with &&)
  where (status = 'confirmed');

create index bookings_business_start_idx on public.bookings (business_id, start_at);
create index bookings_customer_idx on public.bookings (customer_id, start_at desc);
create index blocked_periods_staff_idx on public.blocked_periods (staff_id, start_at);

create or replace function public.is_business_admin(target_business uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.business_id = target_business and p.role = 'admin');
$$;

create or replace function public.create_booking(
  p_business_id uuid, p_customer_id uuid, p_guest_name text, p_guest_email text, p_guest_phone text,
  p_service_id uuid, p_staff_id uuid, p_start_at timestamptz, p_notes text default null
) returns public.bookings language plpgsql security definer set search_path = '' as $$
declare
  v_service public.services;
  v_end_at timestamptz;
  v_booking public.bookings;
begin
  select * into v_service from public.services
    where id = p_service_id and business_id = p_business_id and active for share;
  if not found then raise exception 'Service is unavailable' using errcode = 'P0001'; end if;
  if not exists(select 1 from public.staff_services ss join public.staff s on s.id = ss.staff_id
    where ss.staff_id = p_staff_id and ss.service_id = p_service_id and s.business_id = p_business_id and s.active)
  then raise exception 'Specialist is unavailable' using errcode = 'P0001'; end if;
  v_end_at := p_start_at + make_interval(mins => v_service.duration_minutes);
  if exists(select 1 from public.blocked_periods bp where bp.staff_id = p_staff_id
    and tstzrange(bp.start_at, bp.end_at, '[)') && tstzrange(p_start_at, v_end_at, '[)'))
  then raise exception 'Time slot is blocked' using errcode = '23P01'; end if;
  insert into public.bookings(business_id,customer_id,guest_name,guest_email,guest_phone,service_id,staff_id,start_at,end_at,price,notes)
  values(p_business_id,p_customer_id,p_guest_name,p_guest_email,p_guest_phone,p_service_id,p_staff_id,p_start_at,v_end_at,v_service.price,p_notes)
  returning * into v_booking;
  return v_booking;
exception when exclusion_violation then
  raise exception 'This time slot is no longer available. Please choose another time.' using errcode = '23P01';
end;
$$;

alter table public.businesses enable row level security;
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.staff_services enable row level security;
alter table public.availability_rules enable row level security;
alter table public.blocked_periods enable row level security;
alter table public.bookings enable row level security;

create policy "public reads active services" on public.services for select using (active or public.is_business_admin(business_id));
create policy "public reads active staff" on public.staff for select using (active or public.is_business_admin(business_id));
create policy "public reads staff services" on public.staff_services for select using (true);
create policy "public reads availability rules" on public.availability_rules for select using (true);
create policy "public reads future blocks" on public.blocked_periods for select using (end_at >= now());
create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_business_admin(business_id));
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "customers read own bookings" on public.bookings for select using (customer_id = auth.uid() or public.is_business_admin(business_id));
create policy "customers cancel own bookings" on public.bookings for update using (customer_id = auth.uid()) with check (customer_id = auth.uid() and status = 'cancelled');
create policy "admins manage services" on public.services for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));
create policy "admins manage staff" on public.staff for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));
create policy "admins manage bookings" on public.bookings for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));

grant execute on function public.create_booking to anon, authenticated;
