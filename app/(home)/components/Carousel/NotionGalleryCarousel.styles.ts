import { styled } from '@/styled-system/jsx';

export const Container = styled('section', {
  base: {
    position: 'relative',
    width: '100%',
    height: '75vh',
    '@media (max-width: 900px)': {
      height: '580px',
    },
    '@media (max-width: 768px)': {
      height: '450px',
    },
  },
});

export const CarouselImage = styled('img', {
  base: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    backgroundColor: '#222',
    position: 'relative',
    zIndex: 0,
  },
});

export const ImageCoverOverlay = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.5,
    zIndex: 1,
    pointerEvents: 'none',
    borderRadius: 'inherit',
  },
});

export const Overlay = styled('a', {
  base: {
    padding: '0 80px',
    width: '100%',
    height: '33%',
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    color: '#fff',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
    cursor: 'pointer',
    textDecoration: 'none',
    '@media (max-width: 768px)': {
      paddingLeft: '26px',
      paddingRight: '26px',
      height: '50%',
      top: '30%',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
  },
});

export const OverlayContent = styled('div', {
  base: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      width: '90%',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      textAlign: 'left',
    },
  },
});

export const Category = styled('div', {
  base: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '30px',
    letterSpacing: '0.08em',
    opacity: 0.85,
    borderRadius: '22px',
    border: '1px solid white',
    padding: '8px 24px',
    '@media (max-width: 768px)': {
      fontSize: '0.8rem',
      marginBottom: '10px',
      padding: '4px 14px',
    },
  },
});

export const Title = styled('div', {
  base: {
    color: '#fff',
    maxWidth: '70%',
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '22px',
    textAlign: 'center',
    whiteSpace: 'normal',
    wordBreak: 'keep-all',
    '@media (max-width: 768px)': {
      maxWidth: '90%',
      fontSize: '1.8rem',
      marginBottom: '10px',
      textAlign: 'left',
    },
  },
});

export const Subtitle = styled('div', {
  base: {
    color: '#fff',
    width: '100%',
    minHeight: '60px',
    fontSize: '1.2rem',
    fontWeight: 400,
    textAlign: 'center',
    opacity: 0.92,
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      textAlign: 'left',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
    },
  },
});

export const Pagination = styled('div', {
  base: {
    position: 'absolute',
    left: '50%',
    bottom: '32px',
    zIndex: 10,
    display: 'flex',
    gap: '8px',
    transform: 'translateX(-50%)',
  },
});

export const Dot = styled('div', {
  base: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    opacity: 0.35,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  },
});

export const DotActive = styled('div', {
  base: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    opacity: 1,
    cursor: 'default',
  },
});

export const ArrowContainer = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 20,
  },
});

export const ArrowBtn = styled('button', {
  base: {
    position: 'absolute',
    top: '50%',
    width: '44px',
    height: '44px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s',
    transform: 'translateY(-50%)',
    pointerEvents: 'auto',
  },
});

export const ArrowLeft = styled('button', {
  base: {
    position: 'absolute',
    top: '50%',
    left: '20px',
    width: '64px',
    height: '64px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 0.2s',
    transform: 'translateY(-50%)',
    pointerEvents: 'auto',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

export const ArrowRight = styled('button', {
  base: {
    position: 'absolute',
    top: '50%',
    right: '20px',
    width: '64px',
    height: '64px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 0.2s',
    transform: 'translateY(-50%)',
    pointerEvents: 'auto',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});
