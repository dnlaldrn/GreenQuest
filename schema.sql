-- ==========================================
-- GREENQUEST SYSTEM DATABASE SCHEMA & SEED DATA
-- Run these statements in your Supabase SQL Editor
-- ==========================================

-- 1. Extend Profiles Table (if column 'role' or 'interests' is missing)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';

-- 2. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT null,
  video_url text not null,
  description text,
  status text DEFAULT 'pending', -- 'pending', 'manual_review', 'approved', 'rejected'
  ai_feedback text,
  ai_score int DEFAULT 0,
  points_awarded int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. Points Ledger Table
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT null,
  change int not null,
  reason text not null,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- 4. Rewards Table
CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  points_cost int not null,
  stock int DEFAULT 0,
  active bool DEFAULT true
);

-- 5. Redemptions Table
CREATE TABLE IF NOT EXISTS public.redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT null,
  reward_id uuid REFERENCES public.rewards(id) ON DELETE RESTRICT NOT null,
  points_spent int not null,
  status text DEFAULT 'processing', -- 'processing', 'completed', 'cancelled'
  created_at timestamptz DEFAULT now()
);

-- 6. Leaderboard View
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  id,
  username,
  avatar_url,
  total_points,
  rank() OVER (ORDER BY total_points DESC) as rank
FROM public.profiles
ORDER BY total_points DESC
LIMIT 100;

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Submissions Policies
CREATE POLICY "Users can insert own submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update submissions" ON public.submissions
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Points Ledger Policies
CREATE POLICY "Users can read own ledger" ON public.points_ledger
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Rewards Policies
CREATE POLICY "Anyone can read active rewards" ON public.rewards
  FOR SELECT USING (active = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage rewards" ON public.rewards
  ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Redemptions Policies
CREATE POLICY "Users can insert own redemptions" ON public.redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own redemptions" ON public.redemptions
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage redemptions" ON public.redemptions
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 8. RPC function to safely award points and log in ledger
CREATE OR REPLACE FUNCTION public.add_points(
  p_user_id uuid,
  p_points int,
  p_reason text,
  p_reference_id uuid DEFAULT null
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user total points
  UPDATE public.profiles
  SET total_points = COALESCE(total_points, 0) + p_points
  WHERE id = p_user_id;

  -- Add record in ledger
  INSERT INTO public.points_ledger (
    user_id,
    change,
    reason,
    reference_id
  )
  VALUES (
    p_user_id,
    p_points,
    p_reason,
    p_reference_id
  );
END;
$$;

-- 9. Seed Default Rewards
INSERT INTO public.rewards (name, description, image_url, points_cost, stock, active)
VALUES 
  ('Eco-Tech Water Bottle', 'Smart temperature tracking and biodegradable materials.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300', 5000, 42, true),
  ('Forest Restoration Bond', 'Planted in your name in the Amazon rainforest.', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300', 12500, 99999, true),
  ('Sustainable Yoga Mat', 'Hemp & natural organic tree rubber construction.', 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=300', 8200, 15, true)
ON CONFLICT DO NOTHING;
