-- 無限再帰を完全に回避する安全なRLSポリシー
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

-- 4. プロフィールテーブルの安全なポリシー（無限再帰を完全に回避）

-- 自分のプロフィールの閲覧（シンプル）
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- 自分のプロフィールの更新（シンプル）
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- 自分のプロフィールの挿入（シンプル）
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- 組織メンバーのプロフィール閲覧（別のポリシーとして分離、無限再帰を回避）
CREATE POLICY "Users can view organization members" ON profiles
  FOR SELECT USING (
    organization_id IS NOT NULL AND 
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 5. 組織テーブルの安全なポリシー

-- 自分の組織の閲覧（シンプル）
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 組織の作成（誰でも作成可能）
CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- 組織管理者による組織の更新（シンプル）
CREATE POLICY "Organization admins can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL AND role IN ('admin', 'manager')
    )
  );

-- 6. プロジェクトテーブルの安全なポリシー

-- 自分の組織のプロジェクト閲覧（シンプル）
CREATE POLICY "Users can view projects in their organization" ON projects
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 自分の組織でのプロジェクト作成（シンプル）
CREATE POLICY "Users can create projects in their organization" ON projects
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 組織管理者によるプロジェクト更新（シンプル）
CREATE POLICY "Project managers can update projects" ON projects
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL AND role IN ('admin', 'manager')
    )
  );

-- 組織管理者によるプロジェクト削除（シンプル）
CREATE POLICY "Project managers can delete projects" ON projects
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL AND role IN ('admin', 'manager')
    )
  );

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
WHERE o.id IN (
  SELECT organization_id FROM profiles 
  WHERE id = auth.uid() AND organization_id IS NOT NULL
);

-- 10. プロジェクトテストクエリ
SELECT 
  'Projects test query:' as info,
  p.id,
  p.name,
  p.description,
  p.organization_id,
  p.status
FROM projects p
WHERE p.organization_id IN (
  SELECT organization_id FROM profiles 
  WHERE id = auth.uid() AND organization_id IS NOT NULL
); 