# Railway 크론 강제 종료 설정

## 문제
- 로그가 "0" 이후로 멈춰있음
- UI에서 "Running" 상태로 표시됨
- 실제로는 종료되었지만 프로세스가 남아있을 수 있음

## 해결: Start Command 수정

### Railway 설정에서 변경

**Settings** → **Custom Start Command**를 다음으로 변경:

```bash
/bin/sh -c "curl -sS --fail -X POST \"${SUPABASE_URL}/rest/v1/rpc/reset_application_count\" -H \"apikey: ${SUPABASE_ANON_KEY}\" -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" -H \"Content-Type: application/json\" -d '{}' || true; exec sleep 1; exit 0"
```

### 명령어 설명

1. `curl ...` - Supabase 함수 호출
2. `|| true` - curl 실패해도 종료 (에러 무시)
3. `exec sleep 1` - 현재 프로세스를 sleep으로 교체 (1초 대기)
4. `exit 0` - 강제 종료

### 더 확실한 방법 (대안)

```bash
/bin/sh -c "curl -sS --fail -X POST \"${SUPABASE_URL}/rest/v1/rpc/reset_application_count\" -H \"apikey: ${SUPABASE_ANON_KEY}\" -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" -H \"Content-Type: application/json\" -d '{}' || true; kill -TERM $$; exit 0"
```

`kill -TERM $$` - 현재 프로세스 종료 신호 전송

---

## 적용 방법

1. Railway 대시보드 → curl 서비스 선택
2. **Settings** 탭 클릭
3. **Custom Start Command** 필드 찾기
4. 위 명령어로 변경
5. **Save** 클릭
6. 서비스가 자동으로 재배포됨

---

## 확인

1. **Logs** 탭에서 확인:
   - "Starting Container"
   - curl 실행
   - "0" (exit code)
   - **더 이상 로그가 쌓이지 않음** ✅

2. **서비스 상태**:
   - "Running" → "Stopped" 또는 "Idle"로 변경되어야 함

---

## 참고

- 크론 스케줄 시간(`0 20 * * *`)에만 실행됨
- 실행 후 즉시 종료되어 비용 발생 안 함
- 다음 스케줄 시간에 다시 시작
