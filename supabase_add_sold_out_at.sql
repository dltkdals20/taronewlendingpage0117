-- sold_out_at 필드 추가 (재고가 0이 된 시점 기록)
ALTER TABLE taro_selltime_management 
ADD COLUMN IF NOT EXISTS sold_out_at TIMESTAMPTZ;
