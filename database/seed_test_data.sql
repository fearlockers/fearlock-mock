-- Test Data for Organization and Projects
-- Run this in Supabase SQL Editor after user registration

-- 1. Create a test organization
INSERT INTO organizations (id, name, description, industry, size, plan)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'テスト組織',
  'テスト用の組織です',
  'Technology',
  'Small',
  'free'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create test projects for the organization
INSERT INTO projects (id, organization_id, name, description, url, status)
VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'テストプロジェクト1',
    '脆弱性診断用のテストプロジェクト',
    'https://example1.com',
    'active'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'テストプロジェクト2',
    'ソースコード診断用のテストプロジェクト',
    'https://example2.com',
    'active'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'テストプロジェクト3',
    'ネットワーク診断用のテストプロジェクト',
    'https://example3.com',
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Update user profile to link to the test organization
-- Note: Replace 'YOUR_USER_ID' with the actual user ID from auth.users
UPDATE profiles 
SET organization_id = '550e8400-e29b-41d4-a716-446655440000',
    role = 'admin'
WHERE id = auth.uid();

-- 4. Verify the data
SELECT 
  'Current User Profile' as info,
  p.id,
  p.email,
  p.organization_id,
  p.role
FROM profiles p
WHERE p.id = auth.uid();

SELECT 
  'User Organization' as info,
  o.id,
  o.name,
  o.description
FROM organizations o
WHERE o.id = (
  SELECT organization_id FROM profiles WHERE id = auth.uid()
);

SELECT 
  'User Projects' as info,
  p.id,
  p.name,
  p.description,
  p.organization_id
FROM projects p
WHERE p.organization_id = (
  SELECT organization_id FROM profiles WHERE id = auth.uid()
); 