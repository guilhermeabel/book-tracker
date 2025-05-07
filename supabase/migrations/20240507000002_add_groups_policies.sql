-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Allow users to create groups
CREATE POLICY "Users can create groups" ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to view groups they are members of
CREATE POLICY "Users can view their groups" ON groups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

-- Allow users to update groups they are members of
CREATE POLICY "Users can update their groups" ON groups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

-- Allow users to delete groups they are admins of
CREATE POLICY "Users can delete their groups" ON groups
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  ); 
