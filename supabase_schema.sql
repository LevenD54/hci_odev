-- Create the assignments table
create table if not exists assignments (
  id bigint primary key generated always as identity,
  title text not null,
  research_topic text,
  application_steps text,
  image_url text,
  student_name text,
  student_surname text,
  student_no text,
  is_taken integer default 0
);

-- Enable Row Level Security (RLS)
alter table assignments enable row level security;

-- Create a policy that allows everyone to read
create policy "Enable read access for all users"
on assignments for select
using (true);

-- Create a policy that allows everyone to insert (for admin purposes in this demo)
create policy "Enable insert for all users"
on assignments for insert
with check (true);

-- Create a policy that allows everyone to update (for taking assignments)
create policy "Enable update for all users"
on assignments for update
using (true);

-- Create a policy that allows everyone to delete
create policy "Enable delete for all users"
on assignments for delete
using (true);
