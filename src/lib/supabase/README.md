# Supabase 스키마 업데이트 방법

이 프로젝트에서는 Supabase를 데이터베이스로 사용하고 있습니다. 스키마를 업데이트하려면 다음 단계를 따르세요.

## 1. Supabase 대시보드에 로그인

[Supabase 대시보드](https://app.supabase.io)에 로그인합니다.

## 2. 프로젝트 선택

프로젝트 목록에서 해당 프로젝트를 선택합니다.

## 3. SQL 에디터 열기

왼쪽 메뉴에서 "SQL 에디터"를 클릭합니다.

## 4. SQL 쿼리 실행

다음 SQL 쿼리를 실행하여 payment_key 필드를 추가합니다:

```sql
-- payment_key 필드 추가
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS payment_key TEXT;
```

## 5. 테이블 구조 확인

왼쪽 메뉴에서 "테이블 에디터"를 클릭하고 "purchases" 테이블을 선택하여 payment_key 필드가 추가되었는지 확인합니다.

## 참고: 전체 스키마 적용

전체 스키마를 적용하려면 `schema.sql` 파일의 내용을 SQL 에디터에서 실행하세요. 