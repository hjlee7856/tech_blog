import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    width: '100%',
    md: {
      gap: '20px',
      padding: '20px',
    },
  },
});

export const ButtonContainer = styled('div', {
  base: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    md: {
      gap: '12px',
    },
  },
});

export const Button = styled('button', {
  base: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#5865F2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    _hover: {
      backgroundColor: '#4752C4',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
    },
  },
});

export const ClearButton = styled('button', {
  base: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#ED4245',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    _hover: {
      backgroundColor: '#C73E3A',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
    },
  },
});

export const Board = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '4px',
    maxWidth: '100%',
    width: '100%',
    md: {
      gap: '8px',
      maxWidth: '600px',
    },
  },
});

export const Cell = styled('button', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    fontSize: '8px',
    fontWeight: '500',
    backgroundColor: '#2B2D31',
    color: 'white',
    border: '1px solid #3F4147',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    _hover: {
      backgroundColor: '#3F4147',
      borderColor: '#5865F2',
    },
    md: {
      gap: '4px',
      fontSize: '11px',
      border: '2px solid #3F4147',
      borderRadius: '8px',
      padding: '4px',
    },
  },
});

export const MatchedCell = styled('div', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    fontSize: '8px',
    fontWeight: '600',
    backgroundColor: '#1a4a2a',
    color: '#4ade80',
    border: '2px solid #4ade80',
    borderRadius: '4px',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    boxShadow:
      '0 0 8px #4ade80, 0 0 16px #4ade80, inset 0 0 8px rgba(74, 222, 128, 0.3)',
    md: {
      gap: '4px',
      fontSize: '11px',
      border: '3px solid #4ade80',
      borderRadius: '8px',
      padding: '4px',
      boxShadow:
        '0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 30px #4ade80, inset 0 0 10px rgba(74, 222, 128, 0.3)',
    },
  },
});

export const BingoLineCell = styled('div', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    fontSize: '8px',
    fontWeight: '600',
    backgroundColor: '#3d3520',
    color: '#FFD700',
    border: '2px solid #FFD700',
    borderRadius: '4px',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    boxShadow:
      '0 0 8px #FFD700, 0 0 16px #FFD700, inset 0 0 8px rgba(255, 215, 0, 0.3)',
    md: {
      gap: '4px',
      fontSize: '11px',
      border: '3px solid #FFD700',
      borderRadius: '8px',
      padding: '4px',
      boxShadow:
        '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700, inset 0 0 10px rgba(255, 215, 0, 0.3)',
    },
  },
});

export const CellImage = styled('div', {
  base: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    md: {
      width: '48px',
      height: '48px',
    },
  },
});

export const CellName = styled('span', {
  base: {
    fontSize: '13px',
    lineHeight: '1.1',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    md: {
      fontSize: '15px',
    },
  },
});
