import { styled } from '@/styled-system/jsx';

export const Backdrop = styled('div', {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});

export const Modal = styled('div', {
  base: {
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: { md: '500px', mdDown: '100%' },
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

export const Header = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const Title = styled('h2', {
  base: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
});

export const CloseButton = styled('button', {
  base: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#B5BAC1',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px 8px',
    _hover: {
      color: 'white',
    },
  },
});

export const SearchInput = styled('input', {
  base: {
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: '#1E1F22',
    border: '1px solid #3F4147',
    borderRadius: '8px',
    color: 'white',
    outline: 'none',
    _focus: {
      borderColor: '#5865F2',
    },
    _placeholder: {
      color: '#B5BAC1',
    },
  },
});

export const ClearCellButton = styled('button', {
  base: {
    padding: '10px 16px',
    fontSize: '14px',
    backgroundColor: '#ED4245',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    _hover: {
      backgroundColor: '#C73E3A',
    },
  },
});

export const ListContainer = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    overflowY: 'auto',
    maxHeight: '400px',
    padding: '4px',
  },
});

export const EmptyMessage = styled('p', {
  base: {
    gridColumn: 'span 3',
    textAlign: 'center',
    color: '#B5BAC1',
    padding: '20px',
  },
});

export const CharacterButton = styled('button', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 4px',
    fontSize: '11px',
    backgroundColor: '#3F4147',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    wordBreak: 'keep-all',
    _hover: {
      backgroundColor: '#5865F2',
    },
  },
});

export const CharacterImage = styled('div', {
  base: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
});

export const CharacterName = styled('span', {
  base: {
    fontSize: '10px',
    lineHeight: '1.2',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
