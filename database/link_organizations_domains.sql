-- organizationsテーブルとdomainsテーブルの連携
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 既存のdomainカラムを削除（データがある場合は注意）
-- 注意: 既存のデータがある場合は、事前にバックアップを取ってください
ALTER TABLE organizations DROP COLUMN IF EXISTS domain;

-- 2. 新しいdomain_idカラムを追加（domainsテーブルのidを参照）
ALTER TABLE organizations ADD COLUMN domain_id UUID REFERENCES domains(id) ON DELETE SET NULL;

-- 3. インデックスを作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_organizations_domain_id ON organizations(domain_id);

-- 4. RLSポリシーを更新（domain_idを含める）
DROP POLICY IF EXISTS "Users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can update organizations" ON organizations;
DROP POLICY IF EXISTS "Users can delete organizations" ON organizations;

CREATE POLICY "Users can view organizations" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update organizations" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete organizations" ON organizations
  FOR DELETE USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 5. 組織のプライマリドメインを設定する関数を作成
CREATE OR REPLACE FUNCTION set_organization_primary_domain(
  org_id UUID,
  domain_id UUID
) RETURNS void AS $$
BEGIN
  -- 組織のdomain_idを更新
  UPDATE organizations 
  SET domain_id = domain_id 
  WHERE id = org_id;
  
  -- 指定されたドメインをプライマリに設定
  UPDATE domains 
  SET is_primary = true 
  WHERE id = domain_id AND organization_id = org_id;
  
  -- 同じ組織の他のドメインをプライマリから外す
  UPDATE domains 
  SET is_primary = false 
  WHERE organization_id = org_id AND id != domain_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 組織作成時にデフォルトドメインを設定するトリガー関数
CREATE OR REPLACE FUNCTION set_default_organization_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- 組織が作成された後、最初に作成されたドメインをプライマリに設定
  UPDATE organizations 
  SET domain_id = (
    SELECT id FROM domains 
    WHERE organization_id = NEW.id 
    ORDER BY created_at ASC 
    LIMIT 1
  )
  WHERE id = NEW.id AND domain_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. ドメイン作成時に組織のプライマリドメインを自動設定するトリガー
CREATE OR REPLACE FUNCTION auto_set_primary_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- 組織にドメインがまだ設定されていない場合、このドメインをプライマリに設定
  IF NOT EXISTS (
    SELECT 1 FROM organizations 
    WHERE id = NEW.organization_id AND domain_id IS NOT NULL
  ) THEN
    UPDATE organizations 
    SET domain_id = NEW.id 
    WHERE id = NEW.organization_id;
    
    NEW.is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. トリガーを作成
DROP TRIGGER IF EXISTS trigger_set_default_organization_domain ON organizations;
CREATE TRIGGER trigger_set_default_organization_domain
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION set_default_organization_domain();

DROP TRIGGER IF EXISTS trigger_auto_set_primary_domain ON domains;
CREATE TRIGGER trigger_auto_set_primary_domain
  BEFORE INSERT ON domains
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_primary_domain();

-- 9. 既存のデータを移行するためのヘルパー関数
CREATE OR REPLACE FUNCTION migrate_existing_domains()
RETURNS void AS $$
DECLARE
  org_record RECORD;
  primary_domain_id UUID;
BEGIN
  -- 各組織に対して、最初に作成されたドメインをプライマリに設定
  FOR org_record IN 
    SELECT DISTINCT organization_id 
    FROM domains 
    WHERE organization_id IS NOT NULL
  LOOP
    -- 組織の最初のドメインを取得
    SELECT id INTO primary_domain_id
    FROM domains 
    WHERE organization_id = org_record.organization_id 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- 組織のdomain_idを設定
    UPDATE organizations 
    SET domain_id = primary_domain_id 
    WHERE id = org_record.organization_id;
    
    -- そのドメインをプライマリに設定
    UPDATE domains 
    SET is_primary = true 
    WHERE id = primary_domain_id;
    
    -- 同じ組織の他のドメインをプライマリから外す
    UPDATE domains 
    SET is_primary = false 
    WHERE organization_id = org_record.organization_id AND id != primary_domain_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 既存データの移行を実行
SELECT migrate_existing_domains();

-- 11. 移行完了後、ヘルパー関数を削除
DROP FUNCTION IF EXISTS migrate_existing_domains();

-- 12. 確認用のクエリ
-- 組織とそのプライマリドメインの一覧を表示
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  o.domain_id,
  d.name as primary_domain_name,
  d.is_primary
FROM organizations o
LEFT JOIN domains d ON o.domain_id = d.id
ORDER BY o.created_at; 