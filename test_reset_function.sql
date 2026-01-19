-- reset_application_count 함수 테스트

-- 1. 현재 상태 확인
SELECT 
    id,
    current_stock,
    last_reset_at,
    created_at,
    updated_at
FROM taro_selltime_management 
ORDER BY created_at DESC 
LIMIT 1;

-- 2. 신청 횟수 증가 테스트 (1로 만들기)
SELECT increment_application_count() AS new_count;

-- 3. 다시 확인
SELECT get_application_count() AS current_count;

-- 4. 리셋 함수 실행
SELECT reset_application_count() AS reset_result;

-- 5. 최종 확인 (last_reset_at이 업데이트되었는지 확인)
SELECT 
    id,
    current_stock,
    last_reset_at,
    created_at,
    updated_at
FROM taro_selltime_management 
ORDER BY created_at DESC 
LIMIT 1;
