-- ============================================
-- 재고 관리 함수들 (새로운 로직)
-- ============================================
-- current_stock = 오늘 신청 횟수로 재활용
-- 화면 재고 = 시간대별 계산값 - 신청 횟수 (프론트에서 계산)

-- 1. 신청 횟수 증가 함수 (신청 완료 시 호출)
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
    stock_record RECORD;
BEGIN
    -- 현재 신청 횟수 가져오기
    SELECT id, current_stock INTO stock_record
    FROM taro_selltime_management
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF stock_record IS NULL THEN
        -- 레코드가 없으면 새로 생성
        INSERT INTO taro_selltime_management (current_stock, last_reset_at)
        VALUES (1, NOW())
        RETURNING current_stock INTO new_count;
        RETURN new_count;
    END IF;
    
    -- 신청 횟수 증가
    UPDATE taro_selltime_management
    SET current_stock = current_stock + 1
    WHERE id = stock_record.id;
    
    RETURN stock_record.current_stock + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 신청 횟수 조회 함수
CREATE OR REPLACE FUNCTION get_application_count()
RETURNS INTEGER AS $$
DECLARE
    app_count INTEGER;
BEGIN
    SELECT COALESCE(current_stock, 0) INTO app_count
    FROM taro_selltime_management
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(app_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 새벽 5시 리셋 함수 (신청 횟수만 0으로 리셋)
CREATE OR REPLACE FUNCTION reset_application_count()
RETURNS INTEGER AS $$
BEGIN
    -- 기존 레코드가 있으면 신청 횟수만 0으로 리셋
    UPDATE taro_selltime_management
    SET current_stock = 0,
        last_reset_at = NOW()
    WHERE id = (SELECT id FROM taro_selltime_management ORDER BY created_at DESC LIMIT 1);
    
    -- 레코드가 없으면 새로 생성
    IF NOT FOUND THEN
        INSERT INTO taro_selltime_management (current_stock, last_reset_at)
        VALUES (0, NOW());
    END IF;
    
    RETURN 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS 정책 업데이트 (함수 실행 권한)
-- ============================================

-- get_application_count 함수는 익명 사용자도 호출 가능
GRANT EXECUTE ON FUNCTION get_application_count() TO anon;
GRANT EXECUTE ON FUNCTION get_application_count() TO authenticated;

-- increment_application_count 함수는 익명 사용자도 호출 가능
GRANT EXECUTE ON FUNCTION increment_application_count() TO anon;
GRANT EXECUTE ON FUNCTION increment_application_count() TO authenticated;
GRANT EXECUTE ON FUNCTION increment_application_count() TO service_role;

-- reset_application_count 함수는 서비스 키로만 (크론에서 호출)
GRANT EXECUTE ON FUNCTION reset_application_count() TO service_role;

-- 4. 재고가 0이 된 시점 기록 함수
CREATE OR REPLACE FUNCTION set_sold_out_at()
RETURNS TIMESTAMPTZ AS $$
DECLARE
    record_id UUID;
    sold_out_time TIMESTAMPTZ;
BEGIN
    SELECT id INTO record_id
    FROM taro_selltime_management
    ORDER BY created_at DESC
    LIMIT 1;

    IF record_id IS NULL THEN
        INSERT INTO taro_selltime_management (current_stock, sold_out_at, last_reset_at)
        VALUES (0, NOW(), NOW())
        RETURNING sold_out_at INTO sold_out_time;
        RETURN sold_out_time;
    END IF;

    UPDATE taro_selltime_management
    SET sold_out_at = NOW()
    WHERE id = record_id
    RETURNING sold_out_at INTO sold_out_time;

    RETURN sold_out_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. sold_out_at 조회 함수
CREATE OR REPLACE FUNCTION get_sold_out_at()
RETURNS TIMESTAMPTZ AS $$
DECLARE
    sold_out_time TIMESTAMPTZ;
BEGIN
    SELECT sold_out_at INTO sold_out_time
    FROM taro_selltime_management
    ORDER BY created_at DESC
    LIMIT 1;

    RETURN sold_out_time;
END;
$$ LANGUAGE plpgsql;

-- 6. reset_application_count 함수 수정 (sold_out_at도 초기화)
CREATE OR REPLACE FUNCTION reset_application_count()
RETURNS INTEGER AS $$
BEGIN
    -- 기존 레코드가 있으면 신청 횟수만 0으로 리셋하고 sold_out_at 초기화
    UPDATE taro_selltime_management
    SET current_stock = 0,
        last_reset_at = NOW(),
        sold_out_at = NULL
    WHERE id = (SELECT id FROM taro_selltime_management ORDER BY created_at DESC LIMIT 1);
    
    -- 레코드가 없으면 새로 생성
    IF NOT FOUND THEN
        INSERT INTO taro_selltime_management (current_stock, last_reset_at, sold_out_at)
        VALUES (0, NOW(), NULL);
    END IF;
    
    RETURN 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS 정책 업데이트
GRANT EXECUTE ON FUNCTION set_sold_out_at() TO anon;
GRANT EXECUTE ON FUNCTION set_sold_out_at() TO authenticated;
GRANT EXECUTE ON FUNCTION set_sold_out_at() TO service_role;

GRANT EXECUTE ON FUNCTION get_sold_out_at() TO anon;
GRANT EXECUTE ON FUNCTION get_sold_out_at() TO authenticated;
