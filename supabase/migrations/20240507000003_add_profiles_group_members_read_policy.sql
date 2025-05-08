-- Add policy to allow users to read profiles of other users in the same groups
CREATE POLICY "Users can read profiles of group members"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM group_members AS user_groups
            JOIN group_members AS other_user_groups 
                ON user_groups.group_id = other_user_groups.group_id
            WHERE 
                user_groups.user_id = auth.uid() AND
                other_user_groups.user_id = profiles.id
        )
    ); 
