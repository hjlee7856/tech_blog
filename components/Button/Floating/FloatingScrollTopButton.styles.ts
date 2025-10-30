import { styled } from '@/styled-system/jsx';

export const ScrollTopButton = styled('button', {
  base: {
    position: 'fixed',
    right: { pc: '3rem', pcDown: '1rem' },
    bottom: { pc: '3rem', pcDown: '1rem' },
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    minHeight: '48px',
    borderRadius: '50%',
    backgroundColor: '#05309d',
    border: '1px solid #05309d',
    outline: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'opacity 0.2s ease',
    _hover: {
      opacity: 0.8,
    },
  },
});
