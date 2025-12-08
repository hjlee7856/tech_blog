// 효과음 재생 유틸리티

let audioContext: AudioContext | null = null;

// AudioContext 초기화 (사용자 인터랙션 후)
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// 간단한 비프음 생성 (파일 없이 Web Audio API 사용)
function playBeep(frequency: number, duration: number, volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration,
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('효과음 재생 실패:', err);
  }
}

// 내 턴 알림음 (상승하는 톤)
export function playMyTurnSound() {
  playBeep(523.25, 0.15, 0.2); // C5
  setTimeout(() => playBeep(659.25, 0.15, 0.2), 100); // E5
  setTimeout(() => playBeep(783.99, 0.2, 0.25), 200); // G5
}

// 이름 선택 효과음 (클릭음)
export function playSelectSound() {
  playBeep(880, 0.1, 0.15); // A5
}

// 빙고 완성 효과음 (성공음)
export function playBingoSound() {
  playBeep(523.25, 0.1, 0.2); // C5
  setTimeout(() => playBeep(659.25, 0.1, 0.2), 80); // E5
  setTimeout(() => playBeep(783.99, 0.1, 0.2), 160); // G5
  setTimeout(() => playBeep(1046.5, 0.3, 0.25), 240); // C6
}

// 게임 종료 효과음 (팡파레)
export function playGameFinishSound() {
  playBeep(523.25, 0.15, 0.2); // C5
  setTimeout(() => playBeep(659.25, 0.15, 0.2), 100); // E5
  setTimeout(() => playBeep(783.99, 0.15, 0.2), 200); // G5
  setTimeout(() => playBeep(1046.5, 0.15, 0.25), 300); // C6
  setTimeout(() => playBeep(1318.51, 0.4, 0.3), 400); // E6
}

// 경고음 (에러, 실패)
export function playWarningSound() {
  playBeep(220, 0.2, 0.2); // A3
  setTimeout(() => playBeep(196, 0.3, 0.2), 150); // G3
}

// 게임 시작 효과음 (시작 신호)
export function playGameStartSound() {
  playBeep(392, 0.1, 0.2); // G4
  setTimeout(() => playBeep(523.25, 0.1, 0.2), 100); // C5
  setTimeout(() => playBeep(659.25, 0.2, 0.25), 200); // E5
}

// 준비 완료 효과음 (확인음)
export function playReadySound() {
  playBeep(659.25, 0.1, 0.15); // E5
  setTimeout(() => playBeep(783.99, 0.15, 0.2), 100); // G5
}
