-- Drop all existing policies for group_members to start fresh
DROP POLICY IF EXISTS "Users can view group members" ON group_members;
DROP POLICY IF EXISTS "Users can view their own group memberships" ON group_members;
DROP POLICY IF EXISTS "Users can view other members of their groups" ON group_members;
DROP POLICY IF EXISTS "Admins can view all group members" ON group_members;
DROP POLICY IF EXISTS "Users can see all members of their groups" ON group_members;

-- Keep only these policies and make them simple:
-- 1. A policy that allows users to SELECT/view ALL group memberships (we'll figure out filtering in the app)
-- 2. A policy that allows users to INSERT only their own memberships
-- 3. We'll retain the existing admin policy

-- This policy allows users to view all group memberships
-- We've removed recursive dependencies by making it simple
CREATE POLICY "Users can view all group memberships"
    ON group_members FOR SELECT
    TO authenticated
    USING (true);

-- Ensure users can only insert their own memberships
-- This replaces the "Users can join groups" policy if it exists
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
CREATE POLICY "Users can create their own memberships"
    ON group_members FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid()); 
