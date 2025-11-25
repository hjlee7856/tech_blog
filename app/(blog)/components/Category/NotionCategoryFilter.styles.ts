import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    width: '100%',
  },
});

export const Button = styled('button', {
  base: {
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '0',
    border: 'none',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 0',
    backgroundColor: 'transparent',
    color: '#6b7280',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s',
    fontWeight: '500',
    width: '100%',
    _hover: {
      color: '#374151',
      paddingLeft: '4px',
    },
  },
});

export const ActiveButton = styled('button', {
  base: {
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '0',
    border: 'none',
    borderBottom: '1px solid #e5e7eb',
    borderLeft: '3px solid #3b82f6',
    padding: '12px 0 12px 8px',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s',
    fontWeight: '600',
    width: '100%',
    _hover: {
      backgroundColor: '#dbeafe',
    },
  },
});
