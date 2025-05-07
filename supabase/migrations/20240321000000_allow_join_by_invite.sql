-- Drop the restrictive policy that only allows users to view groups they're members of
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;

CREATE POLICY "Users can view groups they are members of or have invite codes"
    ON groups FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
        ) OR invite_code IS NOT NULL
    );

-- Drop the restrictive policy for joining groups
DROP POLICY IF EXISTS "Users can join groups" ON group_members;

-- Create a more permissive policy for joining groups
CREATE POLICY "Users can join groups with invite codes"
    ON group_members FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM groups
            WHERE groups.id = group_id
        )
    );
