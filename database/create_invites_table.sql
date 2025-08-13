-- 招待テーブルの作成
-- このファイルをSupabase SQL Editorで実行してください

-- 招待テーブルを作成
CREATE TABLE IF NOT EXISTS invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  token TEXT UNIQUE DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES auth.users(id)
);

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email);
CREATE INDEX IF NOT EXISTS idx_invites_organization_id ON invites(organization_id);
CREATE INDEX IF NOT EXISTS idx_invites_status ON invites(status);
CREATE INDEX IF NOT EXISTS idx_invites_token ON invites(token);
CREATE INDEX IF NOT EXISTS idx_invites_expires_at ON invites(expires_at);

-- RLSを有効化
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- RLSポリシーを作成
-- 組織のメンバーは招待を閲覧できる
CREATE POLICY "Users can view invites for their organization" ON invites
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 組織の管理者は招待を作成できる
CREATE POLICY "Users can create invites for their organization" ON invites
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND organization_id = invites.organization_id 
      AND role IN ('admin', 'owner')
    )
  );

-- 組織の管理者は招待を更新できる
CREATE POLICY "Users can update invites for their organization" ON invites
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND organization_id = invites.organization_id 
      AND role IN ('admin', 'owner')
    )
  );

-- 組織の管理者は招待を削除できる
CREATE POLICY "Users can delete invites for their organization" ON invites
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND organization_id = invites.organization_id 
      AND role IN ('admin', 'owner')
    )
  );

-- 期限切れの招待を自動的に更新する関数
CREATE OR REPLACE FUNCTION update_expired_invites()
RETURNS void AS $$
BEGIN
  UPDATE invites 
  SET status = 'expired' 
  WHERE status = 'pending' 
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 定期的に期限切れの招待を更新する（毎分実行）
-- 注意: pg_cron拡張機能が有効になっている場合のみ実行可能
-- 拡張機能が無効な場合は、この部分をコメントアウトしてください
-- SELECT cron.schedule(
--   'update-expired-invites',
--   '* * * * *',
--   'SELECT update_expired_invites();'
-- );

-- 代替案: 手動で期限切れの招待を更新する関数
CREATE OR REPLACE FUNCTION cleanup_expired_invites()
RETURNS void AS $$
BEGIN
  UPDATE invites 
  SET status = 'expired' 
  WHERE status = 'pending' 
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 招待テーブルの確認
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'invites' 
ORDER BY ordinal_position; 