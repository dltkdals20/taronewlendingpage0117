# Railway Cron 수정 (새로운 로직)

## 변경 사항

기존: 재고를 15~18개로 리셋
새로운: 신청 횟수만 0으로 리셋

## Railway Cron 설정

### Start Command 수정

기존:
```bash
sh -c 'curl -sS --fail -X POST "${SUPABASE_URL}/rest/v1/rpc/reset_stock_daily" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{}" && exit 0'
```

새로운:
```bash
sh -c 'curl -sS --fail -X POST "${SUPABASE_URL}/rest/v1/rpc/reset_application_count" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{}" && exit 0'
```

### 함수 이름 변경

- `reset_stock_daily()` → `reset_application_count()`

### Schedule

- 그대로: `0 20 * * *` (UTC 20:00 = KST 새벽 5시)
