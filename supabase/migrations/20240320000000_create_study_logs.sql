-- Create study_logs table
CREATE TABLE IF NOT EXISTS study_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT,
    minutes INTEGER NOT NULL CHECK (minutes > 0),
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS study_logs_user_id_idx ON study_logs(user_id);
CREATE INDEX study_logs_group_id_idx ON study_logs(group_id);
CREATE INDEX study_logs_created_at_idx ON study_logs(created_at);

-- Add RLS policies
ALTER TABLE study_logs ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own logs
CREATE POLICY "Users can view their own study logs"
    ON study_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for users to insert their own logs
CREATE POLICY "Users can create their own study logs"
    ON study_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own logs
CREATE POLICY "Users can update their own study logs"
    ON study_logs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for users to delete their own logs
CREATE POLICY "Users can delete their own study logs"
    ON study_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_study_logs_updated_at
    BEFORE UPDATE ON study_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
