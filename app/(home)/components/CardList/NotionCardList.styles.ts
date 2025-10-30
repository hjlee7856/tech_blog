import { styled } from '@/styled-system/jsx';

export const Grid = styled('div', {
  base: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: { pc: 'repeat(2, 1fr)', pcDown: 'repeat(1, 1fr)' },
    gap: '2rem',
    alignItems: 'stretch',
    justifyItems: 'center',
    padding: { pc: '0', pcDown: '0 20px' },
  },
});

export const Card = styled('a', {
  base: {
    flex: 1,
    width: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.09)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'box-shadow 0.2s, transform 0.2s',
    _hover: {
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.13)',
      transform: 'translateY(-4px) scale(1.025)',
    },
    _focus: {
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.13)',
      transform: 'translateY(-4px) scale(1.025)',
    },
  },
});

export const Cover = styled('div', {
  base: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f6fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const CoverPlaceholder = styled('div', {
  base: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: '100%',
    aspectRatio: '16 / 10',
    display: 'block',
    objectFit: 'cover',
    backgroundColor: '#e0e0e0',
  },
});

export const Body = styled('div', {
  base: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
});

export const Category = styled('div', {
  base: {
    width: '100%',
    color: '#fff',
    fontSize: '0.9rem',
    borderRadius: '7px',
    fontWeight: 500,
    overflow: 'hidden',
  },
});

export const Title = styled('div', {
  base: {
    fontSize: '1.35rem',
    fontWeight: 700,
    lineHeight: 1.3,
    overflow: 'hidden',
  },
});

export const Summary = styled('div', {
  base: {
    color: '#666',
    fontSize: '1.04rem',
    lineHeight: 1.5,
    overflow: 'hidden',
  },
});
