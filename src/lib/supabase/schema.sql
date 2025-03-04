-- 구매 내역 테이블 생성
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  order_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS(Row Level Security) 정책 설정
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 구매 내역만 볼 수 있음
CREATE POLICY "사용자는 자신의 구매 내역만 볼 수 있음" ON purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 구매 내역만 생성할 수 있음
CREATE POLICY "사용자는 자신의 구매 내역만 생성할 수 있음" ON purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 구매 내역만 수정할 수 있음
CREATE POLICY "사용자는 자신의 구매 내역만 수정할 수 있음" ON purchases
  FOR UPDATE
  USING (auth.uid() = user_id); 