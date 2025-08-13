-- 最小限のRLSポリシー（無限再帰を完全に回避）
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
WHERE tablename IN ('profiles', 'organizations', 'projects')
ORDER BY tablename, policyname;

-- 2. すべての既存ポリシーを削除
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view organization members" ON profiles;

DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization admins can update their organization" ON organizations;

DROP POLICY IF EXISTS "Users can view projects in their organization" ON projects;
DROP POLICY IF EXISTS "Users can create projects in their organization" ON projects;
DROP POLICY IF EXISTS "Project managers can update projects" ON projects;
DROP POLICY IF EXISTS "Project managers can delete projects" ON projects;

-- 3. RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 4. 最小限のプロフィールポリシー（無限再帰を完全に回避）

-- 自分のプロフィールの閲覧（最小限）
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- 自分のプロフィールの更新（最小限）
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- 自分のプロフィールの挿入（最小限）
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- 5. 最小限の組織ポリシー

-- 組織の作成（誰でも作成可能）
CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- 組織の閲覧（最小限）
CREATE POLICY "Users can view organizations" ON organizations
  FOR SELECT USING (true);

-- 組織の更新（最小限）
CREATE POLICY "Users can update organizations" ON organizations
  FOR UPDATE USING (true);

-- 6. 最小限のプロジェクトポリシー

-- プロジェクトの作成（誰でも作成可能）
CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (true);

-- プロジェクトの閲覧（最小限）
CREATE POLICY "Users can view projects" ON projects
  FOR SELECT USING (true);

-- プロジェクトの更新（最小限）
CREATE POLICY "Users can update projects" ON projects
  FOR UPDATE USING (true);

-- プロジェクトの削除（最小限）
CREATE POLICY "Users can delete projects" ON projects
  FOR DELETE USING (true);

-- 7. 設定後のポリシーを確認
SELECT 
  'Updated RLS policies:' as info,
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'organizations', 'projects')
ORDER BY tablename, policyname;

-- 8. テストクエリ（ポリシーが正しく動作することを確認）
SELECT 
  'Profile test query:' as info,
  id,
  email,
  first_name,
  last_name,
  organization_id,
  role
FROM profiles 
WHERE id = auth.uid();

-- 9. 組織テストクエリ
SELECT 
  'Organization test query:' as info,
  o.id,
  o.name,
  o.description,
  o.plan
FROM organizations o
LIMIT 5;

-- 10. プロジェクトテストクエリ
SELECT 
  'Projects test query:' as info,
  p.id,
  p.name,
  p.description,
  p.organization_id,
  p.status
FROM projects p
LIMIT 5;

-- 注意: この設定は最小限のセキュリティです。
-- 本番環境では、より厳密なポリシーを設定することを推奨します。 