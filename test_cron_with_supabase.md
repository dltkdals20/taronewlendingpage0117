# 크론 + Supabase 통합 테스트 가이드

## 테스트 순서

### 1단계: 초기 상태 확인 (Supabase SQL Editor)

```sql
-- 현재 신청 횟수 확인
SELECT get_application_count() AS current_count;

-- 테이블 전체 확인
SELECT 
    id,
    current_stock,
    last_reset_at,
    created_at,
    updated_at
FROM taro_selltime_management 
ORDER BY created_at DESC 
LIMIT 1;
```

**예상 결과**: `current_stock = 0` (또는 이전 값)

---

### 2단계: 신청 횟수 증가 (테스트용)

```sql
-- 신청 횟수를 5로 증가시켜보기 (여러 번 실행)
SELECT increment_application_count(); -- 1
SELECT increment_application_count(); -- 2
SELECT increment_application_count(); -- 3
SELECT increment_application_count(); -- 4
SELECT increment_application_count(); -- 5

-- 확인
SELECT get_application_count() AS after_increment;
```

**예상 결과**: `after_increment = 5`

---

### 3단계: Railway 크론 실행

1. **Railway 대시보드** → 크론 서비스로 이동
2. **"Run Now"** 버튼 클릭
3. **로그 확인**:
   - 성공: `exit 0` 또는 HTTP 200 응답
   - 실패: 에러 메시지 확인

---

### 4단계: 크론 실행 후 확인 (Supabase SQL Editor)

```sql
-- 신청 횟수 확인 (0으로 리셋되었는지)
SELECT get_application_count() AS after_cron;

-- 테이블 확인 (last_reset_at이 업데이트되었는지)
SELECT 
    id,
    current_stock,
    last_reset_at,
    created_at,
    updated_at
FROM taro_selltime_management 
ORDER BY created_at DESC 
LIMIT 1;
```

**예상 결과**:
- `current_stock = 0` ✅
- `last_reset_at = (방금 크론 실행한 시간)` ✅

---

## 성공 기준

✅ `get_application_count()`가 0을 반환  
✅ `last_reset_at`이 크론 실행 시간으로 업데이트됨  
✅ Railway 로그에 성공 메시지 표시

---

## 문제 해결

### 크론이 실행되지 않는 경우
- Railway 로그 확인
- 환경 변수 (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) 확인
- 함수 이름 (`reset_application_count`) 확인

### 함수가 실행되지 않는 경우
- Supabase에서 함수 존재 확인: `SELECT routine_name FROM information_schema.routines WHERE routine_name = 'reset_application_count';`
- RLS 정책 확인
- 직접 실행 테스트: `SELECT reset_application_count();`
