# 🌿 GreenQuest 

## What is GreenQuest?

A web platform where users upload videos of eco-friendly actions (planting trees, cleaning beaches, recycling, etc.), an AI validates the action, awards points, and users can redeem those points for real rewards.

---

# Tech Stack

| Layer | Tool |
|---------|---------|
| Frontend | React + Vite + TailwindCSS |
| Backend / DB | Supabase (Postgres + Auth + Storage + Edge Functions + Realtime) |
| AI Validation | Gemini API (`gemini-2.5-flash`) via Supabase Edge Function |
| Hosting | Vercel or Netlify |

---

# Folder Structure

```text
greenquest/
├── public/
│   └── logo.svg
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── lib/
│   │   ├── supabase.js
│   │   └── constants.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── usePoints.js
│   │   └── useSubmissions.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Rewards.jsx
│   │   └── Admin.jsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── upload/
│   │   │   ├── VideoDropzone.jsx
│   │   │   ├── UploadProgress.jsx
│   │   │   └── ValidationStatus.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── PointsBadge.jsx
│   │   │   ├── SubmissionCard.jsx
│   │   │   └── ActivityFeed.jsx
│   │   │
│   │   ├── leaderboard/
│   │   │   └── LeaderboardRow.jsx
│   │   │
│   │   └── rewards/
│   │       ├── RewardCard.jsx
│   │       └── RedeemModal.jsx
│   │
│   └── styles/
│       └── index.css
│
├── supabase/
│   ├── functions/
│   │   └── validate-video/
│   │       └── index.ts
│   │
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_add_rewards.sql
│       └── 003_add_leaderboard_view.sql
│
├── .env.local
├── .env.example
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

# Step-by-Step Build Process

## PHASE 1 — Project Setup (Day 1)

### Step 1: Create the Vite + React App

```bash
npm create vite@latest greenquest -- --template react

cd greenquest

npm install

npm install @supabase/supabase-js react-router-dom @tanstack/react-query

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

### Step 2: Set Up Supabase

Create a project in Supabase and add the following environment variables:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Create Supabase Client

`src/lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

# PHASE 2 — Database Schema (Day 1–2)

## 001_initial_schema.sql

```sql
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  avatar_url text,
  total_points int default 0,
  created_at timestamptz default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  video_url text not null,
  description text,
  status text default 'pending',
  ai_feedback text,
  points_awarded int default 0,
  created_at timestamptz default now()
);

create table points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  change int not null,
  reason text not null,
  reference_id uuid,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table submissions enable row level security;
alter table points_ledger enable row level security;

create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

create policy "Users can insert own submissions"
on submissions for insert
with check (auth.uid() = user_id);

create policy "Users can read own submissions"
on submissions for select
using (auth.uid() = user_id);

create policy "Users can read own ledger"
on points_ledger for select
using (auth.uid() = user_id);
```

## 002_add_rewards.sql

```sql
create table rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  points_cost int not null,
  stock int,
  active bool default true
);

create table redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  reward_id uuid references rewards(id) not null,
  points_spent int not null,
  status text default 'processing',
  created_at timestamptz default now()
);
```

## 003_add_leaderboard_view.sql

```sql
create view leaderboard as
select
  id,
  username,
  avatar_url,
  total_points,
  rank() over (order by total_points desc) as rank
from profiles
order by total_points desc
limit 100;
```

---

# PHASE 3 — Supabase Storage (Day 2)

Create a bucket:

```text
eco-videos
```

Set bucket to:

```text
Private
```

Storage Policy:

```sql
create policy "Users upload to own folder"
on storage.objects
for insert
with check (
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

# PHASE 4 — AI Validation Edge Function (Day 2–3)

`supabase/functions/validate-video/index.ts`

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenAI } from 'https://esm.sh/@google/genai'

// Full implementation here...
```

### Add RPC Function

```sql
create or replace function add_points(
  p_user_id uuid,
  p_points int,
  p_reason text,
  p_reference_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  update profiles
  set total_points = total_points + p_points
  where id = p_user_id;

  insert into points_ledger (
    user_id,
    change,
    reason,
    reference_id
  )
  values (
    p_user_id,
    p_points,
    p_reason,
    p_reference_id
  );
end;
$$;
```

---

# PHASE 5 — Frontend Pages (Day 3–5)

Build Order:

1. AuthContext.jsx + useAuth.js
2. App.jsx (Router)
3. Landing.jsx
4. Login.jsx
5. Upload.jsx
6. Dashboard.jsx
7. Leaderboard.jsx
8. Rewards.jsx

### Upload Flow

```js
const handleUpload = async (file) => {
  const path = `${user.id}/${Date.now()}-${file.name}`

  await supabase.storage
    .from('eco-videos')
    .upload(path, file)

  const { data } = await supabase
    .from('submissions')
    .insert({
      user_id: user.id,
      video_url: path,
      description,
      status: 'pending'
    })
    .select()
    .single()

  await supabase.functions.invoke('validate-video', {
    body: {
      submissionId: data.id
    }
  })

  navigate('/dashboard')
}
```

---

# PHASE 6 — Realtime Points (Day 5)

```js
useEffect(() => {
  const channel = supabase
    .channel('points-update')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      },
      (payload) => {
        setPoints(payload.new.total_points)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [user.id])
```

---

# PHASE 7 — Rewards Redemption (Day 5–6)

```js
const handleRedeem = async (reward) => {
  if (userPoints < reward.points_cost)
    return alert('Not enough points!')

  const { data } = await supabase
    .from('redemptions')
    .insert({
      user_id: user.id,
      reward_id: reward.id,
      points_spent: reward.points_cost
    })
    .select()
    .single()

  await supabase.rpc('add_points', {
    p_user_id: user.id,
    p_points: -reward.points_cost,
    p_reason: `Redeemed: ${reward.name}`,
    p_reference_id: data.id
  })
}
```

---

# PHASE 8 — Deploy (Day 6–7)

## Deploy Edge Functions

```bash
npx supabase functions deploy validate-video

npx supabase secrets set GEMINI_API_KEY=YOUR_API_KEY
```

## Deploy Frontend

```bash
npm run build
```

Push to GitHub and connect the repository to Vercel.

Add:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

# Point Scoring Guide

| Action | Points |
|----------|----------|
| Beach/Park Cleanup | 40–80 |
| Tree Planting | 60–100 |
| Recycling Demonstration | 10–30 |
| Composting Setup | 20–40 |
| Solar/Renewable Energy Action | 50–90 |
| Water Conservation | 15–35 |
| Community Eco-Education | 30–60 |

---

# Rewards Ideas

| Reward | Cost |
|----------|----------|
| GreenQuest Sticker Pack | 50 pts |
| Eco-Friendly Tote Bag | 150 pts |
| Native Plant Seedling | 200 pts |
| Tree Planted in Your Name | 500 pts |
| Eco Charity Donation | 1000 pts |
| Partner Discount Code | 300 pts |

---
