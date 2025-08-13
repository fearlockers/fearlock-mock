-- 現在のユーザーのプロフィールを確認し、存在しない場合は作成
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 現在のユーザーのプロフィールを確認
SELECT 
  'Current user profile:' as info,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.organization_id,
  p.role,
  p.created_at,
  p.updated_at
FROM profiles p
WHERE p.id = auth.uid();

-- 2. プロフィールが存在しない場合の作成
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  created_at,
  updated_at
)
SELECT 
  auth.uid(),
  auth.jwt() ->> 'email',
  COALESCE(auth.jwt() ->> 'user_metadata' ->> 'first_name', ''),
  COALESCE(auth.jwt() ->> 'user_metadata' ->> 'last_name', ''),
  'member',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid()
);

-- 3. 作成後のプロフィールを確認
SELECT 
  'Profile after creation/check:' as info,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.organization_id,
  p.role,
  p.created_at,
  p.updated_at
FROM profiles p
WHERE p.id = auth.uid();

-- 4. 組織情報も確認
SELECT 
  'Organization info:' as info,
  o.id,
  o.name,
  o.description,
  o.plan
FROM organizations o
WHERE o.id IN (
  SELECT organization_id FROM profiles WHERE id = auth.uid()
); 