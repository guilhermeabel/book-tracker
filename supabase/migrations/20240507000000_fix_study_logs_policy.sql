-- Drop existing study_logs policies if they exist
DROP POLICY IF EXISTS "Users can view their own study logs" ON study_logs;
DROP POLICY IF EXISTS "Users can view study logs from their groups" ON study_logs;
DROP POLICY IF EXISTS "Users can create their own study logs" ON study_logs;
DROP POLICY IF EXISTS "Users can update their own study logs" ON study_logs;
DROP POLICY IF EXISTS "Users can delete their own study logs" ON study_logs;

-- Re-create study logs policies
CREATE POLICY "Users can view their own study logs"
    ON study_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view study logs from their groups"
    ON study_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = study_logs.group_id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own study logs"
    ON study_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study logs"
    ON study_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study logs"
    ON study_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS on auth.users for study logs join
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view other users' basic info when they're in the same group
CREATE POLICY "Users can view other users' basic info from same group"
    ON auth.users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM study_logs sl
            JOIN group_members gm ON gm.group_id = sl.group_id
            WHERE gm.user_id = auth.uid()
            AND sl.user_id = auth.users.id
        )
    ); 
