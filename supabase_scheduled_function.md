# Supabase 스케줄 함수 설정 가이드

## 새벽 5시 자동 리셋 설정

Supabase 대시보드에서 다음 단계를 따라주세요:

### 1. Database → Functions 메뉴로 이동

### 2. 새 Edge Function 생성

**함수 이름**: `reset-stock-daily`

**코드**:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabaseClient.rpc('reset_stock_daily')

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, stock: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### 3. Cron Job 설정

**Database → Database → Cron Jobs** 메뉴에서:

- **Name**: `daily-stock-reset`
- **Schedule**: `0 5 * * *` (매일 새벽 5시)
- **Function**: `reset-stock-daily`
- **Enabled**: ✅

또는 Supabase SQL Editor에서 직접 실행:

```sql
-- pg_cron 확장 활성화 (필요시)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 매일 새벽 5시에 재고 리셋 함수 실행
SELECT cron.schedule(
    'daily-stock-reset',
    '0 5 * * *',
    $$SELECT reset_stock_daily()$$
);
```

### 4. 확인

스케줄이 제대로 설정되었는지 확인:

```sql
SELECT * FROM cron.job;
```
