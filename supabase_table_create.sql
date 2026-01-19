-- 재고 관리 테이블 생성
CREATE TABLE IF NOT EXISTS taro_selltime_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_stock INTEGER NOT NULL DEFAULT 20,
  sold_out_at TIMESTAMPTZ,
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 데이터 삽입 (하루에 하나만 존재하도록)
INSERT INTO taro_selltime_management (current_stock, last_reset_at)
VALUES (20, NOW())
ON CONFLICT DO NOTHING;

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_taro_selltime_management_updated_at
BEFORE UPDATE ON taro_selltime_management
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security 활성화 (필요시)
ALTER TABLE taro_selltime_management ENABLE ROW LEVEL SECURITY;

-- 읽기 권한 (익명 사용자도 읽기 가능)
CREATE POLICY "Allow public read access"
ON taro_selltime_management
FOR SELECT
USING (true);

-- 쓰기 권한은 서비스 키로만 (익명 사용자는 읽기만)
-- 실제 신청 시 재고 감소는 Edge Function이나 서비스 키로 처리
