-- 0. Enable uuid-ossp extension if needed
-- create extension if not exists "uuid-ossp";

-- 1. users (mirror table for auth.users metadata)
create table if not exists public.users (
  id uuid primary key references auth.users(id),
  first_name text not null,
  last_name text not null,
  full_name text generated always as (first_name || ' ' || last_name) stored,
  email text not null unique,
  profile_picture_url text,
  role text not null default 'User' check (role in ('SuperAdmin','Admin','User','Viewer')),
  status text default 'Active' check (status in ('Active','Inactive','Suspended','Deleted')),
  last_login timestamptz,
  -- last_seen_at timestamptz,
  created_at timestamptz default now(),
  created_by uuid references public.users(id),
  updated_at timestamptz,
  updated_by uuid references public.users(id)
  -- deleted_at timestamptz,
  -- deleted_by uuid,
);

-- 1. folders (expense profiles)
create table if not exists public.folders (
  id bigserial primary key,
  title text not null,
  description text,
  status text default 'Active' check (status in ('Active','Archived')),
  visibility text default 'Private' check (visibility in ('Private','Public')),
  color_code text,
  icon text,
  created_at timestamptz default now(),
  created_by uuid,
  updated_at timestamptz,
  updated_by uuid
  -- deleted_at timestamptz,
  -- deleted_by uuid,
);

create table if not exists public.folder_members (
  id bigserial primary key,
  folder_id bigint not null,
  user_id uuid not null,
  permission_level text not null default 'Contributor' check (permission_level in ('Viewer','Contributor','Editor')),
  assigned_at timestamptz default now(),
  assigned_by uuid not null,
  -- last_active timestamptz,
  created_at timestamptz default now(),
  created_by uuid not null,
  updated_at timestamptz,
  updated_by uuid
  -- unique(folder_id, user_id)
  -- deleted_at timestamptz,
  -- deleted_by uuid,
);


create table if not exists public.files (
  id bigserial primary key,
  folder_id bigint not null,
  title text not null,
  -- title text not null unique,
  description text,
  status text default 'Active' check (status in ('Active','Archived')),
  visibility text default 'Private' check (visibility in ('Private','Public')),
  created_at timestamptz default now(),
  created_by uuid,      -- no FK
  updated_at timestamptz,
  updated_by uuid       -- no FK
  -- deleted_at timestamptz,
  -- deleted_by uuid,
);
create table if not exists public.file_members (
  id bigserial primary key,
  file_id bigint not null,
  user_id uuid not null,
  permission_level text not null default 'Contributor' check (permission_level in ('Viewer','Contributor','Editor')),
  assigned_at timestamptz default now(),
  assigned_by uuid,       -- no FK
  -- last_active timestamptz,
  created_at timestamptz default now(),
  created_by uuid,
  updated_at timestamptz,
  updated_by uuid
  -- deleted_at timestamptz,
  -- deleted_by uuid,
  -- unique(file_id, user_id)
);

-- 7. expenses
create table if not exists public.expenses (
  id bigserial primary key,
  folder_id bigint null,
  file_id bigint not null,
  expense_title text,
  category text,
  amount numeric(12,2) not null check (amount >= 0),
  currency text default 'PKR',
  notes text,
  receipt_url text,
  attachment_urls text[],
  spent_at date not null default current_date,
  payment_method text check (payment_method in ('Cash','Card','Bank','Wallet','Other')),
  merchant_name text,
  location text,
  paid_by uuid,
  is_reimbursable boolean default true,
  status text default 'Pending' check (status in ('Pending','Approved','Rejected','Paid','Cancelled','Flagged')),
  approved_by uuid,
  approved_at timestamptz,
  tags text[],
  created_by uuid,
  created_at timestamptz default now(),
  updated_by uuid,
  updated_at timestamptz
  -- metadata jsonb,  -- for custom fields
  -- reimbursed_at timestamptz
  -- deleted_at timestamptz,
  -- deleted_by uuid,
);




CREATE POLICY "Allow upload for authenticated users"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (true);


CREATE POLICY "Allow read for authenticated users"
ON storage.objects
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "Allow authenticated users to delete"
ON storage.objects
FOR DELETE
TO authenticated
USING ( true );


CREATE POLICY "Allow authenticated users to update"
ON storage.objects
FOR UPDATE
TO authenticated
USING ( true )
WITH CHECK ( true );
