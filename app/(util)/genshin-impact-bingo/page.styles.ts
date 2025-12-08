import { styled } from '@/styled-system/jsx';

export const Page = styled('div', {
  base: {
    position: 'relative',
    backgroundColor: '#1E1F22',
    padding: '40px 20px',
    minHeight: '100vh',
    // 모바일 가로모드 지원
    '@media (max-width: 896px) and (orientation: landscape)': {
      padding: '20px 40px',
      minHeight: 'auto',
    },
  },
});

export const Title = styled('h1', {
  base: {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '24px',
    marginTop: { mdDown: '48px' },
    // 모바일 가로모드
    '@media (max-width: 896px) and (orientation: landscape)': {
      fontSize: '24px',
      marginTop: '16px',
      marginBottom: '16px',
    },
  },
});
