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
      maxWidth: '600px',
      padding: '16px',
      marginTop: '20px',
    },
  },
  variants: {
    isSpectator: {
      true: {
        width: '100%',
        maxWidth: '100% !important',
      },
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
    isMe: {
      true: {
        border: '2px solid #5865F2',
      },
    },
  },
});

export const RankNumber = styled('span', {
  base: {
    fontSize: '13px',
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
    marginLeft: '8px',
    md: {
      gap: '8px',
    },
  },
});

export const AvatarGroup = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
    flexShrink: 0,
  },
});

export const AvatarStack = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    flexShrink: 0,
  },
});

export const AvatarStackItem = styled('div', {
  base: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    border: '2px solid rgba(0, 0, 0, 0.25)',
    boxSizing: 'border-box',
    marginLeft: '-6px',
    _first: {
      marginLeft: '0px',
    },
    md: {
      width: '24px',
      height: '24px',
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
    fontSize: '13px',
    flex: 1,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    minWidth: 0,
    md: {
      fontSize: '14px',
    },
  },
});

export const PlayerNameWrapper = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    flex: 1,
    minWidth: 0,
  },
});

export const Score = styled('span', {
  base: {
    fontSize: '13px',
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
    fontSize: '13px',
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

export const ExpandButton = styled('button', {
  base: {
    width: '100%',
    padding: '8px',
    marginTop: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#B5BAC1',
    backgroundColor: 'transparent',
    border: '1px solid #3F4147',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#3F4147',
      color: 'white',
    },
    md: {
      fontSize: '14px',
      padding: '10px',
    },
  },
});

// 자랑하기 버튼
export const BoastButton = styled('button', {
  base: {
    marginLeft: '8px',
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#5865F2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#4752C4',
      transform: 'scale(1.05)',
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    md: {
      fontSize: '12px',
      padding: '4px 10px',
    },
  },
});

// 빙고 메시지 (도발)
export const BingoMessage = styled('span', {
  base: {
    marginLeft: '6px',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: '4px',
    animation: 'blink 0.5s ease-in-out 3',
    md: {
      fontSize: '12px',
      padding: '2px 8px',
    },
  },
});
