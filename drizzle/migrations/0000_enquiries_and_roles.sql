create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null default 'visit',
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 6 and 20),
  email text check (email is null or char_length(email) <= 255),
  visit_date date,
  preferred_time text check (preferred_time is null or char_length(preferred_time) <= 40),
  guests int check (guests is null or (guests between 1 and 1000)),
  activity text check (activity is null or char_length(activity) <= 200),
  visit_type text check (visit_type is null or char_length(visit_type) <= 40),
  message text check (message is null or char_length(message) <= 1000)
);
grant insert on public.enquiries to anon, authenticated;
grant select, delete on public.enquiries to authenticated;
grant all on public.enquiries to service_role;
alter table public.enquiries enable row level security;
create policy "Anyone can submit enquiries" on public.enquiries for insert to anon, authenticated with check (true);
create policy "Admins read enquiries" on public.enquiries for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete enquiries" on public.enquiries for delete to authenticated using (public.has_role(auth.uid(), 'admin'));