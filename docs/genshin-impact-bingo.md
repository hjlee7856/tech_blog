# 원신 캐릭터 빙고(송년회) 구현 정리

## 0. 문서 범위

이 문서는 `app/(util)/genshin-impact-bingo` 아래에 구현된 **원신 캐릭터 빙고 게임**의 현재 구현 상태를 정리합니다.

- UI에 실제로 노출되는 기능을 기준으로 **화면(페이지) 단위**로 설명합니다.
- Supabase 기반의 데이터 모델/실시간 동기화/게임 로직도 함께 요약합니다.

---

## 1. 주요 경로(엔트리포인트)

- **게임 참가 페이지**: `app/(util)/genshin-impact-bingo/page.tsx`
  - `genshin-data`로 캐릭터 목록을 한글/영문으로 로드
  - `BingoGame`에 `characterNames`, `characterEnNames` 전달
- **관전 페이지**: `app/(util)/genshin-impact-bingo/spectator/page.tsx`
  - 동일하게 캐릭터 목록 로드 후 `SpectatorPanel`에 전달
- **턴 오프라인 자동 스킵 API**: `app/api/genshin-impact-bingo/check-turn/route.ts`
  - `validateAndAutoAdvanceTurn()` 결과를 JSON으로 반환

---

## 2. 데이터 모델(요약)

### 2.1 GameState (`genshin-bingo-game-state`)

- `id=1` 고정 레코드를 사용
- 핵심 필드
  - `is_started`: 게임 시작 여부
  - `is_finished`: 게임 종료 여부
  - `winner_id`: 우승자 id(현재는 1명만 저장)
  - `current_order`: 현재 턴 순서
  - `drawn_names`: 지금까지 뽑힌 캐릭터 이름 배열
  - `turn_started_at`: 턴 시작 시각
- 게임 시작 요청(합의) 관련
  - `start_requested_by`, `start_agreed_users`, `start_requested_at`

### 2.2 Player (`genshin-bingo-game-user`)

- 핵심 필드
  - `board: string[]`: 25칸 보드(완성/부분/빈 배열 가능)
  - `is_ready`: 준비 상태
  - `order`: 게임 참여 순서(`0`이면 미참여)
  - `score`: 완성된 빙고 라인 수(0~12)
  - `last_seen`: 온라인 판정/턴 스킵에 활용
  - `profile_image`, `name`, `is_admin` 등

### 2.3 Chat (`genshin-bingo-chat`)

- 채팅 메시지 저장/조회/실시간 구독
- “요청하기” 기능은 메시지 문자열에 메타를 인코딩하는 방식 사용
  - 예: `REQUEST::<characterKey>::<text>`

---

## 3. 핵심 게임 로직(요약)

### 3.1 빙고 라인/점수

- `BINGO_LINES`: 5x5 보드의 12개 라인(가로 5 + 세로 5 + 대각 2)
- `countBingoLines(board, drawnNames)`
  - 보드에서 `drawn_names`에 포함되는 칸 인덱스를 기반으로 완성 라인 수 계산
- `checkAndUpdateAllScores(drawnNames)`
  - `order > 0`인 참여자만 대상으로 점수를 재계산하고 DB에 반영

### 3.2 종료 판정

- `checkFullBingo(board, drawnNames)`
  - 보드 25칸 완성 + 라인 12개 완성(= 12줄 빙고)
- `checkGameFinish(drawnNames)`
  - 참여자 중 12줄 빙고가 나오면 게임 종료 처리
  - 종료 직전에 한 번 더 점수 재계산을 수행

### 3.3 턴/오프라인 자동 처리

- `OFFLINE_GRACE_MS = 45_000`
  - 턴이 시작된 뒤 이 시간 전에는 스냅샷이 불안정해도 턴 유지
- `validateAndAutoAdvanceTurn()`
  - 오프라인 판정되면 턴을 넘기고, 해당 플레이어 `order=0`으로 내려 재합류 시 맨 뒤 합류 유도
- 클라이언트에서 `/api/genshin-impact-bingo/check-turn`를 5초 폴링
  - 단, `turn_started_at` 기준으로 유예 시간이 지난 이후에만 호출

---

# 4. 화면(UI) 단위 기능 정리

## 4.1 로그인 모달 (공통)

- **구현**: `components/LoginModal/LoginModal.tsx`
- **노출 조건**
  - 게임 참가 페이지/관전 페이지에서 `user`가 없으면 표시
- **노출 기능**
  - **로그인**: `login(loginId, password)`
  - **회원가입**: `register(loginId, nickname, password)`
    - 닉네임 중복/아이디 중복 검증은 서버(Supabase) 조회 후 처리
  - **유효성**
    - 아이디/비밀번호 필수
    - 회원가입 시 닉네임 필수 + 비밀번호 확인 일치

## 4.2 모드 선택 모달 (게임 참가 vs 관전)

- **구현**: `components/ModeSelectModal/ModeSelectModal.tsx`
- **노출 조건**
  - 로그인 직후 로컬스토리지 키 `genshin-bingo-selected-mode:<userId>`가 없으면 표시
- **동작**
  - **게임 참가**: 로컬스토리지에 `game` 저장 후 게임 페이지 유지
  - **관전 모드**: 로컬스토리지에 `spectator` 저장 후 `/genshin-impact-bingo/spectator`로 이동

## 4.3 게임 참가 페이지(`/genshin-impact-bingo`)

- **구현**: `components/BingoGame/BingoGame.tsx` + `components/BingoBoard/BingoBoard.tsx`

### 4.3.1 헤더 영역

- **로그아웃** 버튼
- **프로필 이미지 클릭** → 프로필 선택 모달 오픈
- **닉네임 클릭** → 닉네임 변경 모달 오픈

### 4.3.2 도움말(일반 유저)

- **노출 조건**: `!user.is_admin`
- **동작**: 도움말 모달에서
  - 보드 채우기 방법
  - 준비/게임 시작 조건
  - 채팅 사용법
  - 프로필/이름 설정 안내

### 4.3.3 대기 상태 UI(게임 시작 전)

- **조건**: `!gameState?.is_started`
- **노출 버튼/기능**
  - **보드 초기화**: 확인 모달 후 보드 전체 삭제 + 준비 해제
  - **랜덤 채우기**: 25칸 랜덤 자동 채움
  - **준비하기/준비 완료!**
    - 보드 25칸이 모두 채워져야 활성화
    - `toggleReady(userId)` 실행
- **하단 패널**
  - `ReadyStatus`: 온라인 참가자의 준비 상태/보드 채움 정도 표시

### 4.3.4 게임 진행 UI(게임 시작 후)

- **조건**: `gameState?.is_started`
- **노출 정보**
  - 현재 턴 플레이어 표시
  - 마지막 뽑힌 이름 표시
- **참여 상태에 따라 다른 UX**
  - **내가 참여자(order > 0) + 내 턴**
    - 보드에서 아직 뽑히지 않은 셀을 선택 가능
    - 선택 → 확인 모달 → 확정 시 `drawn_names` 업데이트 → 점수 갱신 → 다음 턴
  - **참여자지만 내 턴 아님**
    - “현재 턴 유저가 뽑고 있음” 안내
  - **미참여자(order = 0)**
    - 보드 완성(25/25) 시 **게임 참여하기** 버튼 노출
    - 참여하기: `joinGameInProgress(userId)`로 마지막 순서에 합류

### 4.3.5 보드 UI(셀 편집/하이라이트/뽑기)

- **구현**: `components/BingoBoard/BingoBoard.tsx`
- **보드 편집 가능 조건**
  - 게임 시작 전이거나
  - 게임 중이라도 미참여자이거나(`order=0`)
  - 또는 보드가 아직 미완성인 경우
- **편집 기능**
  - 셀 클릭 → 캐릭터 선택 모달
  - 셀 지우기
  - 랜덤 채우기
  - 전체 초기화(서버 저장까지 즉시 반영)
- **게임 진행 시 하이라이트**
  - 매칭 셀(뽑힌 이름 포함)
  - 완성 라인(금색)
  - 25칸 전부 매칭(빨간 네온)
- **내 턴 뽑기 UX**
  - 뽑지 않은 셀 선택 가능
  - 선택 시 확인 모달로 확정

### 4.3.6 채팅

- **구현**: `components/Chat/Chat.tsx`
- **기능**
  - 실시간 채팅(최근 50개 로드 + 새 메시지 insert 구독)
  - 타이핑 프레즌스 표시
  - **요청하기**
    - 게임 진행 중에만 가능
    - 내 보드에 있는 캐릭터를 선택해서 “뽑아주세요” 요청 메시지를 전송
  - **자랑하기**
    - 게임 진행 중, `myScore >= 1`이고 `myRank <= 3`일 때만 활성화

### 4.3.7 순위(실시간)

- **구현**: `components/Ranking/Ranking.tsx`
- **정렬/표시**
  - 온라인 유저 기준 + (게임 시작/종료 상태에 따라) `order > 0` 필터
  - 12줄 완성자 우선, 그 다음 score
  - 공동 순위 표시(그룹)
  - 기본: 3위까지 + 내 순위, 확장 시 전체

### 4.3.8 종료 모달

- **구현**: `components/BingoGame/modals/FinishModal.tsx`
- **노출 조건**
  - 게임 상태에서 종료 감지 시 표시
- **기능**
  - Top 3 랭킹 표시
  - 내 순위 표시
  - **관리자만** “게임 재시작” 가능(= `resetGame()` 호출)
  - 게임 상태가 다시 시작/리셋되면 모달 자동 닫힘

### 4.3.9 관리자 메뉴

- **구현**: `components/BingoGame/AdminMenu.tsx`
- **노출 조건**: `user.is_admin`
- **기능**
  - **강제 시작**: 게임 시작 전, 보드 25칸 완성자가 2명 이상일 때 활성화
  - **턴 넘기기**: 게임 진행 중 턴 강제 이동
  - **게임 초기화**: 전체 점수/보드/순서 초기화

## 4.4 관전 페이지(`/genshin-impact-bingo/spectator`)

- **구현**: `spectator/components/SpectatorPanel.tsx`
- **핵심 특징**
  - 로그인은 필요(채팅 표시용)하지만, 관전자는 게임 보드 편집/뽑기 기능이 없음
  - 로컬스토리지에 `spectator` 모드를 기록
  - 만약 저장된 모드가 `game`이면 자동으로 게임 페이지로 리다이렉트
- **노출 UI**
  - 상태 바(대기/진행/종료, 현재 턴, 마지막 뽑힌 이름)
  - 실시간 순위(`isSpectator=true`)
  - 채팅(`isSpectator=true` → 요청하기/자랑하기 비활성)
  - 뽑힌 이름 목록 표시
