create table render_jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid,
  type text,
  payload jsonb,
  status text default 'queued',
  result_url text,
  error text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
