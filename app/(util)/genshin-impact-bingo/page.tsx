import GenshinData from 'genshin-data';
import { BingoGame } from './components/BingoGame';
import { Page, Title } from './page.styles';

export default async function GenshinImpactBingoPage() {
  const genshinData = new GenshinData({
    language: 'korean',
  });
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
    <Page>
      <Title>원신 캐릭터 빙고</Title>
      <BingoGame
        characterNames={characterNames}
        characterEnNames={characterEnNames}
      />
    </Page>
  );
}
