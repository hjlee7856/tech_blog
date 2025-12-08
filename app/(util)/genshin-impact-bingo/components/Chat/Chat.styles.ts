import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    md: {
      maxWidth: '600px',
      padding: '16px',
      marginTop: '20px',
    },
  },
});

export const Title = styled('h3', {
  base: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    md: {
      fontSize: '16px',
      marginBottom: '12px',
    },
  },
});

export const MessageList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '10px',
    padding: '8px',
    backgroundColor: '#1E1F22',
    borderRadius: '8px',
    md: {
      maxHeight: '400px',
      gap: '8px',
    },
  },
});

export const MessageItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '6px',
    backgroundColor: '#3F4147',
    fontSize: '13px',
    md: {
      fontSize: '14px',
      padding: '8px 10px',
    },
  },
  variants: {
    isBoast: {
      true: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        border: '1px solid #FFD700',
      },
    },
    isMe: {
      true: {
        backgroundColor: '#4752C4',
      },
    },
  },
});

export const MessageProfile = styled('div', {
  base: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    md: {
      width: '32px',
      height: '32px',
    },
  },
});

export const MessageContent = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
});

export const MessageHeaderContainer = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
});

export const MessageName = styled('span', {
  base: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#B5BAC1',
    md: {
      fontSize: '12px',
    },
  },
});

export const MessageText = styled('span', {
  base: {
    fontSize: '13px',
    color: 'white',
    wordBreak: 'break-word',
    md: {
      fontSize: '14px',
    },
  },
});

export const MessageTime = styled('span', {
  base: {
    fontSize: '10px',
    color: '#72767D',
    flexShrink: 0,
    md: {
      fontSize: '11px',
    },
  },
});

export const BoastBadge = styled('span', {
  base: {
    marginLeft: '6px',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: '4px',
    md: {
      fontSize: '11px',
    },
  },
});

export const InputSection = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
});

export const ChatInput = styled('input', {
  base: {
    flex: 1,
    padding: '10px 12px',
    fontSize: '13px',
    color: 'white',
    backgroundColor: '#1E1F22',
    border: '1px solid #3F4147',
    borderRadius: '8px',
    outline: 'none',
    _focus: {
      borderColor: '#5865F2',
    },
    _placeholder: {
      color: '#72767D',
    },
    md: {
      fontSize: '14px',
      padding: '12px 14px',
    },
  },
});

export const ButtonSection = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

export const SendButton = styled('button', {
  base: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#5865F2',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',

    _hover: {
      backgroundColor: '#4752C4',
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    md: {
      fontSize: '14px',
      padding: '12px 20px',
    },
  },
});

export const BoastButton = styled('button', {
  base: {
    padding: '10px 14px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    border: '1px solid #FFD700',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    _hover: {
      backgroundColor: 'rgba(255, 215, 0, 0.25)',
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    md: {
      fontSize: '13px',
      padding: '12px 16px',
    },
  },
});

export const EmptyMessage = styled('div', {
  base: {
    textAlign: 'center',
    color: '#72767D',
    fontSize: '13px',
    padding: '20px',
    md: {
      fontSize: '14px',
    },
  },
});
