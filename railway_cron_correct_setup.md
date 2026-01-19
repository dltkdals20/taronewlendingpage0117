# Railway Cron Schedule 올바른 설정 방법

## Railway Cron 동작 방식

- **Cron Schedule**: "언제 실행할지"만 설정 (크론 표현식)
- **실행 명령어**: 그 서비스의 **Start Command** (Custom Start Command)
- **시간대**: UTC 기준

## 해결 방법

### 방법 1: 별도 Cron 전용 서비스 생성 (추천)

1. **Railway 프로젝트** → **New** → **Empty Service** 선택
2. **서비스 이름**: `stock-reset-cron` (또는 원하는 이름)
3. **Custom Start Command** 설정:
   ```bash
   curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/reset_stock_daily" \
     -H "apikey: YOUR_SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json"
   ```
4. **Cron Schedule** 설정:
   - Schedule: `0 20 * * *` (UTC 20:00 = KST 새벽 5시)
5. **환경 변수** (선택사항):
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_ANON_KEY`: Supabase Anon Key
   - 환경 변수 사용 시 Command:
     ```bash
     curl -X POST "${SUPABASE_URL}/rest/v1/rpc/reset_stock_daily" \
       -H "apikey: ${SUPABASE_ANON_KEY}" \
       -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
       -H "Content-Type: application/json"
     ```

### 방법 2: Node.js 스크립트 사용

1. **별도 서비스 생성** (방법 1과 동일)
2. **package.json** 생성:
   ```json
   {
     "name": "stock-reset-cron",
     "version": "1.0.0",
     "scripts": {
       "start": "node reset-stock.js"
     },
     "dependencies": {}
   }
   ```
3. **reset-stock.js** 파일 생성:
   ```javascript
   const https = require('https');

   const SUPABASE_URL = process.env.SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
   const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

   const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/reset_stock_daily`);
   
   const options = {
     hostname: url.hostname,
     path: url.pathname,
     method: 'POST',
     headers: {
       'apikey': SUPABASE_ANON_KEY,
       'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
       'Content-Type': 'application/json'
     }
   };

   const req = https.request(options, (res) => {
     console.log(`Status: ${res.statusCode}`);
     let data = '';
     res.on('data', (chunk) => {
       data += chunk;
     });
     res.on('end', () => {
       console.log('Response:', data);
       process.exit(0); // 중요: 작업 완료 후 종료
     });
   });

   req.on('error', (error) => {
     console.error('Error:', error);
     process.exit(1);
   });

   req.end();
   ```
4. **Custom Start Command**: `npm start` (또는 `node reset-stock.js`)
5. **Cron Schedule**: `0 20 * * *`

### 방법 3: 기존 서비스 활용 (비추천)

기존 서비스의 Start Command를 바꾸면 안 되므로, 이 방법은 사용하지 않는 게 좋아요.

---

## 중요 사항

1. **프로세스 종료**: 스크립트가 끝나면 반드시 `process.exit(0)` 또는 `exit 0`로 종료해야 해요. 안 그러면 다음 스케줄이 스킵될 수 있어요.

2. **별도 서비스 권장**: 기존 웹 서비스와 분리해서 Cron 전용 서비스를 만드는 게 안전해요.

3. **환경 변수**: Supabase URL과 Key는 환경 변수로 관리하는 게 보안상 좋아요.

---

## 테스트

설정 후 Railway 대시보드에서 "Run Now" 버튼으로 즉시 테스트할 수 있어요.
