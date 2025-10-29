import { styled } from '@/styled-system/jsx'

export const Root = styled('div', {
  base: {
    marginTop: '30px',
    width: '100%',
    position: 'relative',
  },
})

export const ImageWrapper = styled('div', {
  base: {
    width: '100%',
    height: '267px',
    position: 'relative',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderRadius: '16px',
    '@media (max-width: 600px)': {
      height: '160px',
      borderRadius: '10px',
    },
  },
})

export const Image = styled('img', {
  base: {
    objectFit: 'cover',
  },
})

export const Overlay = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.5,
    zIndex: 2,
    borderRadius: '16px',
  },
})

export const Content = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    pointerEvents: 'none',
  },
})

export const Text = styled('div', {
  base: {
    wordBreak: 'keep-all',
    whiteSpace: 'pre-line',
    fontSize: '20px',
    pointerEvents: 'auto',
    '@media (max-width: 600px)': {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
})

export const Link = styled('a', {
  base: {
    fontWeight: 'bold',
    fontSize: '24px',
    color: '#fff',
    textDecoration: 'underline',
    pointerEvents: 'auto',
    transition: 'color 0.2s',
    outline: 'none',
    _hover: {
      outline: 'none',
    },
    _focus: {
      outline: 'none',
    },
    '@media (max-width: 600px)': {
      fontSize: '16px',
    },
  },
})
