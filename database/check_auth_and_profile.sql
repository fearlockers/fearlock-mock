-- 認証状態を確認し、適切にプロフィールを作成
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 認証状態を確認
SELECT 
  'Authentication status:' as info,
  auth.uid() as current_user_id,
  auth.jwt() as jwt_token,
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

-- 3. 一時的にRLSを無効化
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- 4. 既存のプロフィールを確認
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

-- 5. 認証されたユーザーの場合のみプロフィールを作成
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- 現在のユーザーIDを取得
  user_id := auth.uid();
  
  -- ユーザーIDが存在する場合のみプロフィールを作成
  IF user_id IS NOT NULL THEN
    -- プロフィールが存在しない場合は作成
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
      user_id,
      COALESCE((auth.jwt() ->> 'email')::text, 'user@example.com'),
      COALESCE((auth.jwt() ->> 'user_metadata')::jsonb ->> 'first_name', ''),
      COALESCE((auth.jwt() ->> 'user_metadata')::jsonb ->> 'last_name', ''),
      'member',
      NOW(),
      NOW()
    WHERE NOT EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id
    );
    
    RAISE NOTICE 'Profile created/checked for user: %', user_id;
  ELSE
    RAISE NOTICE 'No authenticated user found. Please log in first.';
  END IF;
END $$;

-- 6. 作成後のプロフィールを確認
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