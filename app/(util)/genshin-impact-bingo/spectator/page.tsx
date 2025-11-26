import GenshinData from 'genshin-data';
import type { Metadata } from 'next';
import { SpectatorPanel } from './components';

export const metadata: Metadata = {
  title: '원신 빙고 관전 모드',
  description: '원신 캐릭터 빙고 게임을 실시간으로 관전하세요',
};

export default async function SpectatorPage() {
  const genshinData = new GenshinData({ language: 'korean' });
  const characters = await genshinData.characters();
  const characterNames = characters
    .map((c) => c.name)
    .filter((c) => {
      if (c.includes('여행자') || c.includes('별인형')) return false;
      return true;
    });

  const genshinEnData = new GenshinData();
  const charactersEn = await genshinEnData.characters();
  const characterEnNames = charactersEn
    .map((c) => c.name)
    .filter((c) => {
      if (c.includes('Traveler') || c.includes('Manekin')) return false;
      return true;
    });

  return (
    <SpectatorPanel
      characterNames={characterNames}
      characterEnNames={characterEnNames}
    />
  );
}
