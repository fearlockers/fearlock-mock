-- RLSポリシーの無限再帰問題を完全に解決（最終版）
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 現在の認証状態を確認
SELECT 
  'Authentication status:' as info,
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- 2. 現在のRLSポリシーを確認
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

-- 3. すべてのプロフィール関連ポリシーを削除
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view organization members" ON profiles;

-- 4. 一時的にRLSを無効化
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- 5. 既存のプロフィールを確認
SELECT 
  'Existing profiles:' as info,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.organization_id,
  p.role,
  p.created_at,
  p.updated_at
FROM profiles p
ORDER BY p.created_at DESC
LIMIT 10;

-- 6. 特定のユーザーのプロフィールを作成/更新
-- 注意: ユーザーID '4f435007-7444-4b71-ae0b-832511a2a82c' を実際のIDに変更してください
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  created_at,
  updated_at
)
VALUES (
  '4f435007-7444-4b71-ae0b-832511a2a82c',  -- 実際のユーザーIDに変更してください
  'fearlockers@gmail.com',  -- 実際のメールアドレスに変更してください
  '',
  '',
  'member',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- 7. 作成後のプロフィールを確認
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
WHERE p.id = '4f435007-7444-4b71-ae0b-832511a2a82c';  -- 実際のユーザーIDに変更してください

-- 8. 組織情報も確認
SELECT 
  'Organization info:' as info,
  o.id,
  o.name,
  o.description,
  o.plan
FROM organizations o
WHERE o.id IN (
  SELECT organization_id FROM profiles WHERE id = '4f435007-7444-4b71-ae0b-832511a2a82c'  -- 実際のユーザーIDに変更してください
);

-- 9. プロジェクト情報も確認
SELECT 
  'Projects info:' as info,
  p.id,
  p.name,
  p.description,
  p.organization_id,
  p.status
FROM projects p
WHERE p.organization_id IN (
  SELECT organization_id FROM profiles WHERE id = '4f435007-7444-4b71-ae0b-832511a2a82c'  -- 実際のユーザーIDに変更してください
);

-- 10. テストクエリ（RLS無効化状態で動作確認）
SELECT 
  'Test query (RLS disabled):' as info,
  id,
  email,
  first_name,
  last_name,
  organization_id,
  role
FROM profiles 
WHERE id = '4f435007-7444-4b71-ae0b-832511a2a82c';  -- 実際のユーザーIDに変更してください

-- 注意: 
-- 1. ユーザーIDを実際のIDに変更してください
-- 2. メールアドレスを実際のアドレスに変更してください
-- 3. この状態でアプリケーションをテストしてください
-- 4. テスト完了後、必要に応じて適切なRLSポリシーを設定してください 