-- プロジェクトのテストデータを作成
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 現在のプロジェクトを確認
SELECT 
  'Current projects:' as info,
  id,
  name,
  description,
  organization_id,
  status,
  created_by,
  created_at
FROM projects
ORDER BY created_at DESC;

-- 2. 現在の組織を確認
SELECT 
  'Current organizations:' as info,
  id,
  name,
  description,
  plan
FROM organizations
ORDER BY created_at DESC;

-- 3. 現在のプロフィールを確認
SELECT 
  'Current profiles:' as info,
  id,
  email,
  first_name,
  last_name,
  organization_id,
  role
FROM profiles
ORDER BY created_at DESC;

-- 4. テストプロジェクトを作成（組織IDは実際の組織IDに置き換えてください）
-- 注意: 以下のINSERT文のorganization_idを実際の組織IDに変更してください

-- 例: 組織IDが 'your-organization-id' の場合
-- INSERT INTO projects (id, organization_id, name, description, url, status, created_by, created_at, updated_at)
-- VALUES 
--   ('proj-1', 'your-organization-id', 'Webアプリケーション', 'メインのWebアプリケーション', 'https://example.com', 'active', 'your-user-id', NOW(), NOW()),
--   ('proj-2', 'your-organization-id', 'APIサービス', 'バックエンドAPIサービス', 'https://api.example.com', 'active', 'your-user-id', NOW(), NOW()),
--   ('proj-3', 'your-organization-id', 'モバイルアプリ', 'iOS/Androidアプリ', 'https://mobile.example.com', 'active', 'your-user-id', NOW(), NOW());

-- 5. 作成後のプロジェクトを確認
SELECT 
  'Projects after creation:' as info,
  id,
  name,
  description,
  organization_id,
  status,
  created_by,
  created_at
FROM projects
ORDER BY created_at DESC;

-- 6. RLSポリシーの確認
SELECT 
  'RLS policies for projects:' as info,
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'projects'
ORDER BY policyname; 