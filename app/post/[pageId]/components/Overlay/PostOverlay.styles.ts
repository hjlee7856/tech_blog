import { styled } from '@/styled-system/jsx'

export const Overlay = styled('div', {
  base: {
    width: '100%',
    height: '75vh',
    position: 'absolute',
    zIndex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (max-width: 767px)': {
      height: '450px',
    },
  },
})

export const Content = styled('div', {
  base: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: '320px',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
    '@media (max-width: 767px)': {
      width: '90%',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      textAlign: 'left',
    },
  },
})

export const Category = styled('button', {
  base: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: '#fff',
    display: 'inline-block',
    fontSize: '1.1rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    opacity: 0.85,
    borderRadius: '22px',
    border: '1px solid white',
    padding: '8px 24px',
    cursor: 'pointer',
    '@media (max-width: 767px)': {
      fontSize: '0.8rem',
      marginBottom: '5px',
      padding: '4px 14px',
    },
  },
})

export const Title = styled('h1', {
  base: {
    maxWidth: '90%',
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '22px',
    textAlign: 'center',
    whiteSpace: 'normal',
    wordBreak: 'keep-all',
    '@media (max-width: 767px)': {
      fontSize: '1.8rem',
      marginBottom: '5px',
      textAlign: 'left',
    },
  },
})

export const Subtitle = styled('h2', {
  base: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 400,
    textAlign: 'center',
    opacity: 0.92,
    '@media (max-width: 767px)': {
      fontSize: '1rem',
      textAlign: 'left',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
    },
  },
})
