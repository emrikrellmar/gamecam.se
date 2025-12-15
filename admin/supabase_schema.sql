-- Create the inventory table
create table if not exists inventory (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  stock integer not null default 0,
  supplier text,
  last_updated date default current_date,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table inventory enable row level security;

-- Create policies (adjust as needed for your auth setup)
-- Allow read access to authenticated users
create policy "Enable read access for authenticated users" on inventory
  for select using (auth.role() = 'authenticated');

-- Allow insert/update/delete for authenticated users (or restrict to specific roles)
create policy "Enable write access for authenticated users" on inventory
  for all using (auth.role() = 'authenticated');

-- Insert initial data
insert into inventory (name, stock, supplier, last_updated, category) values
('Jetson Nano', 5, 'NVIDIA / Arrow', '2023-10-25', 'Compute'),
('USB Panel mounts', 24, 'AliExpress', '2023-11-02', 'Cables'),
('12v to 5v buck converter', 12, 'Amazon', '2023-10-15', 'Power'),
('12v to 5v buck converter (micro usb)', 8, 'Amazon', '2023-10-15', 'Power'),
('32gb SD card', 15, 'SanDisk', '2023-11-05', 'Storage'),
('64gb SD card', 10, 'SanDisk', '2023-11-05', 'Storage'),
('128gb SD card', 4, 'SanDisk', '2023-11-05', 'Storage'),
('IMX 219 Camera', 6, 'Arducam', '2023-09-20', 'Camera'),
('Arducam 12mp', 3, 'Arducam', '2023-09-20', 'Camera'),
('TP Link Archer T2U Plus', 7, 'TP-Link', '2023-10-30', 'Network'),
('External Antenna', 20, 'AliExpress', '2023-10-01', 'Network'),
('Cooling Fan', 18, 'AliExpress', '2023-10-01', 'Cooling'),
('5.5 x 2.1mm DC Barrel Jack', 50, 'AliExpress', '2023-08-15', 'Power'),
('12mm Push Button Switch', 35, 'AliExpress', '2023-08-15', 'Electronics'),
('LED Diode', 100, 'AliExpress', '2023-08-15', 'Electronics'),
('3D Prints', 2, 'In-house', '2023-11-10', 'Enclosure');

-- Create the orders table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  order_id text unique,
  customer_name text,
  product text,
  quantity text,
  company text,
  company_name text,
  tax_vat_number text,
  delivery_address text,
  phone_number text,
  email text,
  message text,
  timestamp text,
  status text default 'Order placed',
  tracking_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table orders enable row level security;

-- Create policies for orders
create policy "Enable read access for authenticated users" on orders
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on orders
  for all using (auth.role() = 'authenticated');

-- Create the customers table
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table customers enable row level security;

-- Create policies for customers
create policy "Enable read access for authenticated users" on customers
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on customers
  for all using (auth.role() = 'authenticated');

-- Create the issues table
create table if not exists issues (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text default 'Open',
  priority text default 'Medium',
  created_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table issues enable row level security;

-- Create policies for issues
create policy "Enable read access for authenticated users" on issues
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on issues
  for all using (auth.role() = 'authenticated');

-- Create the issue_comments table
create table if not exists issue_comments (
  id uuid default gen_random_uuid() primary key,
  issue_id uuid references issues(id) on delete cascade,
  content text not null,
  created_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table issue_comments enable row level security;

-- Create policies for issue_comments
create policy "Enable read access for authenticated users" on issue_comments
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on issue_comments
  for all using (auth.role() = 'authenticated');

-- Create the products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  price numeric not null default 0,
  currency text not null default 'EUR',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;

-- Create policies for products
create policy "Enable read access for authenticated users" on products
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on products
  for all using (auth.role() = 'authenticated');

-- Add status_updated_at to orders
alter table orders add column if not exists status_updated_at timestamp with time zone default timezone('utc'::text, now());

-- Add tracking_number to orders
alter table orders add column if not exists tracking_number text;

-- Create the estimates table
create table if not exists estimates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  club_name text,
  email text,
  phone text,
  city text,
  country text,
  products text, -- JSON string or formatted text
  message text,
  timestamp text,
  status text default 'New',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table estimates enable row level security;

-- Create policies for estimates
create policy "Enable read access for authenticated users" on estimates
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on estimates
  for all using (auth.role() = 'authenticated');
