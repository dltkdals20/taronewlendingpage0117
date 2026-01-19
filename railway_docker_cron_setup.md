# Railway Docker Image로 Cron 설정 (실제 사용 방법)

## 설정 단계

### 1. Railway에서 Docker Image 서비스 생성

1. **Railway 프로젝트** → **New** → **Docker Image** 클릭
2. **Image 이름**: `curlimages/curl:latest`
3. 서비스 생성 완료

### 2. 환경 변수 설정

생성된 서비스 → **Variables** 탭에서:

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

또는 서비스 롤 키를 사용한다면:

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 3. Start Command 설정

**Custom Start Command**에 입력:

```bash
sh -c 'curl -sS --fail -X POST "${SUPABASE_URL}/rest/v1/rpc/reset_stock_daily" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{}" && exit 0'
```

**서비스 롤 키를 사용하는 경우**:

```bash
sh -c 'curl -sS --fail -X POST "${SUPABASE_URL}/rest/v1/rpc/reset_stock_daily" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{}" && exit 0'
```

### 4. Cron Schedule 설정

**Cron Schedule** 섹션에서:
- **Schedule**: `0 20 * * *` (UTC 20:00 = KST 새벽 5시)
- "Add Schedule" 클릭

---

## 중요 사항

### 1. `exit 0` 추가
- `&& exit 0`를 마지막에 추가해서 작업 완료 후 프로세스가 종료되도록 해야 해요
- 안 그러면 다음 스케줄이 스킵될 수 있어요

### 2. 환경 변수 이름
- `SUPABASE_FUNCTION_URL` 대신 `SUPABASE_URL`을 사용하고, 경로는 `/rest/v1/rpc/reset_stock_daily`로 명시하는 게 더 명확해요
- 또는 환경 변수를 `SUPABASE_FUNCTION_URL=https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/reset_stock_daily`로 통째로 넣고, Start Command에서 `"${SUPABASE_FUNCTION_URL}"`로 사용해도 돼요

### 3. Anon Key vs Service Role Key
- **Anon Key**: 일반적으로 사용 (RLS 정책에 따라 제한될 수 있음)
- **Service Role Key**: RLS를 우회하므로 더 확실함 (보안 주의 필요)

### 4. `-d "{}"` 필요 여부
- Supabase RPC 함수는 body가 없어도 되지만, 명시적으로 `-d "{}"`를 넣어도 문제없어요
- 빈 body `{}`를 넣는 게 더 안전할 수 있어요

---

## 테스트

설정 완료 후:
1. Railway 대시보드에서 "Run Now" 버튼 클릭
2. 로그에서 성공 여부 확인
3. Supabase에서 `SELECT * FROM taro_selltime_management`로 재고가 리셋되었는지 확인

---

## 최종 Start Command (권장)

```bash
sh -c 'curl -sS --fail -X POST "${SUPABASE_URL}/rest/v1/rpc/reset_stock_daily" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{}" && echo "Stock reset successful" && exit 0'
```

`-sS --fail` 옵션:
- `-s`: silent 모드 (진행 상황 숨김)
- `-S`: 에러 시에도 진행 상황 표시
- `--fail`: HTTP 에러 시 실패로 처리
