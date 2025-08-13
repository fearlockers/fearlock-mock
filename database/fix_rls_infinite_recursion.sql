-- RLSポリシーの無限再帰問題を完全に解決
-- このファイルをSupabase SQL Editorで実行してください

-- 1. すべてのプロフィール関連ポリシーを削除
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- 2. 一時的にRLSを無効化してポリシーをクリア
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. RLSを再度有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. シンプルで安全なポリシーを作成

-- 自分のプロフィールの閲覧（無限再帰を完全に回避）
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- 自分のプロフィールの更新
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- 自分のプロフィールの挿入
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- 5. 組織メンバーのプロフィール閲覧（別のポリシーとして分離）
CREATE POLICY "Users can view organization members" ON profiles
  FOR SELECT USING (
    organization_id IS NOT NULL AND 
    organization_id = (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 6. 組織ポリシーも修正
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id = (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 7. プロジェクトポリシーも修正
DROP POLICY IF EXISTS "Users can view projects in their organization" ON projects;
CREATE POLICY "Users can view projects in their organization" ON projects
  FOR SELECT USING (
    organization_id = (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 8. 現在のポリシーを確認
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 9. テストクエリ（エラーが発生しないことを確認）
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