# Supabase 무료 버전 대안: 새벽 5시 리셋

## 문제점
Supabase 무료 버전에서는 `pg_cron` 확장이 제한적이거나 사용 불가능할 수 있습니다.

## 해결 방법

### 방법 1: 외부 크론 서비스 사용 (추천)

**cron-job.org** (무료) 사용:

1. https://cron-job.org 접속 후 회원가입
2. 새 크론잡 생성:
   - **URL**: `https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/reset_stock_daily`
   - **Method**: POST
   - **Headers**:
     - `apikey`: `YOUR_SUPABASE_ANON_KEY`
     - `Content-Type`: `application/json`
   - **Schedule**: `0 5 * * *` (매일 새벽 5시)
   - **Timezone**: Asia/Seoul (KST)

3. 테스트: "Run now" 버튼으로 즉시 실행해서 확인

### 방법 2: Edge Function + 외부 크론

1. Supabase 대시보드 → Edge Functions → 새 함수 생성
   - 함수 이름: `reset-stock-daily`
   - 코드는 `supabase_scheduled_function.md` 참고

2. 외부 크론 서비스에서 Edge Function URL 호출:
   - URL: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/reset-stock-daily`
   - Method: POST
   - Headers: `Authorization: Bearer YOUR_SUPABASE_ANON_KEY`

### 방법 3: 수동 리셋 (임시)

Supabase SQL Editor에서 직접 실행:

```sql
SELECT reset_stock_daily();
```

또는 Supabase 대시보드에서 수동으로 실행

### 방법 4: 프론트엔드에서 체크 (간단한 대안)

`StockDisplay` 컴포넌트에서 매번 조회할 때:
- `last_reset_at`이 오늘 5시 이전이면 자동으로 리셋 함수 호출
- 완벽하지 않지만 간단한 대안

---

## 추천: 방법 1 (외부 크론 서비스)

가장 간단하고 확실한 방법입니다. 무료로 사용 가능하고 설정도 쉬워요.
