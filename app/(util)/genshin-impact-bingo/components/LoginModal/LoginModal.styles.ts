import { styled } from '@/styled-system/jsx';

export const Backdrop = styled('div', {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    background: '#1E1F22',
  },
});

export const SpectatorButton = styled('button', {
  base: {
    padding: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#3F4147',
    color: 'white',
    border: '1px solid #5865F2',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#4F545C',
    },
  },
});

export const Modal = styled('div', {
  base: {
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    padding: '32px',
    width: '90%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
});

export const Title = styled('h2', {
  base: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    margin: 0,
  },
});

export const Form = styled('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

export const InputGroup = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
});

export const Label = styled('label', {
  base: {
    fontSize: '14px',
    color: '#B5BAC1',
    fontWeight: '500',
  },
});

export const Input = styled('input', {
  base: {
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: '#1E1F22',
    border: '1px solid #3F4147',
    borderRadius: '8px',
    color: 'white',
    outline: 'none',
    _focus: {
      borderColor: '#5865F2',
    },
    _placeholder: {
      color: '#6D6F78',
    },
  },
});

export const SubmitButton = styled('button', {
  base: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#5865F2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    _hover: {
      backgroundColor: '#4752C4',
    },
    _disabled: {
      backgroundColor: '#3F4147',
      cursor: 'not-allowed',
    },
  },
});

export const ToggleButton = styled('button', {
  base: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#5865F2',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
    _hover: {
      color: '#7983F5',
    },
  },
});

export const ErrorMessage = styled('p', {
  base: {
    color: '#ED4245',
    fontSize: '14px',
    textAlign: 'center',
    margin: 0,
  },
});

export const HelperText = styled('p', {
  base: {
    color: '#B5BAC1',
    fontSize: '12px',
    margin: 0,
  },
});

export const UserInfo = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: '#2B2D31',
    borderRadius: '8px',
  },
});

export const UserName = styled('span', {
  base: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
});

export const LogoutButton = styled('button', {
  base: {
    padding: '6px 12px',
    fontSize: '13px',
    backgroundColor: '#3F4147',
    color: '#B5BAC1',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    _hover: {
      backgroundColor: '#4F545C',
    },
  },
});
