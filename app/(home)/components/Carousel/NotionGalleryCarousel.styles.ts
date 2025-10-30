import { styled } from '@/styled-system/jsx';

export const Container = styled('section', {
  base: {
    position: 'relative',
    width: '100%',
    height: { pc: '75vh', pcDown: '450px' },
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
    padding: { pc: '0 80px', pcDown: '0 26px' },
    width: '100%',
    height: { pc: '33%', pcDown: '50%' },
    position: 'absolute',
    top: { pc: '33%', pcDown: '30%' },
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: { pc: 'center', pcDown: 'flex-start' },
    justifyContent: 'center',
    zIndex: 100,
    color: '#fff',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
    cursor: 'pointer',
    textDecoration: 'none',
  },
});

export const OverlayContent = styled('div', {
  base: {
    width: { pc: '70%', pcDown: '90%' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: { pc: 'center', pcDown: 'flex-start' },
    justifyContent: { pc: 'center', pcDown: 'flex-start' },
    textAlign: { pc: 'center', pcDown: 'left' },
  },
});

export const Category = styled('div', {
  base: {
    color: '#fff',
    fontSize: { pc: '1.1rem', pcDown: '0.8rem' },
    fontWeight: 600,
    marginBottom: { pc: '30px', pcDown: '10px' },
    letterSpacing: '0.08em',
    opacity: 0.85,
    borderRadius: '22px',
    border: '1px solid white',
    padding: { pc: '8px 24px', pcDown: '4px 14px' },
  },
});

export const Title = styled('div', {
  base: {
    color: '#fff',
    maxWidth: { pc: '70%', pcDown: '90%' },
    fontSize: { pc: '2.5rem', pcDown: '1.8rem' },
    fontWeight: 700,
    marginBottom: { pc: '22px', pcDown: '10px' },
    textAlign: { pc: 'center', pcDown: 'left' },
    whiteSpace: 'normal',
    wordBreak: 'keep-all',
  },
});

export const Subtitle = styled('div', {
  base: {
    color: '#fff',
    width: '100%',
    minHeight: '60px',
    fontSize: { pc: '1.2rem', pcDown: '1rem' },
    fontWeight: 400,
    textAlign: { pc: 'center', pcDown: 'left' },
    opacity: 0.92,
    overflow: { pc: 'visible', pcDown: 'hidden' },
    textOverflow: { pc: 'clip', pcDown: 'ellipsis' },
    whiteSpace: 'normal',
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
    display: { pc: 'flex', pcDown: 'none' },
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 0.2s',
    transform: 'translateY(-50%)',
    pointerEvents: 'auto',
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
    display: { pc: 'flex', pcDown: 'none' },
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 0.2s',
    transform: 'translateY(-50%)',
    pointerEvents: 'auto',
  },
});
