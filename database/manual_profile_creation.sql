-- 手動でプロフィールを作成（認証エラーの場合）
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 認証状態を確認
SELECT 
  'Authentication status:' as info,
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- 2. 一時的にRLSを無効化
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- 3. 既存のプロフィールを確認
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

-- 4. 手動でプロフィールを作成（ユーザーIDを指定）
-- 注意: 以下のユーザーIDを実際のユーザーIDに変更してください
-- ユーザーIDは以下の方法で確認できます：
-- 1. アプリケーションでログイン
-- 2. ブラウザの開発者ツールでコンソールを開く
-- 3. 以下のコマンドを実行: console.log('User ID:', supabase.auth.user()?.id)

-- 例: ユーザーIDが '4f435007-7444-4b71-ae0b-832511a2a82c' の場合
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

-- 5. 作成後のプロフィールを確認
SELECT 
  'Profile after manual creation:' as info,
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

-- 6. 組織情報も確認
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

-- 7. プロジェクト情報も確認
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

-- 注意: 
-- 1. ユーザーIDを実際のIDに変更してください
-- 2. メールアドレスを実際のアドレスに変更してください
-- 3. テスト完了後は以下のコマンドでRLSを再度有効化してください:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY; 