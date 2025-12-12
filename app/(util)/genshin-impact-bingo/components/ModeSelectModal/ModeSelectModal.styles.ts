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
    padding: '16px',
  },
});

export const Modal = styled('div', {
  base: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
});

export const Title = styled('h2', {
  base: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
});

export const Description = styled('p', {
  base: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.4',
    color: '#B5BAC1',
  },
});

export const ButtonRow = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    marginTop: '8px',
  },
});

export const PrimaryButton = styled('button', {
  base: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#5865F2',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer',
    _hover: {
      backgroundColor: '#4752C4',
    },
  },
});

export const SecondaryButton = styled('button', {
  base: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #3F4147',
    backgroundColor: '#1E1F22',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer',
    _hover: {
      backgroundColor: '#3F4147',
    },
  },
});
