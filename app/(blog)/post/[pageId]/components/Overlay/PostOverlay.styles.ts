import { styled } from '@/styled-system/jsx';

export const Overlay = styled('div', {
  base: {
    width: '100%',
    height: { pc: '75vh', pcDown: '450px' },
    position: 'absolute',
    zIndex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Content = styled('div', {
  base: {
    width: { pc: '70%', pcDown: '90%' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: { pc: 'center', pcDown: 'flex-start' },
    justifyContent: { pc: 'center', pcDown: 'flex-start' },
    textAlign: { pc: 'center', pcDown: 'left' },
    minWidth: '320px',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
  },
});

export const Category = styled('button', {
  base: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: '#fff',
    display: 'inline-block',
    fontSize: { pc: '1.1rem', pcDown: '0.8rem' },
    fontWeight: 600,
    letterSpacing: '0.08em',
    opacity: 0.85,
    borderRadius: '22px',
    border: '1px solid white',
    padding: { pc: '8px 24px', pcDown: '4px 14px' },
    marginBottom: { pc: '0', pcDown: '5px' },
    cursor: 'pointer',
  },
});

export const Title = styled('h1', {
  base: {
    maxWidth: '90%',
    color: '#fff',
    fontSize: { pc: '2.5rem', pcDown: '1.8rem' },
    fontWeight: 700,
    marginBottom: { pc: '22px', pcDown: '5px' },
    textAlign: { pc: 'center', pcDown: 'left' },
    whiteSpace: 'normal',
    wordBreak: 'keep-all',
  },
});

export const Subtitle = styled('h2', {
  base: {
    color: '#fff',
    fontSize: { pc: '1.2rem', pcDown: '1rem' },
    fontWeight: 400,
    textAlign: { pc: 'center', pcDown: 'left' },
    opacity: 0.92,
    overflow: { pc: 'visible', pcDown: 'hidden' },
    textOverflow: { pc: 'clip', pcDown: 'ellipsis' },
    whiteSpace: 'normal',
  },
});
