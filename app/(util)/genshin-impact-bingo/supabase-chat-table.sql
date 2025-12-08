-- 채팅 테이블 생성
CREATE TABLE IF NOT EXISTS "genshin-bingo-chat" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) DEFAULT 'Arama',
  message TEXT NOT NULL,
  is_boast BOOLEAN DEFAULT FALSE,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON "genshin-bingo-chat" (created_at DESC);

-- RLS 활성화
ALTER TABLE "genshin-bingo-chat" ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read chat" ON "genshin-bingo-chat"
  FOR SELECT USING (true);

-- 모든 사용자가 삽입 가능
CREATE POLICY "Anyone can insert chat" ON "genshin-bingo-chat"
  FOR INSERT WITH CHECK (true);

-- 실시간 구독 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE "genshin-bingo-chat";

-- 유저 테이블에 bingo_message 컬럼 추가 (없는 경우)
ALTER TABLE "genshin-bingo-game-user"
ADD COLUMN IF NOT EXISTS bingo_message TEXT,
ADD COLUMN IF NOT EXISTS bingo_message_at TIMESTAMP WITH TIME ZONE;
