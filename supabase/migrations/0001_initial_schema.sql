-- Wardrobe app database schema
-- Run this in Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- items
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('tops','bottoms','shoes','accessories','outerwear','dresses')),
  color text,
  color_hex text,
  pattern text,
  season text[] DEFAULT '{}',
  occasion text[] DEFAULT '{}',
  image_url text NOT NULL,
  thumbnail_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);

-- outfits
CREATE TABLE IF NOT EXISTS outfits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  item_ids uuid[] NOT NULL,
  occasion text,
  season text,
  is_favorite boolean DEFAULT false,
  cover_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_item_ids ON outfits USING GIN (item_ids);

-- try_on_snapshots
CREATE TABLE IF NOT EXISTS try_on_snapshots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  body_photo_url text NOT NULL,
  composite_image_url text NOT NULL,
  items_used uuid[] DEFAULT '{}',
  adjustments jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_try_on_user_id ON try_on_snapshots(user_id);

-- family_groups
CREATE TABLE IF NOT EXISTS family_groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  invite_code text UNIQUE,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_family_invite_code ON family_groups(invite_code);

-- family_members
CREATE TABLE IF NOT EXISTS family_members (
  group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner','member')),
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON family_members(user_id);

-- outfit_shares
CREATE TABLE IF NOT EXISTS outfit_shares (
  outfit_id uuid REFERENCES outfits ON DELETE CASCADE,
  shared_with uuid REFERENCES auth.users ON DELETE CASCADE,
  shared_at timestamptz DEFAULT now(),
  PRIMARY KEY (outfit_id, shared_with)
);
CREATE INDEX IF NOT EXISTS idx_outfit_shares_user ON outfit_shares(shared_with);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE try_on_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_shares ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- items policies
CREATE POLICY "Users read own items" ON items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

-- outfits policies
CREATE POLICY "Users read own outfits" ON outfits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own outfits" ON outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own outfits" ON outfits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own outfits" ON outfits
  FOR DELETE USING (auth.uid() = user_id);

-- try_on_snapshots policies
CREATE POLICY "Users read own try-ons" ON try_on_snapshots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own try-ons" ON try_on_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own try-ons" ON try_on_snapshots
  FOR DELETE USING (auth.uid() = user_id);

-- family_groups policies
CREATE POLICY "Members read family groups" ON family_groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM family_members WHERE group_id = family_groups.id AND user_id = auth.uid())
  );
CREATE POLICY "Users create family groups" ON family_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners update family groups" ON family_groups
  FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Owners delete family groups" ON family_groups
  FOR DELETE USING (created_by = auth.uid());

-- family_members policies
CREATE POLICY "Members read family members" ON family_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM family_members fm WHERE fm.group_id = family_members.group_id AND fm.user_id = auth.uid())
  );
CREATE POLICY "Members join family" ON family_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- outfit_shares policies
CREATE POLICY "Recipients read shares" ON outfit_shares
  FOR SELECT USING (auth.uid() = shared_with);
CREATE POLICY "Owners share outfits" ON outfit_shares
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM outfits WHERE id = outfit_id AND user_id = auth.uid())
  );

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket creation (run separately in dashboard or via API)
-- Storage policies will be added via dashboard
