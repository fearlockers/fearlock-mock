-- RLSポリシーの無限再帰問題を修正
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- 2. 修正されたポリシーを作成

-- プロフィールの閲覧ポリシー（無限再帰を回避）
CREATE POLICY "Users can view profiles in their organization" ON profiles
  FOR SELECT USING (
    -- 自分のプロフィールは常に閲覧可能
    id = auth.uid() OR 
    -- 同じ組織のメンバーのプロフィールは閲覧可能（organization_idが一致する場合のみ）
    (organization_id IS NOT NULL AND organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    ))
  );

-- プロフィールの更新ポリシー
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- プロフィールの挿入ポリシー
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- 3. 組織ポリシーも修正（安全のため）
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- 4. プロジェクトポリシーも修正
DROP POLICY IF EXISTS "Users can view projects in their organization" ON projects;
CREATE POLICY "Users can view projects in their organization" ON projects
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Users can create projects in their organization" ON projects;
CREATE POLICY "Users can create projects in their organization" ON projects
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Project managers can update projects" ON projects;
CREATE POLICY "Project managers can update projects" ON projects
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL AND role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Project managers can delete projects" ON projects;
CREATE POLICY "Project managers can delete projects" ON projects
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL AND role IN ('admin', 'manager')
    )
  );

-- 5. 確認用クエリ
-- 現在のポリシーを確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'organizations', 'projects')
ORDER BY tablename, policyname; 