import type { Metadata } from 'next';
import { SpectatorPanel } from './components';

export const metadata: Metadata = {
  title: '원직쉼 송년회 빙고보드 관전 페이지',
  description: '실시간으로 빙고 게임을 관전하세요!',
  openGraph: {
    title: '원직쉼 송년회 빙고보드 관전 페이지',
    description: '실시간으로 빙고 게임을 관전하세요!',
    type: 'website',
    url: 'https://bingo-genshin-impact.vercel.app/genshin-impact-bingo/spectator',
    images: [
      {
        url: 'https://bingo-genshin-impact.vercel.app/genshin-impact/og-img.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '원직쉼 송년회 빙고보드 관전 페이지',
    description: '실시간으로 빙고 게임을 관전하세요!',
    images: [
      {
        url: 'https://bingo-genshin-impact.vercel.app/genshin-impact/og-img.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function SpectatorPage() {
  return <SpectatorPanel />;
}
