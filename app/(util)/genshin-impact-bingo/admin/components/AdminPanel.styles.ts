import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    minHeight: '100vh',
    backgroundColor: '#1E1F22',
    padding: '40px 20px',
  },
});

export const Title = styled('h1', {
  base: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '32px',
  },
});

export const Section = styled('div', {
  base: {
    maxWidth: '800px',
    margin: '0 auto 32px',
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    padding: '24px',
  },
});

export const SectionTitle = styled('h2', {
  base: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px',
  },
});

export const ButtonGroup = styled('div', {
  base: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
});

export const Button = styled('button', {
  base: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '#5865F2',
        _hover: { backgroundColor: '#4752C4' },
      },
      danger: {
        backgroundColor: '#ED4245',
        _hover: { backgroundColor: '#C73E3A' },
      },
      success: {
        backgroundColor: '#3BA55C',
        _hover: { backgroundColor: '#2D8049' },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export const StatusBadge = styled('span', {
  base: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  variants: {
    status: {
      started: {
        backgroundColor: '#3BA55C',
        color: 'white',
      },
      stopped: {
        backgroundColor: '#747F8D',
        color: 'white',
      },
    },
  },
});

export const PlayerList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
});

export const PlayerItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#3F4147',
    borderRadius: '8px',
    color: 'white',
  },
  variants: {
    isCurrentTurn: {
      true: {
        backgroundColor: '#5865F2',
        border: '2px solid #7983F5',
      },
    },
  },
});

export const PlayerName = styled('span', {
  base: {
    fontSize: '16px',
    fontWeight: '500',
  },
});

export const PlayerOrder = styled('span', {
  base: {
    fontSize: '14px',
    color: '#B5BAC1',
  },
});

export const OrderInput = styled('input', {
  base: {
    width: '60px',
    padding: '6px 8px',
    fontSize: '14px',
    backgroundColor: '#1E1F22',
    border: '1px solid #3F4147',
    borderRadius: '6px',
    color: 'white',
    textAlign: 'center',
    outline: 'none',
    _focus: {
      borderColor: '#5865F2',
    },
  },
});

export const DrawnNamesList = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  },
});

export const DrawnName = styled('span', {
  base: {
    padding: '6px 12px',
    backgroundColor: '#5865F2',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
  },
});

export const InfoText = styled('p', {
  base: {
    color: '#B5BAC1',
    fontSize: '14px',
    margin: '8px 0',
  },
});

export const CurrentTurnInfo = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#3F4147',
    borderRadius: '8px',
    marginBottom: '16px',
  },
});

export const TurnLabel = styled('span', {
  base: {
    color: '#B5BAC1',
    fontSize: '14px',
  },
});

export const TurnPlayer = styled('span', {
  base: {
    color: '#5865F2',
    fontSize: '18px',
    fontWeight: 'bold',
  },
});

export const PlayerActions = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

export const DeleteButton = styled('button', {
  base: {
    padding: '6px 10px',
    fontSize: '12px',
    backgroundColor: '#ED4245',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    _hover: {
      backgroundColor: '#C73E3A',
    },
  },
});

export const PlayerInfo = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
});

export const PlayerScore = styled('span', {
  base: {
    fontSize: '12px',
    color: '#3BA55C',
  },
});

export const PlayerStatus = styled('span', {
  base: {
    fontSize: '11px',
    color: '#B5BAC1',
  },
});
