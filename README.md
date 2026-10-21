# UMA Matric Higher Secondary School, Alwarcoil — Official Website & Admin Portal

Official web platform for **UMA Matric Higher Secondary School, Alwarcoil, Kanyakumari District, Tamil Nadu – 629802** (*Centre for Excellence*) and sister institution **UMA Kidz Global Horizon, Madavilagam**.

## ✨ Key Features

1. **School Emblem & Title Card Header + Live Scrolling News Ticker**
   - Displays the official school crest (`public/logo.png`) and a continuous scrolling **Important News Ticker** directly below the title bar (e.g., *Vijaya Dasami Admissions – 20 October 2026*, *Admissions Open*, *Higher Secondary Groups*).
2. **Automatic Admission Form Popup on Website Open (Admin Controlled)**
   - Automatically greets visitors with the Vijaya Dasami Admissions announcement & interactive online Admission Enquiry Form.
   - Admin can toggle the popup **ON/OFF**, edit its badge/title/subtitle/admission date, upload a promotional poster, and view/export all submitted enquiries to CSV/Excel.
3. **Leadership Portraits & Messages (Modifiable by Admin)**
   - **Correspondent**: K. Mahadevan, M.A., B.Ed., M.A., M.Phil. (`94429 41018`)
   - **Principal**: Mrs. P. H. Uma Devi, M.Sc., B.Ed. (`89733 32040`)
   - Admin can upload new portrait photos or edit names, qualifications, phone numbers, and messages anytime.
4. **Photo & Video Multimedia Gallery (Modifiable by Admin)**
   - Supports both **Pictures** and **Videos** (direct MP4/WebM video file uploads to Supabase Storage AND YouTube links with automatic thumbnail generation).
   - Category filtering and full-screen theater lightbox playback.
5. **Digital Notice Board & Announcements (Modifiable by Admin)**
   - Pinned circulars, category badges (`Admission`, `Academic`, `Activities`, `Event`, `Holiday`), attachment/poster links, and full CRUD management.
6. **Complete Academic & Institutional Sections**
   - About Our School, Our Vision, 7-Point Mission, 10 Academic Highlights, 3 Higher Secondary (+1/+2) Groups (*Maths–CS*, *Maths–Biology*, *CS–Biology*), 15 Campus Facilities, Students' Activities & Achievements, Annual Events, Admission Process & Required Documents, and Campus Map.

---

## 🚀 Quick Start (Local Development)

```bash
npm install
npm run dev
```

- **Admin Panel Login**: Click **Admin Login** in the top-right bar.
- **Default Admin Passcode**: `UMA@2026` (customizable via `VITE_ADMIN_PASSCODE`).

---

## ☁️ Deploying with Supabase & Vercel

### Step 1: Set Up Supabase Database & Storage
1. Create a free project at [supabase.com](https://supabase.com).
2. In your Supabase Dashboard, open **SQL Editor** → **New Query**.
3. Copy and paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
   - This creates all 5 tables (`school_settings`, `ticker_items`, `notices`, `gallery_items`, `admission_enquiries`), configures Row-Level Security (RLS) policies, creates the public `school-media` Storage bucket for photos/videos/portraits, and seeds all official school data.
4. Go to **Project Settings** → **API** and copy your:
   - **Project URL** (`VITE_SUPABASE_URL`)
   - **anon public key** (`VITE_SUPABASE_ANON_KEY`)

### Step 2: Deploy to Vercel
1. Push this project folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repository.
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key`
   - `VITE_ADMIN_PASSCODE` = `UMA@2026` *(or your preferred secret password)*
4. Click **Deploy**!
