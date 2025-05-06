-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create groups table
CREATE TABLE groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invite_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create group_members table
CREATE TABLE group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(group_id, user_id)
);

-- Create study_logs table
CREATE TABLE study_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT,
    minutes INTEGER NOT NULL CHECK (minutes > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX groups_created_by_idx ON groups(created_by);
CREATE INDEX group_members_group_id_idx ON group_members(group_id);
CREATE INDEX group_members_user_id_idx ON group_members(user_id);
CREATE INDEX study_logs_user_id_idx ON study_logs(user_id);
CREATE INDEX study_logs_group_id_idx ON study_logs(group_id);
CREATE INDEX study_logs_created_at_idx ON study_logs(created_at);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_logs ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Users can view groups they are members of"
    ON groups FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create groups"
    ON groups FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update their groups"
    ON groups FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

CREATE POLICY "Group admins can delete their groups"
    ON groups FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- Group members policies
CREATE POLICY "Users can view group members"
    ON group_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_members gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join groups"
    ON group_members FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM groups
            WHERE groups.id = group_id
            AND groups.invite_code IS NOT NULL
        )
    );

CREATE POLICY "Group admins can manage members"
    ON group_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM group_members gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
            AND gm.role = 'admin'
        )
    );

-- Study logs policies
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
