import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '16px',
    md: {
      maxWidth: '300px',
      padding: '16px',
      marginTop: '20px',
    },
  },
});

export const Title = styled('h3', {
  base: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px',
    textAlign: 'center',
    md: {
      fontSize: '16px',
      marginBottom: '12px',
    },
  },
});

export const RankList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
});

export const RankItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 10px',
    backgroundColor: '#3F4147',
    borderRadius: '6px',
    md: {
      padding: '8px 12px',
      borderRadius: '8px',
    },
  },
  variants: {
    rank: {
      1: {
        backgroundColor: '#FFD700',
        color: '#1E1F22',
      },
      2: {
        backgroundColor: '#C0C0C0',
        color: '#1E1F22',
      },
      3: {
        backgroundColor: '#CD7F32',
        color: '#1E1F22',
      },
    },
  },
});

export const RankNumber = styled('span', {
  base: {
    fontSize: '12px',
    fontWeight: 'bold',
    minWidth: '20px',
    md: {
      fontSize: '14px',
      minWidth: '24px',
    },
  },
});

export const PlayerInfo = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flex: 1,
    marginRight: '8px',
    md: {
      gap: '8px',
    },
  },
});

export const ProfileImage = styled('div', {
  base: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    md: {
      width: '24px',
      height: '24px',
    },
  },
});

export const PlayerName = styled('span', {
  base: {
    fontSize: '12px',
    flex: 1,
    md: {
      fontSize: '14px',
    },
  },
});

export const PlayerNameWrapper = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

export const Score = styled('span', {
  base: {
    fontSize: '12px',
    fontWeight: 'bold',
    md: {
      fontSize: '14px',
    },
  },
});

export const OnlineIndicator = styled('div', {
  base: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#3BA55C',
    flexShrink: 0,
  },
});

export const ReadyBadge = styled('span', {
  base: {
    fontSize: '12px',
    fontWeight: 'bold',
  },
  variants: {
    isReady: {
      true: {
        color: '#3BA55C',
      },
      false: {
        color: '#B5BAC1',
      },
    },
  },
  defaultVariants: {
    isReady: false,
  },
});
