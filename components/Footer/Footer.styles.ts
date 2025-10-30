import { styled } from '@/styled-system/jsx';

export const FooterWrapper = styled('footer', {
  base: {
    height: { pc: '90px', pcDown: 'auto' },
    width: '100%',
    padding: { pc: '8px', pcDown: '8px' },
    display: 'flex',
    flexDirection: { pc: 'row', pcDown: 'column' },
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f3f6',
    paddingTop: { pc: '0', pcDown: '1em' },
  },
});

export const FooterContent = styled('div', {
  base: {
    width: '100%',
    maxWidth: '900px',
    display: 'flex',
    flexDirection: { pc: 'row', tabletDown: 'column' },
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    gap: { pc: '0', tabletDown: '6px' },
  },
});

export const CopyrightSection = styled('div', {
  base: {
    fontSize: { pc: '100%', tabletDown: '80%' },
    textAlign: 'center',
    color: '#868b94',
    order: { pc: 'auto', mobileDown: 3 },
    marginTop: { pc: '0', mobileDown: '1em' },
    '& p': {
      margin: '4px',
    },
  },
});
