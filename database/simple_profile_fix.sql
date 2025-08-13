-- シンプルなプロフィール修正（RLS無効化）
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 現在のRLSポリシーを確認
SELECT 
  'Current RLS policies:' as info,
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 2. 一時的にRLSを無効化
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- 3. 現在のユーザーIDを確認
SELECT 
  'Current user ID:' as info,
  auth.uid() as user_id;

-- 4. 現在のユーザーのプロフィールを確認
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

-- 5. プロフィールが存在しない場合は作成（シンプル版）
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
  'user@example.com',  -- 一時的なメールアドレス
  '',
  '',
  'member',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid()
);

-- 6. 作成後のプロフィールを確認
SELECT 
  'Profile after creation:' as info,
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

-- 7. 組織情報も確認
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

-- 8. プロジェクト情報も確認
SELECT 
  'Projects info:' as info,
  p.id,
  p.name,
  p.description,
  p.organization_id,
  p.status
FROM projects p
WHERE p.organization_id IN (
  SELECT organization_id FROM profiles WHERE id = auth.uid()
);

-- 注意: テスト完了後は以下のコマンドでRLSを再度有効化してください:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY; 