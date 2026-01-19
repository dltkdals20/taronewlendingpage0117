# 완전한 테스트 가이드 (단계별 상세)

## 🎯 테스트 목표

1. Supabase 설정이 올바른지 확인
2. 프론트엔드에서 재고 표시 및 신청 완료 시 차감이 정상 작동하는지 확인
3. Railway 크론이 정상 작동하는지 확인

---

## 📋 1단계: Supabase 설정 확인

### 1-1. 테이블 존재 확인

**Supabase SQL Editor**에서 실행:

```sql
-- 테이블이 존재하는지 확인
SELECT * FROM taro_selltime_management ORDER BY created_at DESC LIMIT 1;
```

**예상 결과**:
- ✅ 테이블이 존재하고 데이터가 있음
- ❌ 에러 발생 시: `supabase_table_create_v2.sql` 실행 필요

---

### 1-2. 함수 존재 확인

```sql
-- 함수들이 존재하는지 확인
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN (
    'increment_application_count',
    'get_application_count',
    'reset_application_count'
);
```

**예상 결과**: 3개의 함수가 모두 나와야 함

**함수가 없으면**: `supabase_functions_v2.sql` 실행 필요

---

### 1-3. 함수 개별 테스트

#### A. 신청 횟수 조회 테스트

```sql
SELECT get_application_count() AS current_count;
```

**예상 결과**: 숫자 (0 이상)

---

#### B. 신청 횟수 증가 테스트

```sql
-- 현재 값 확인
SELECT get_application_count() AS before;

-- 증가
SELECT increment_application_count() AS new_count;

-- 다시 확인 (1 증가했는지)
SELECT get_application_count() AS after;
```

**예상 결과**:
- `before`: 예) 0
- `new_count`: 예) 1
- `after`: 예) 1

---

#### C. 리셋 함수 테스트

```sql
-- 현재 값 확인
SELECT get_application_count() AS before_reset;

-- 리셋 실행
SELECT reset_application_count() AS reset_result;

-- 다시 확인 (0이 되었는지)
SELECT get_application_count() AS after_reset;

-- last_reset_at이 업데이트되었는지 확인
SELECT 
    current_stock,
    last_reset_at,
    updated_at
FROM taro_selltime_management 
ORDER BY created_at DESC 
LIMIT 1;
```

**예상 결과**:
- `before_reset`: 예) 5
- `reset_result`: 0
- `after_reset`: 0
- `last_reset_at`: 방금 실행한 시간으로 업데이트됨

---

## 📋 2단계: 프론트엔드 테스트

### 2-1. 환경 변수 확인

**파일**: `.env.local`

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

**확인 방법**: 브라우저 콘솔에서 Supabase 경고가 없는지 확인

---

### 2-2. 로컬 서버 실행

터미널에서:
```bash
npm run dev
```

브라우저에서 접속: `http://localhost:5173` (또는 표시된 URL)

---

### 2-3. 초기 재고 표시 확인

**확인 사항**:
1. 브라우저 콘솔 열기 (F12)
2. 페이지 로드 시 콘솔에 다음 로그가 나오는지 확인:
   ```
   시간대 계산값: X, 신청 횟수: Y, 표시 재고: Z
   ```

**예상 결과**:
- 시간대 계산값: 현재 시간대에 맞는 값 (예: 오후면 9~13개)
- 신청 횟수: Supabase에서 가져온 값
- 표시 재고: 시간대 계산값 - 신청 횟수

**화면 확인**:
- "현재 남은 수량: X개" 표시
- 진행 바가 표시됨

---

### 2-4. 신청 완료 시 재고 차감 테스트

#### 테스트 순서:

1. **초기 상태 기록**
   - 화면에 표시된 재고 수량 기록 (예: 15개)
   - 브라우저 콘솔에서 현재 값 확인

2. **신청 모달 열기**
   - "신청하기" 버튼 클릭
   - 모달이 열리는지 확인

3. **신청 정보 입력**
   - 이름: 테스트
   - 휴대폰 번호: 01012345678
   - 개인정보 동의 체크

4. **신청 완료**
   - "신청하기" 버튼 클릭
   - "신청 완료!" 화면이 나오는지 확인

5. **재고 차감 확인**
   - 모달 닫기
   - 화면의 재고 수량이 **1 감소**했는지 확인
   - 예: 15개 → 14개

6. **콘솔 로그 확인**
   ```
   재고 감소 성공 (신청 횟수 증가): X
   즉시 재고 업데이트: Y
   시간대 계산값: Z, 신청 횟수: W, 표시 재고: V
   ```

**예상 결과**:
- ✅ 재고가 즉시 1 감소
- ✅ 콘솔에 성공 로그 표시
- ✅ Supabase에서 `get_application_count()` 실행 시 1 증가

---

### 2-5. 시간대 변경 시 자동 갱신 테스트

**주의**: 이 테스트는 시간대가 바뀔 때까지 기다려야 하므로, 시간대 경계 근처에서 테스트하거나 수동으로 시간을 조작해야 할 수 있어요.

**확인 방법**:
1. 브라우저 콘솔 열기
2. 1분마다 시간대 체크 로그 확인
3. 시간대가 바뀌면 자동으로 재고가 갱신되는지 확인

**또는 수동 테스트**:
- `src/app/utils/timeBasedStock.ts` 파일에서 시간대를 임시로 변경해서 테스트

---

## 📋 3단계: Railway 크론 테스트

### 3-1. 크론 실행 전 준비

**Supabase SQL Editor**에서:

```sql
-- 신청 횟수를 5로 증가 (테스트용)
SELECT increment_application_count(); -- 1
SELECT increment_application_count(); -- 2
SELECT increment_application_count(); -- 3
SELECT increment_application_count(); -- 4
SELECT increment_application_count(); -- 5

-- 확인
SELECT get_application_count() AS before_cron;

-- 테이블 상태 확인
SELECT 
    current_stock,
    last_reset_at,
    updated_at
FROM taro_selltime_management 
ORDER BY created_at DESC 
LIMIT 1;
```

**예상 결과**:
- `before_cron`: 5
- `current_stock`: 5
- `last_reset_at`: 이전 시간

---

### 3-2. Railway 크론 실행

1. **Railway 대시보드** 접속
2. 크론 서비스 (Docker Image) 선택
3. **"Run Now"** 버튼 클릭
4. **로그 탭** 확인

**로그에서 확인할 내용**:
- ✅ 성공: HTTP 200 응답 또는 `exit 0`
- ❌ 실패: 에러 메시지 확인

**에러가 나면 확인**:
- 환경 변수 (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) 확인
- 함수 이름 (`reset_application_count`) 확인
- Supabase에서 직접 함수 실행 테스트

---

### 3-3. 크론 실행 후 확인

**Supabase SQL Editor**에서:

```sql
-- 신청 횟수 확인 (0으로 리셋되었는지)
SELECT get_application_count() AS after_cron;

-- 테이블 상태 확인 (last_reset_at이 업데이트되었는지)
SELECT 
    current_stock,
    last_reset_at,
    updated_at
FROM taro_selltime_management 
ORDER BY created_at DESC 
LIMIT 1;
```

**예상 결과**:
- ✅ `after_cron`: 0
- ✅ `current_stock`: 0
- ✅ `last_reset_at`: 방금 크론 실행한 시간으로 업데이트됨
- ✅ `updated_at`: 방금 크론 실행한 시간으로 업데이트됨

---

## 📋 4단계: 통합 테스트 (전체 플로우)

### 4-1. 전체 시나리오 테스트

1. **초기 상태**
   - Supabase: 신청 횟수 = 0
   - 화면: 시간대별 계산값 표시

2. **신청 3번 완료**
   - 화면에서 신청하기 3번 클릭
   - Supabase: 신청 횟수 = 3
   - 화면: 시간대별 계산값 - 3

3. **크론 실행 (수동)**
   - Railway에서 "Run Now"
   - Supabase: 신청 횟수 = 0
   - 화면: 시간대별 계산값 (자동 갱신)

4. **다시 신청 2번**
   - 화면에서 신청하기 2번 클릭
   - Supabase: 신청 횟수 = 2
   - 화면: 시간대별 계산값 - 2

---

## ✅ 성공 기준 체크리스트

### Supabase
- [ ] 테이블 존재
- [ ] 3개 함수 모두 존재
- [ ] `get_application_count()` 정상 작동
- [ ] `increment_application_count()` 정상 작동
- [ ] `reset_application_count()` 정상 작동

### 프론트엔드
- [ ] 환경 변수 설정됨
- [ ] 초기 재고 표시됨
- [ ] 신청 완료 시 재고 즉시 차감됨
- [ ] 콘솔에 로그 정상 출력
- [ ] 시간대 변경 시 자동 갱신 (또는 수동 테스트 성공)

### Railway 크론
- [ ] "Run Now" 실행 성공
- [ ] 로그에 성공 메시지
- [ ] Supabase에서 신청 횟수 0으로 리셋
- [ ] `last_reset_at` 업데이트됨

---

## 🐛 문제 해결

### Supabase 연결 오류
- `.env.local` 파일 확인
- 브라우저 콘솔에서 Supabase 경고 확인
- Supabase 프로젝트 URL과 키 확인

### 함수 실행 오류
- Supabase SQL Editor에서 직접 실행 테스트
- RLS 정책 확인
- 함수 이름 확인

### 재고가 차감되지 않음
- 브라우저 콘솔 로그 확인
- `increment_application_count()` 함수 실행 확인
- `onStockDecreased` 콜백 확인

### 크론이 작동하지 않음
- Railway 로그 확인
- 환경 변수 확인
- 함수 이름 확인
- Supabase에서 직접 함수 실행 테스트
