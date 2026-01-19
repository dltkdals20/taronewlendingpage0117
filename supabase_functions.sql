-- ============================================
-- 재고 관리 함수들
-- ============================================

-- 1. 시간대별 시나리오에 따른 재고 계산 함수
CREATE OR REPLACE FUNCTION calculate_display_stock()
RETURNS INTEGER AS $$
DECLARE
    current_hour INTEGER;
    current_minute INTEGER;
    base_stock INTEGER;
    calculated_stock INTEGER;
    db_stock RECORD;
BEGIN
    -- 현재 시간 가져오기
    current_hour := EXTRACT(HOUR FROM NOW());
    current_minute := EXTRACT(MINUTE FROM NOW());
    
    -- DB에서 현재 재고 가져오기
    SELECT current_stock, sold_out_at INTO db_stock
    FROM taro_selltime_management
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- sold_out_at이 있고 10분이 지나지 않았으면 0 반환
    IF db_stock.sold_out_at IS NOT NULL THEN
        IF NOW() - db_stock.sold_out_at < INTERVAL '10 minutes' THEN
            RETURN 0;
        ELSE
            -- 10분 지났으면 2개로 복구
            UPDATE taro_selltime_management
            SET current_stock = 2, sold_out_at = NULL
            WHERE id = (SELECT id FROM taro_selltime_management ORDER BY created_at DESC LIMIT 1);
            RETURN 2;
        END IF;
    END IF;
    
    base_stock := COALESCE(db_stock.current_stock, 20);
    
    -- 시간대별 시나리오 적용
    -- 05:00 ~ 07:59: 리셋 후 아침 (15~18개)
    IF current_hour >= 5 AND current_hour < 8 THEN
        calculated_stock := 15 + (current_hour - 5) * 1; -- 15~17개 정도
        IF calculated_stock > 18 THEN calculated_stock := 18; END IF;
    -- 08:00 ~ 11:59: 오전 (14~18개)
    ELSIF current_hour >= 8 AND current_hour < 12 THEN
        calculated_stock := 18 - (current_hour - 8) * 1; -- 점점 감소
        IF calculated_stock < 14 THEN calculated_stock := 14; END IF;
    -- 12:00 ~ 16:59: 이른 오후 (9~13개)
    ELSIF current_hour >= 12 AND current_hour < 17 THEN
        calculated_stock := 13 - (current_hour - 12) * 1;
        IF calculated_stock < 9 THEN calculated_stock := 9; END IF;
    -- 17:00 ~ 20:59: 초저녁 (5~8개)
    ELSIF current_hour >= 17 AND current_hour < 21 THEN
        calculated_stock := 8 - (current_hour - 17) * 1;
        IF calculated_stock < 5 THEN calculated_stock := 5; END IF;
    -- 21:00 ~ 22:59: 피크 시작 (3~5개)
    ELSIF current_hour >= 21 AND current_hour < 23 THEN
        calculated_stock := 5 - (current_hour - 21) * 1;
        IF calculated_stock < 3 THEN calculated_stock := 3; END IF;
    -- 23:00 ~ 23:29: 피크 한가운데 (2~3개)
    ELSIF current_hour = 23 AND current_minute < 30 THEN
        calculated_stock := 3 - (current_minute / 10);
        IF calculated_stock < 2 THEN calculated_stock := 2; END IF;
    -- 23:30 ~ 23:59: 자정 직전 (1개 고정)
    ELSIF current_hour = 23 AND current_minute >= 30 THEN
        calculated_stock := 1;
    -- 00:00 ~ 01:59: 자정 이후 새벽, 피크 연장 (1~2개)
    ELSIF current_hour >= 0 AND current_hour < 2 THEN
        calculated_stock := 2 - (current_hour);
        IF calculated_stock < 1 THEN calculated_stock := 1; END IF;
    -- 02:00 ~ 04:59: 새벽, 막차 느낌 유지 (1~2개)
    ELSE
        calculated_stock := 2 - ((current_hour - 2) / 2);
        IF calculated_stock < 1 THEN calculated_stock := 1; END IF;
    END IF;
    
    -- 실제 재고보다 계산된 재고가 크면 실제 재고 사용 (절대 증가하지 않도록)
    IF calculated_stock > base_stock THEN
        calculated_stock := base_stock;
    END IF;
    
    RETURN calculated_stock;
END;
$$ LANGUAGE plpgsql;

-- 2. 재고 감소 함수 (신청 완료 시 호출)
CREATE OR REPLACE FUNCTION decrease_stock()
RETURNS INTEGER AS $$
DECLARE
    current_stock_val INTEGER;
    stock_record RECORD;
BEGIN
    -- 현재 재고 가져오기
    SELECT id, current_stock INTO stock_record
    FROM taro_selltime_management
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF stock_record IS NULL THEN
        RETURN 0;
    END IF;
    
    current_stock_val := stock_record.current_stock;
    
    -- 재고가 0이면 감소하지 않음
    IF current_stock_val <= 0 THEN
        RETURN 0;
    END IF;
    
    -- 재고 감소
    UPDATE taro_selltime_management
    SET current_stock = current_stock - 1,
        sold_out_at = CASE 
            WHEN current_stock - 1 = 0 THEN NOW()
            ELSE sold_out_at
        END
    WHERE id = stock_record.id;
    
    RETURN current_stock_val - 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 재고 복구 함수 (0개 → 10분 후 2개)
CREATE OR REPLACE FUNCTION restore_stock_after_soldout()
RETURNS INTEGER AS $$
DECLARE
    stock_record RECORD;
BEGIN
    SELECT id, current_stock, sold_out_at INTO stock_record
    FROM taro_selltime_management
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF stock_record IS NULL THEN
        RETURN 0;
    END IF;
    
    -- sold_out_at이 있고 10분이 지났으면 2개로 복구
    IF stock_record.sold_out_at IS NOT NULL THEN
        IF NOW() - stock_record.sold_out_at >= INTERVAL '10 minutes' THEN
            UPDATE taro_selltime_management
            SET current_stock = 2,
                sold_out_at = NULL
            WHERE id = stock_record.id;
            RETURN 2;
        END IF;
    END IF;
    
    RETURN stock_record.current_stock;
END;
$$ LANGUAGE plpgsql;

-- 4. 새벽 5시 리셋 함수
CREATE OR REPLACE FUNCTION reset_stock_daily()
RETURNS INTEGER AS $$
DECLARE
    reset_stock INTEGER;
BEGIN
    -- 15~18개 사이 랜덤으로 리셋
    reset_stock := 15 + FLOOR(RANDOM() * 4)::INTEGER;
    
    -- 기존 레코드 업데이트 또는 새 레코드 생성
    INSERT INTO taro_selltime_management (current_stock, last_reset_at, sold_out_at)
    VALUES (reset_stock, NOW(), NULL)
    ON CONFLICT DO NOTHING;
    
    -- 기존 레코드가 있으면 업데이트
    UPDATE taro_selltime_management
    SET current_stock = reset_stock,
        last_reset_at = NOW(),
        sold_out_at = NULL
    WHERE id = (SELECT id FROM taro_selltime_management ORDER BY created_at DESC LIMIT 1);
    
    RETURN reset_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 재고 조회 함수 (클라이언트에서 호출)
CREATE OR REPLACE FUNCTION get_current_stock()
RETURNS TABLE(stock INTEGER) AS $$
DECLARE
    display_stock INTEGER;
BEGIN
    -- 복구 체크
    PERFORM restore_stock_after_soldout();
    
    -- 시간대별 계산된 재고 가져오기
    display_stock := calculate_display_stock();
    
    RETURN QUERY SELECT display_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS 정책 업데이트 (함수 실행 권한)
-- ============================================

-- get_current_stock 함수는 익명 사용자도 호출 가능
GRANT EXECUTE ON FUNCTION get_current_stock() TO anon;
GRANT EXECUTE ON FUNCTION get_current_stock() TO authenticated;

-- decrease_stock 함수는 익명 사용자도 호출 가능 (프론트엔드에서 직접 호출)
GRANT EXECUTE ON FUNCTION decrease_stock() TO anon;
GRANT EXECUTE ON FUNCTION decrease_stock() TO authenticated;
GRANT EXECUTE ON FUNCTION decrease_stock() TO service_role;
