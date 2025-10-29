import { styled } from '@/styled-system/jsx';

export const ContentContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0 auto',
    width: '100%',
    height: 'auto',
    alignItems: 'flex-start',
  },
});

export const MainContent = styled('div', {
  base: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    minHeight: 0,
  },
});

export const Main = styled('div', {
  base: {
    paddingInline: '24px',
    width: '100%',
    overflow: 'hidden',
    '@media (max-width: 1024px)': {
      paddingInline: '0px',
      width: '100%',
      overflow: 'hidden',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Content = styled('div', {
  base: {
    width: '100%',
    padding: '24px',
    flex: 1,
    maxWidth: '1200px',
    '@media (max-width: 1024px)': {
      width: '100%',
      padding: '0px',
      flex: 1,
      maxWidth: '1200px',
    },
  },
});

export const CategorySection = styled('section', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    '@media only screen and (max-width: 566px)': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '8px',
      marginBottom: '16px',
    },
  },
});
