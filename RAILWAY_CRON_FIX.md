# Railway 크론 계속 실행 중 문제 해결

## 문제
- Docker 컨테이너가 계속 "Running" 상태
- Start Command가 종료되지 않음

## 원인
Railway 크론 스케줄은 Start Command를 **주기적으로 실행**하는 방식이 아니라, **스케줄 시간에 한 번 실행**하는 방식입니다.

하지만 Start Command가 실행 후 종료되지 않으면 컨테이너가 계속 Running 상태로 남습니다.

## 해결 방법

### 방법 1: Start Command를 완전히 비우기 (권장)

1. **Settings** → **Custom Start Command** → **비우기** (삭제)
2. **Cron Schedule**만 설정: `0 20 * * *`
3. 크론 실행 시 Railway가 기본 동작 수행

**단점**: curl 이미지에는 기본 ENTRYPOINT가 없어서 작동 안 할 수 있음

---

### 방법 2: Start Command를 sleep으로 대기 (대안)

**Settings** → **Custom Start Command**:

```bash
sleep infinity
```

그리고 **Cron Schedule**에서 실행할 명령어를 별도로 설정... 하지만 Railway는 이런 방식을 지원하지 않을 수 있음

---

### 방법 3: Railway의 크론 방식 확인

Railway 크론은:
- 스케줄 시간에 **새로운 컨테이너를 시작**
- Start Command 실행
- **Start Command가 종료되면 컨테이너도 종료**
- 다음 스케줄 시간에 다시 시작

**현재 문제**: Start Command가 종료되지 않아서 컨테이너가 계속 Running

---

### 방법 4: Start Command 강제 종료 (최종 해결)

**Settings** → **Custom Start Command**:

```bash
/bin/sh -c "curl -sS --fail -X POST \"${SUPABASE_URL}/rest/v1/rpc/reset_application_count\" -H \"apikey: ${SUPABASE_ANON_KEY}\" -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" -H \"Content-Type: application/json\" -d '{}' || true; exit 0"
```

**변경점**: `|| true` 추가 (curl 실패해도 종료), `exit 0`로 강제 종료

---

### 방법 5: 서비스 타입 변경

Railway에서 크론 전용 서비스가 아니라면:
1. **서비스 삭제**
2. **새로 생성** (이번엔 Start Command를 위 방법 4로 설정)
3. **Cron Schedule 설정**

---

## 확인 사항

1. **Logs 탭**에서 실제로 curl이 실행되고 있는지 확인
2. **에러 메시지** 확인
3. **환경 변수**가 제대로 설정되어 있는지 확인

**Logs에서 확인할 내용**:
- curl 명령어가 실행되는지
- HTTP 응답 코드 (200이면 성공)
- 에러 메시지
