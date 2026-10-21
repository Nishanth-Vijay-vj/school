-- =================================================================================
-- UMA MATRIC HIGHER SECONDARY SCHOOL, ALWARCOIL - SUPABASE DATABASE & STORAGE SCHEMA
-- Run this entire script in your Supabase Dashboard -> SQL Editor -> New Query
-- =================================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- 1. SCHOOL SETTINGS & LEADERSHIP PORTRAITS / POPUP CONFIGURATION TABLE
create table if not exists public.school_settings (
  id integer primary key default 1,
  school_name text not null default 'UMA Matric Higher Secondary School',
  school_motto text not null default 'CENTRE FOR EXCELLENCE',
  school_location text not null default 'Alwarcoil, Neyyoor Post, Kanyakumari District, Tamil Nadu – 629802',
  logo_url text not null default '/logo.png',
  
  -- Hero Section Image (Modifiable by Admin)
  hero_image_url text not null default '/images/students_event.jpg',

  -- Correspondent Details (Modifiable by Admin)
  correspondent_name text not null default 'K. Mahadevan',
  correspondent_qualifications text not null default 'M.A., B.Ed., M.A., M.Phil.',
  correspondent_title text not null default 'Correspondent',
  correspondent_phone text not null default '94429 41018',
  correspondent_photo_url text not null default '/images/correspondent.jpg',
  correspondent_message text not null default 'It gives me immense pleasure to welcome you to UMA Matric Higher Secondary School, Alwarcoil. Our school is committed to providing quality education in a safe, caring and inspiring environment where every child is encouraged to learn, grow and achieve their full potential.

We believe that education is not only about academic excellence but also about developing good character, discipline, confidence, creativity and a sense of responsibility. With the dedicated efforts of our teachers, the support of parents and the active participation of our students, we strive to nurture responsible and successful citizens for the future.

At UMA Matric Higher Secondary School, we continue to work towards creating a learning environment that prepares our students to face the challenges of the modern world with knowledge, confidence and compassion.

At UMA Matric Higher Secondary School, we envision an educational journey where every student is inspired to learn, achieve, lead and make a positive difference in society.',

  -- Principal Details (Modifiable by Admin)
  principal_name text not null default 'Mrs. P. H. Uma Devi',
  principal_qualifications text not null default 'M.Sc., B.Ed.',
  principal_title text not null default 'Principal',
  principal_phone text not null default '89733 32040',
  principal_photo_url text not null default '/images/principal.jpg',
  principal_message text not null default 'It gives me immense pleasure to welcome you to UMA Matric Higher Secondary School. Our school is committed to providing quality education in a safe, caring and encouraging environment.

We believe that education is not only about academic achievement but also about developing good character, discipline, confidence and responsibility. We encourage every student to discover their talents, develop their skills and face the future with courage and confidence.

With the dedicated efforts of our teachers, the support of parents and the enthusiasm of our students, we strive to create a strong foundation for every child’s future. Our goal is to nurture responsible, knowledgeable and compassionate individuals who can contribute positively to society.

I wish all our students a bright, successful and meaningful educational journey.',

  -- Admission Popup Settings (Modifiable by Admin)
  popup_enabled boolean not null default true,
  popup_badge text not null default 'ADMISSIONS OPEN 2026–2027',
  popup_title text not null default 'SSLC 2025–26 Toppers & Vijaya Dasami Admissions',
  popup_subtitle text not null default 'Admissions are open for UMA Matric Higher Secondary School (Alwarcoil) & UMA Kidz Global Horizon (Madavilagam, Kandanvilai Post). Hearty congratulations to our SSLC toppers!',
  popup_admission_date text not null default '20 October 2026',
  popup_banner_url text not null default '/images/sslc_toppers_poster.jpg',
  
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- 2. IMPORTANT NEWS TICKER / MARQUEE (Runs below the Title Card)
create table if not exists public.ticker_items (
  id uuid primary key default gen_random_uuid(),
  tag text not null default 'ADMISSIONS',
  text text not null,
  is_active boolean not null default true,
  link_section text not null default '#admissions',
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- 3. NOTICE BOARD & ANNOUNCEMENTS
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null,
  category text not null default 'Admission',
  content text not null,
  location text default 'Alwarcoil & Madavilagam Campuses',
  is_pinned boolean not null default false,
  attachment_url text default '',
  created_at timestamptz not null default now()
);

-- 4. GALLERY ITEMS (Pictures & Videos)
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  media_type text not null check (media_type in ('image', 'video')),
  media_url text not null,
  thumbnail_url text default '',
  category text not null default 'Campus & Facilities',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- 5. ADMISSION ENQUIRIES (Submitted via Popup or Admission Form)
create table if not exists public.admission_enquiries (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  dob text default '',
  institution text not null default 'UMA Matric Higher Secondary School, Alwarcoil',
  grade_applying text not null,
  group_preference text default '',
  parent_name text not null,
  phone text not null,
  alt_phone text default '',
  address text default '',
  previous_school text default '',
  message text default '',
  status text not null default 'New',
  created_at timestamptz not null default now()
);

-- 6. SCHOOL EVENTS (Modifiable by Admin - Add & Delete)
create table if not exists public.school_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null,
  category text not null default 'School Event',
  description text not null default '',
  image_url text default '',
  location text default 'UMA School Campus',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) with open read & client access so Admin Panel works smoothly
alter table public.school_settings enable row level security;
alter table public.ticker_items enable row level security;
alter table public.notices enable row level security;
alter table public.gallery_items enable row level security;
alter table public.admission_enquiries enable row level security;
alter table public.school_events enable row level security;

-- Drop existing policies if re-running script
drop policy if exists "Allow public read school_settings" on public.school_settings;
drop policy if exists "Allow all write school_settings" on public.school_settings;
drop policy if exists "Allow public read ticker_items" on public.ticker_items;
drop policy if exists "Allow all write ticker_items" on public.ticker_items;
drop policy if exists "Allow public read notices" on public.notices;
drop policy if exists "Allow all write notices" on public.notices;
drop policy if exists "Allow public read gallery_items" on public.gallery_items;
drop policy if exists "Allow all write gallery_items" on public.gallery_items;
drop policy if exists "Allow public insert admission_enquiries" on public.admission_enquiries;
drop policy if exists "Allow all manage admission_enquiries" on public.admission_enquiries;
drop policy if exists "Allow public read school_events" on public.school_events;
drop policy if exists "Allow all write school_events" on public.school_events;

create policy "Allow public read school_events" on public.school_events for select using (true);
create policy "Allow all write school_events" on public.school_events for all using (true) with check (true);

create policy "Allow public read school_settings" on public.school_settings for select using (true);
create policy "Allow all write school_settings" on public.school_settings for all using (true) with check (true);

create policy "Allow public read ticker_items" on public.ticker_items for select using (true);
create policy "Allow all write ticker_items" on public.ticker_items for all using (true) with check (true);

create policy "Allow public read notices" on public.notices for select using (true);
create policy "Allow all write notices" on public.notices for all using (true) with check (true);

create policy "Allow public read gallery_items" on public.gallery_items for select using (true);
create policy "Allow all write gallery_items" on public.gallery_items for all using (true) with check (true);

create policy "Allow public insert admission_enquiries" on public.admission_enquiries for insert with check (true);
create policy "Allow all manage admission_enquiries" on public.admission_enquiries for all using (true) with check (true);

-- =================================================================================
-- STORAGE BUCKET SETUP FOR PHOTOS, VIDEOS, PORTRAITS & LOGO
-- =================================================================================
insert into storage.buckets (id, name, public)
values ('school-media', 'school-media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to school-media" on storage.objects;
drop policy if exists "Allow Uploads to school-media" on storage.objects;
drop policy if exists "Allow Updates to school-media" on storage.objects;
drop policy if exists "Allow Deletes from school-media" on storage.objects;

create policy "Public Access to school-media"
  on storage.objects for select
  using ( bucket_id = 'school-media' );

create policy "Allow Uploads to school-media"
  on storage.objects for insert
  with check ( bucket_id = 'school-media' );

create policy "Allow Updates to school-media"
  on storage.objects for update
  using ( bucket_id = 'school-media' );

create policy "Allow Deletes from school-media"
  on storage.objects for delete
  using ( bucket_id = 'school-media' );

-- =================================================================================
-- SEED INITIAL OFFICIAL DATA FROM SCHOOL DOCUMENT
-- =================================================================================
insert into public.school_settings (id)
values (1)
on conflict (id) do nothing;

insert into public.ticker_items (tag, text, is_active, link_section, sort_order)
select * from (values
  ('ADMISSIONS OPEN', '🌟 Vijaya Dasami Admissions – 20 October 2026: Enrol now at UMA Matric Higher Secondary School (Alwarcoil) & UMA Kidz Global Horizon (Madavilagam)!', true, '#admissions', 1),
  ('CLASSES OFFERED', '🎓 Admissions open for Primary Classes, Middle School, High School & Higher Secondary (+1 / +2: Maths-CS, Maths-Biology, CS-Biology).', true, '#academics', 2),
  ('CONTACT OFFICE', '📞 For Admissions & Enquiries contact Correspondent: 94429 41018 | Principal: 89733 32040', true, '#contact', 3)
) as v(tag, text, is_active, link_section, sort_order)
where not exists (select 1 from public.ticker_items);

insert into public.notices (title, date, category, content, location, is_pinned)
select * from (values
  (
    'Vijaya Dasami Admissions – 20 October 2026',
    '2026-10-20',
    'Admission',
    'Admissions are open on the auspicious occasion of Vijaya Dasami at UMA Matric Higher Secondary School (Alwarcoil, Kanyakumari District) and UMA Kidz Global Horizon (Madavilagam, Kandanvilai Post, Kanyakumari District). Parents are warmly invited to enrol their children and begin their educational journey with us.',
    'Alwarcoil & Madavilagam, Kanyakumari District',
    true
  ),
  (
    'Higher Secondary (+1 & +2) Group Admissions Open',
    '2026-10-15',
    'Academic',
    'Applications are invited for Higher Secondary groups: (1) Mathematics – Computer Science, (2) Mathematics – Biology, and (3) Computer Science – Biology. Collect the application form from the school office along with required documents.',
    'UMA Matric Higher Secondary School, Alwarcoil',
    true
  ),
  (
    'Co-Curricular, Sports & Silambam / Yoga Coaching Registration',
    '2026-10-10',
    'Activities',
    'Students are encouraged to register for after-school and co-curricular clubs including Yoga, Silambam, Karate, Skating, Athletics, Volleyball, Football, Kabaddi, Music, Dance, and Science Club.',
    'School Campus Ground & Auditorium',
    false
  )
) as v(title, date, category, content, location, is_pinned)
where not exists (select 1 from public.notices);
