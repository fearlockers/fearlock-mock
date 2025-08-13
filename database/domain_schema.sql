-- ドメイン設定用の詳細スキーマ
-- このファイルをSupabase SQL Editorで実行してください

-- 既存のdomainsテーブルを拡張
ALTER TABLE domains ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE domains ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive'));
ALTER TABLE domains ADD COLUMN IF NOT EXISTS ssl_enabled BOOLEAN DEFAULT false;
ALTER TABLE domains ADD COLUMN IF NOT EXISTS ssl_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE domains ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE domains ADD COLUMN IF NOT EXISTS ai_blocking VARCHAR(50) DEFAULT 'block-harmful' CHECK (ai_blocking IN ('block-all', 'block-harmful', 'allow-all'));
ALTER TABLE domains ADD COLUMN IF NOT EXISTS robots_management BOOLEAN DEFAULT true;

-- サブドメインテーブル
CREATE TABLE IF NOT EXISTS subdomains (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  ssl_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(domain_id, name)
);

-- DNSレコードテーブル
CREATE TABLE IF NOT EXISTS dns_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV')),
  name VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  ttl INTEGER DEFAULT 3600,
  priority INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ドメイン検証ログテーブル
CREATE TABLE IF NOT EXISTS domain_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  verification_type VARCHAR(50) NOT NULL CHECK (verification_type IN ('dns', 'ssl', 'nameserver')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  details JSONB,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_subdomains_domain_id ON subdomains(domain_id);
CREATE INDEX IF NOT EXISTS idx_dns_records_domain_id ON dns_records(domain_id);
CREATE INDEX IF NOT EXISTS idx_dns_records_type ON dns_records(type);
CREATE INDEX IF NOT EXISTS idx_domain_verifications_domain_id ON domain_verifications(domain_id);
CREATE INDEX IF NOT EXISTS idx_domain_verifications_status ON domain_verifications(status);

-- トリガーの作成
CREATE TRIGGER set_timestamp_subdomains
  BEFORE UPDATE ON subdomains
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER set_timestamp_dns_records
  BEFORE UPDATE ON dns_records
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- RLSポリシーの設定
ALTER TABLE subdomains ENABLE ROW LEVEL SECURITY;
ALTER TABLE dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_verifications ENABLE ROW LEVEL SECURITY;

-- サブドメインのRLSポリシー
CREATE POLICY "Users can view subdomains in their organization" ON subdomains
  FOR SELECT USING (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create subdomains in their organization" ON subdomains
  FOR INSERT WITH CHECK (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update subdomains in their organization" ON subdomains
  FOR UPDATE USING (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete subdomains in their organization" ON subdomains
  FOR DELETE USING (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- DNSレコードのRLSポリシー
CREATE POLICY "Users can view DNS records in their organization" ON dns_records
  FOR SELECT USING (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create DNS records in their organization" ON dns_records
  FOR INSERT WITH CHECK (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update DNS records in their organization" ON dns_records
  FOR UPDATE USING (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete DNS records in their organization" ON dns_records
  FOR DELETE USING (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ドメイン検証のRLSポリシー
CREATE POLICY "Users can view domain verifications in their organization" ON domain_verifications
  FOR SELECT USING (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create domain verifications in their organization" ON domain_verifications
  FOR INSERT WITH CHECK (
    domain_id IN (
      SELECT id FROM domains 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- 既存のdomainsテーブルのRLSポリシーを更新
DROP POLICY IF EXISTS "Users can view domains in their organization" ON domains;
DROP POLICY IF EXISTS "Users can create domains in their organization" ON domains;
DROP POLICY IF EXISTS "Users can update domains in their organization" ON domains;
DROP POLICY IF EXISTS "Users can delete domains in their organization" ON domains;

CREATE POLICY "Users can view domains in their organization" ON domains
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create domains in their organization" ON domains
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update domains in their organization" ON domains
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete domains in their organization" ON domains
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  ); 