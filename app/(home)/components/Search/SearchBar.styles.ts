import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    width: '100%',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    flexDirection: { pc: 'row', tablet: 'column' },
    justifyContent: { pc: 'flex-start', tablet: 'center' },
    gap: { pc: '0', tablet: '16px' },
    padding: { pc: '0', tablet: '0 16px' },
    marginTop: { pc: '0', tablet: '24px' },
  },
});

export const InputContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    border: '1px solid #e5e7eb',
    borderRadius: '9999px',
    backgroundColor: '#f8fafc',
    transition: 'border-color 0.2s, background 0.2s',
  },
});

export const Input = styled('input', {
  base: {
    flex: 1,
    paddingLeft: '5px',
    paddingRight: '20px',
    border: 'none',
    fontSize: '16px',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    color: '#1e293b',
    outline: 'none',
    transition: 'background 0.2s',
    _placeholder: {
      color: '#94a3b8',
      opacity: 1,
    },
    _disabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
});

export const Button = styled('button', {
  base: {
    padding: '10px 16px 10px 10px',
    border: 'none',
    backgroundColor: '#f8fafc',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    transition: 'background 0.2s',
    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.7,
    },
  },
});
