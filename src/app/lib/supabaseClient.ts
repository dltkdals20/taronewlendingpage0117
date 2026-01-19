import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.error("Supabase 환경 변수가 설정되지 않았습니다. Railway 환경 변수를 확인하세요.");
    // 더미 값으로 초기화 (에러 방지)
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다. VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

