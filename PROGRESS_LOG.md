# 작업 진행 상황 로그

## 📅 마지막 업데이트: 2025년 1월 (오늘)

---

## ✅ 완료된 작업

### 1. Supabase 테이블 및 함수 설정

#### 테이블 생성
- ✅ `supabase_drop_table.sql` 생성 (기존 테이블 삭제용)
- ✅ `supabase_table_create_v2.sql` 생성 (새 테이블 생성)
  - 테이블명: `taro_selltime_management`
  - 필드: `id`, `current_stock` (신청 횟수), `last_reset_at`, `created_at`, `updated_at`

#### 함수 생성
- ✅ `supabase_functions_v2.sql` 생성
  - `increment_application_count()`: 신청 횟수 증가
  - `get_application_count()`: 신청 횟수 조회
  - `reset_application_count()`: 새벽 5시 신청 횟수 리셋

#### 실행 상태
- ⚠️ **확인 필요**: Supabase에서 다음 순서로 실행했는지 확인
  1. `supabase_drop_table.sql` 실행
  2. `supabase_table_create_v2.sql` 실행
  3. `supabase_functions_v2.sql` 실행

---

### 2. 프론트엔드 로직 구현

#### 시간대별 재고 계산
- ✅ `src/app/utils/timeBasedStock.ts` 생성
  - 한국 시간 기준 시간대별 계산값 반환
  - 랜덤 없이 고정값 사용

#### 재고 표시 컴포넌트
- ✅ `src/app/desktop/components/StockDisplay.tsx` 수정
  - 화면 재고 = 시간대별 계산값 - 신청 횟수
  - `refreshTrigger` prop으로 즉시 갱신 지원
  - 30초마다 자동 갱신

#### 신청 모달
- ✅ `src/app/desktop/components/ApplicationModal.tsx` 수정
  - 신청 완료 시 `increment_application_count()` 호출
  - `onStockDecreased` 콜백으로 부모 컴포넌트에 알림

#### 히어로 섹션
- ✅ `src/app/desktop/components/HeroSection.tsx` 수정
  - `stockRefreshTrigger` 상태로 재고 갱신 트리거
  - 신청 완료 시 즉시 재고 갱신

---

### 3. Railway 크론 설정

#### 크론 서비스 설정
- ✅ Docker Image 서비스 생성 (`curlimages/curl:latest`)
- ✅ 환경 변수 설정:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- ✅ Start Command 설정:
  ```bash
  sh -c 'curl -sS --fail -X POST "${SUPABASE_URL}/rest/v1/rpc/reset_application_count" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{}" && exit 0'
  ```
- ✅ Cron Schedule: `0 20 * * *` (UTC 20:00 = KST 새벽 5시)

#### 문서
- ✅ `railway_cron_reset_v2.md` 생성 (크론 수정 가이드)
- ✅ `test_cron_with_supabase.md` 생성 (크론 테스트 가이드)

---

## 🔄 다음에 해야 할 작업

### 1. Supabase 설정 확인 및 테스트
- [ ] `supabase_drop_table.sql` 실행 여부 확인
- [ ] `supabase_table_create_v2.sql` 실행 여부 확인
- [ ] `supabase_functions_v2.sql` 실행 여부 확인
- [ ] 함수 테스트:
  ```sql
  SELECT increment_application_count();
  SELECT get_application_count();
  SELECT reset_application_count();
  ```

### 2. Railway 크론 테스트
- [ ] `test_cron_with_supabase.md` 가이드 따라 테스트
- [ ] 크론 실행 전: 신청 횟수를 5로 증가
- [ ] Railway에서 "Run Now" 클릭
- [ ] 크론 실행 후: 신청 횟수가 0으로 리셋되었는지 확인
- [ ] `last_reset_at`이 업데이트되었는지 확인

### 3. 프론트엔드 통합 테스트
- [ ] 로컬 서버 실행 (`npm run dev`)
- [ ] 신청 완료 시 재고가 즉시 차감되는지 확인
- [ ] 시간대 변경 시 재고가 자동 갱신되는지 확인
- [ ] 시간대별 계산값이 올바르게 표시되는지 확인

---

## 📝 주요 파일 목록

### Supabase 관련
- `supabase_drop_table.sql` - 테이블 삭제
- `supabase_table_create_v2.sql` - 테이블 생성
- `supabase_functions_v2.sql` - 함수 생성

### 프론트엔드 관련
- `src/app/utils/timeBasedStock.ts` - 시간대별 계산 로직
- `src/app/desktop/components/StockDisplay.tsx` - 재고 표시
- `src/app/desktop/components/ApplicationModal.tsx` - 신청 모달
- `src/app/desktop/components/HeroSection.tsx` - 히어로 섹션
- `src/app/lib/supabaseClient.ts` - Supabase 클라이언트

### 문서
- `test_cron_with_supabase.md` - 크론 테스트 가이드
- `railway_cron_reset_v2.md` - 크론 수정 가이드
- `PROGRESS_LOG.md` - 이 파일 (진행 상황 로그)

---

## 🎯 핵심 로직 요약

### 재고 표시 로직
```
화면 재고 = 시간대별 계산값 - 신청 횟수
```

### 시간대별 계산값 (최대 20개 기준)
- 05:00 ~ 07:59: 15~18개
- 08:00 ~ 11:59: 14~18개
- 12:00 ~ 16:59: 9~13개
- 17:00 ~ 20:59: 5~8개
- 21:00 ~ 22:59: 3~5개
- 23:00 ~ 23:29: 2~3개
- 23:30 ~ 23:59: 1개 고정
- 00:00 ~ 01:59: 1~2개
- 02:00 ~ 04:59: 1~2개

### 신청 완료 시
1. `increment_application_count()` 호출 → 신청 횟수 +1
2. `onStockDecreased` 콜백 → `StockDisplay` 즉시 갱신
3. 화면 재고 = 시간대별 계산값 - (신청 횟수 + 1)

### 크론 (매일 새벽 5시 KST)
- `reset_application_count()` 호출
- 신청 횟수를 0으로 리셋
- `last_reset_at` 업데이트

---

## ⚠️ 주의사항

1. **Supabase 함수 실행 순서 중요**: 테이블 삭제 → 테이블 생성 → 함수 생성 순서로 실행해야 함
2. **환경 변수**: `.env.local`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 설정 필요
3. **크론 시간대**: Railway는 UTC 기준이므로 KST 새벽 5시 = UTC 20:00
4. **RLS 정책**: `get_application_count()`와 `increment_application_count()`는 익명 사용자도 호출 가능하도록 설정됨

---

## 🔍 문제 해결 체크리스트

### 크론이 작동하지 않는 경우
- [ ] Railway 로그 확인
- [ ] 환경 변수 확인 (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- [ ] 함수 이름 확인 (`reset_application_count`)
- [ ] Supabase에서 직접 함수 실행 테스트

### 프론트엔드에서 재고가 갱신되지 않는 경우
- [ ] Supabase 연결 확인 (브라우저 콘솔)
- [ ] `get_application_count()` 함수 실행 테스트
- [ ] `refreshTrigger` prop 전달 확인
- [ ] 30초 자동 갱신 인터벌 확인

### 신청 완료 후 재고가 차감되지 않는 경우
- [ ] `increment_application_count()` 함수 실행 확인
- [ ] `onStockDecreased` 콜백 호출 확인
- [ ] `StockDisplay`의 `refreshTrigger` 업데이트 확인
