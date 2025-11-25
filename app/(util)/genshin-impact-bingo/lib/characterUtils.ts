// 한글 이름 -> 영어 이름 매핑 생성
export function createNameMap(
  koreanNames: string[],
  englishNames: string[],
): Map<string, string> {
  const map = new Map<string, string>();
  // 이름 순서가 동일하다고 가정
  for (const [i, kr] of koreanNames.entries()) {
    const en = englishNames[i];
    if (kr && en) {
      map.set(kr, en);
    }
  }
  return map;
}

// 캐릭터 아바타 이미지 경로 생성
export function getCharacterImagePath(englishName: string): string {
  const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
  return `/genshin-impact/${safeName}_Avatar.webp`;
}

// 한글 이름으로 이미지 경로 가져오기
export function getCharacterImageByKoreanName(
  koreanName: string,
  nameMap: Map<string, string>,
): string {
  const englishName = nameMap.get(koreanName);
  if (!englishName) return '/genshin-impact/Aino_Avatar.webp';
  return getCharacterImagePath(englishName);
}

// 프로필 이미지용 - 영어 이름만 저장하고 경로는 동적 생성
export function getProfileImagePathUtil(englishName: string): string {
  const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
  return `/genshin-impact/${safeName}_Avatar.webp`;
}

// 랜덤 영어 이름 선택 (프로필용)
export function getRandomEnglishName(englishNames: string[]): string {
  const index = Math.floor(Math.random() * englishNames.length);
  return englishNames[index] ?? 'Aino';
}
