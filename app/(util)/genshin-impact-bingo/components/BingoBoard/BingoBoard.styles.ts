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
    backgroundColor: '#3BA55C',
    color: 'white',
    border: '1px solid #2D8049',
    borderRadius: '4px',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    md: {
      gap: '4px',
      fontSize: '11px',
      border: '2px solid #2D8049',
      borderRadius: '8px',
      padding: '4px',
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
    fontSize: '7px',
    lineHeight: '1.1',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    md: {
      fontSize: '10px',
    },
  },
});
