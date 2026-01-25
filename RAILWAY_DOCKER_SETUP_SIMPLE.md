# Railway Docker 크론 서비스 설치 (간단 버전)

## 1단계: Docker Image 서비스 생성

1. Railway 대시보드 → 프로젝트 선택
2. **New** → **Docker Image** 클릭
3. **Image 이름**: `curlimages/curl:latest`
4. 생성 완료

---

## 2단계: 환경 변수 설정

서비스 → **Variables** 탭에서 추가:

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

**참고**: `YOUR_PROJECT_ID`와 `YOUR_ANON_KEY`는 Supabase에서 확인

---

## 3단계: Start Command 설정

서비스 → **Settings** → **Custom Start Command**에 입력:

```bash
/bin/sh -c "curl -sS --fail -X POST \"${SUPABASE_URL}/rest/v1/rpc/reset_application_count\" -H \"apikey: ${SUPABASE_ANON_KEY}\" -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" -H \"Content-Type: application/json\" -d '{}' || true; exec sleep 1; exit 0"
```

**중요**: `|| true` (실패해도 종료), `exec sleep 1` (프로세스 교체 후 종료), `exit 0` (강제 종료)

---

## 4단계: Cron Schedule 설정

서비스 → **Settings** → **Cron Schedule**에서:

- **Schedule**: `0 20 * * *` (UTC 20:00 = KST 새벽 5시)
- **Add Schedule** 클릭

---

## 5단계: 테스트

1. **"Run Now"** 버튼 클릭
2. **Logs** 탭에서 성공 여부 확인
3. Supabase에서 `SELECT get_application_count();` 실행해서 0인지 확인

---

## 완료!

이제 매일 새벽 5시(KST)에 자동으로 신청 횟수가 리셋됩니다.
