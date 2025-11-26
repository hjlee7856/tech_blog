import GenshinData from 'genshin-data';
import type { Metadata } from 'next';
import { BingoGame } from './components/BingoGame';
import { Page, Title } from './page.styles';

export const metadata: Metadata = {
  title: '원직쉼 송년회 빙고보드',
  description: '즐거운 연말, 원직쉼 송년회 빙고 맞추고, 상품 Get!',
  openGraph: {
    title: '원직쉼 송년회 빙고보드',
    description: '즐거운 연말, 원직쉼 송년회 빙고 맞추고 상품 Get!',
    type: 'website',
    url: 'https://bingo-genshin-impact.vercel.app/genshin-impact-bingo',
    images: [
      {
        url: 'https://bingo-genshin-impact.vercel.app/genshin-impact/og-img.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '원직쉼 송년회 빙고보드',
    description: '즐거운 연말, 원직쉼 송년회 빙고 맞추고, 상품 Get!',
    images: [
      {
        url: 'https://bingo-genshin-impact.vercel.app/genshin-impact/og-img.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

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
