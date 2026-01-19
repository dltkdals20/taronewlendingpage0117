-- 테이블 상태 확인 쿼리들

-- 1. 테이블에 데이터가 있는지 확인
SELECT * FROM taro_selltime_management ORDER BY created_at DESC LIMIT 1;

-- 2. 신청 횟수 확인
SELECT get_application_count();

-- 3. 테이블 전체 확인
SELECT id, current_stock, last_reset_at, created_at, updated_at 
FROM taro_selltime_management 
ORDER BY created_at DESC;
