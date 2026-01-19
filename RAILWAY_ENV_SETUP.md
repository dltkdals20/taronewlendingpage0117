# Railway 환경 변수 설정 가이드

## 문제
배포된 사이트에서 `Uncaught Error: supabaseKey is required.` 에러 발생

## 원인
Railway 배포 환경에서 Supabase 환경 변수가 설정되지 않음

## 해결 방법

### Railway 환경 변수 설정

1. **Railway 대시보드** → `taronewlendingpage0117` 서비스 선택
2. **Variables** 탭 클릭
3. 다음 환경 변수 추가:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

**중요**: 
- `YOUR_PROJECT_ID`는 Supabase 프로젝트 URL에서 확인
- `YOUR_ANON_KEY`는 Supabase 프로젝트 Settings → API에서 확인

### 환경 변수 확인

Supabase에서:
1. 프로젝트 선택
2. **Settings** → **API**
3. **Project URL**: `https://xxxxx.supabase.co` (이게 `VITE_SUPABASE_URL`)
4. **anon public** 키 복사 (이게 `VITE_SUPABASE_ANON_KEY`)

### 재배포

환경 변수 설정 후:
1. Railway가 자동으로 재배포 시작
2. 또는 **Settings** → **Redeploy** 클릭

### 확인

배포 완료 후:
1. 사이트 접속
2. 브라우저 콘솔 확인
3. `supabaseKey is required` 에러가 사라져야 함

---

## 참고

- Vite 환경 변수는 `VITE_` 접두사가 필요함
- 빌드 시점에 환경 변수가 포함됨
- 환경 변수 변경 후 재배포 필요
