# Railway Cron Jobs로 새벽 5시 자동 리셋 설정

## 방법 1: Railway Cron Jobs 사용 (추천)

### 1. Railway 대시보드에서 설정

1. **Railway 프로젝트** → **New** → **Cron Job** 선택

2. **Cron Job 설정**:
   - **Name**: `daily-stock-reset`
   - **Schedule**: `0 5 * * *` (매일 새벽 5시 KST)
   - **Command**: 아래 스크립트 사용

### 2. 간단한 Node.js 스크립트로 Supabase 함수 호출

**package.json에 스크립트 추가** (선택사항):

```json
{
  "scripts": {
    "reset-stock": "node scripts/reset-stock.js"
  }
}
```

**scripts/reset-stock.js** 파일 생성:

```javascript
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const options = {
  hostname: SUPABASE_URL.replace('https://', '').split('/')[0],
  path: `/rest/v1/rpc/reset_stock_daily`,
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

req.end();
```

### 3. Railway Cron Job 설정

**Railway 대시보드**:
- **Cron Schedule**: `0 5 * * *` (매일 새벽 5시)
- **Command**: `node scripts/reset-stock.js`
- **Environment Variables**:
  - `SUPABASE_URL`: Supabase 프로젝트 URL
  - `SUPABASE_ANON_KEY`: Supabase Anon Key

---

## 방법 2: 간단한 HTTP 요청 (더 간단)

Railway Cron Job에서 직접 HTTP 요청:

**Command**:
```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/reset_stock_daily" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

**또는 wget 사용**:
```bash
wget --post-data='' \
  --header="apikey: YOUR_SUPABASE_ANON_KEY" \
  --header="Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  --header="Content-Type: application/json" \
  -O - \
  "https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/reset_stock_daily"
```

---

## 방법 3: 기존 Railway 서비스에 스케줄러 추가

이미 Railway에 서비스가 있다면, 그 서비스에 스케줄러를 추가할 수도 있어요:

1. **Railway 프로젝트** → **서비스 선택** → **Settings** → **Cron Jobs**
2. 새 Cron Job 추가
3. 위의 방법 1 또는 2 사용

---

## 시간대 설정

Railway Cron Jobs는 기본적으로 UTC 시간을 사용합니다.

**한국 시간(KST) 새벽 5시 = UTC 20:00 (전날)**

따라서:
- **Schedule**: `0 20 * * *` (UTC 20:00 = KST 다음날 05:00)

또는 Railway에서 Timezone을 설정할 수 있다면:
- **Timezone**: `Asia/Seoul`
- **Schedule**: `0 5 * * *`

---

## 테스트

설정 후 즉시 테스트:
```bash
# Railway 대시보드에서 "Run Now" 버튼 클릭
# 또는 수동으로 실행
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/reset_stock_daily" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```
