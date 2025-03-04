-- payment_key 필드 추가
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS payment_key TEXT; 