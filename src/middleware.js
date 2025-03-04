import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  
  // 환경 변수에서 값을 가져오거나 하드코딩된 값을 사용
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tleewofyjneycjurrdqz.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZWV3b2Z5am5leWNqdXJyZHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTQ3MTYsImV4cCI6MjA1NjU3MDcxNn0.mBpPNzFyT2-ufaqqkK3x0ZhG3Q4sKMZSurr91d8ooy0';
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 세션 새로고침
  await supabase.auth.getSession();

  return res;
}

// 모든 경로에 미들웨어 적용
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 