import { styled } from '@/styled-system/jsx';

export const Overlay = styled('div', {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '16px',
  },
});

export const Container = styled('div', {
  base: {
    backgroundColor: '#2B2D31',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    md: {
      padding: '32px',
    },
  },
});

export const Header = styled('div', {
  base: {
    textAlign: 'center',
    marginBottom: '24px',
  },
});

export const Title = styled('h2', {
  base: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: '8px',
    md: {
      fontSize: '28px',
    },
  },
});

export const Subtitle = styled('p', {
  base: {
    fontSize: '14px',
    color: '#B5BAC1',
    md: {
      fontSize: '16px',
    },
  },
});

export const StepIndicator = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
});

export const StepDot = styled('button', {
  base: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    md: {
      width: '12px',
      height: '12px',
    },
  },
  variants: {
    isActive: {
      true: {
        backgroundColor: '#5865F2',
        transform: 'scale(1.2)',
      },
      false: {
        backgroundColor: '#4F545C',
        _hover: {
          backgroundColor: '#6D7078',
        },
      },
    },
  },
});

export const StepContent = styled('div', {
  base: {
    textAlign: 'center',
    marginBottom: '24px',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const StepIcon = styled('div', {
  base: {
    fontSize: '48px',
    marginBottom: '16px',
    md: {
      fontSize: '64px',
    },
  },
});

export const StepTitle = styled('h3', {
  base: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '12px',
    md: {
      fontSize: '22px',
    },
  },
});

export const StepDescription = styled('p', {
  base: {
    fontSize: '14px',
    color: '#B5BAC1',
    lineHeight: 1.6,
    md: {
      fontSize: '16px',
    },
  },
});

export const HighlightText = styled('span', {
  base: {
    color: '#5865F2',
    fontWeight: 'bold',
  },
});

export const GoldText = styled('span', {
  base: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export const GreenText = styled('span', {
  base: {
    color: '#3BA55C',
    fontWeight: 'bold',
  },
});

export const ButtonGroup = styled('div', {
  base: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
});

export const NavButton = styled('button', {
  base: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    md: {
      padding: '12px 24px',
      fontSize: '16px',
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '#5865F2',
        color: 'white',
        _hover: {
          backgroundColor: '#4752C4',
        },
      },
      secondary: {
        backgroundColor: '#4F545C',
        color: 'white',
        _hover: {
          backgroundColor: '#6D7078',
        },
      },
      start: {
        backgroundColor: '#3BA55C',
        color: 'white',
        _hover: {
          backgroundColor: '#2D8049',
        },
      },
    },
  },
});

export const SkipButton = styled('button', {
  base: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '8px 16px',
    fontSize: '12px',
    color: '#B5BAC1',
    backgroundColor: 'transparent',
    border: '1px solid #4F545C',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#4F545C',
      color: 'white',
    },
    md: {
      fontSize: '14px',
    },
  },
});

export const FeatureList = styled('ul', {
  base: {
    textAlign: 'left',
    listStyle: 'none',
    padding: 0,
    margin: '16px 0 0 0',
  },
});

export const FeatureItem = styled('li', {
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
    color: '#B5BAC1',
    marginBottom: '8px',
    md: {
      fontSize: '14px',
    },
  },
});

export const FeatureIcon = styled('span', {
  base: {
    flexShrink: 0,
  },
});
