import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#232428',
    border: '1px solid #313338',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '16px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    md: {
      maxWidth: '600px',
      padding: '16px',
      marginTop: '20px',
    },
  },
  variants: {
    isSpectator: {
      true: {
        width: '100%',
        maxWidth: '100%',
        md: {
          maxWidth: '100%',
        },
      },
    },
  },
});

export const OnlineDot = styled('span', {
  base: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    marginRight: '4px',
    backgroundColor: '#4F545C',
    flexShrink: 0,
  },
  variants: {
    isOnline: {
      true: {
        backgroundColor: '#3BA55C',
      },
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

export const MessageListWrapper = styled('div', {
  base: {
    position: 'relative',
    marginBottom: '10px',
  },
});

export const MessageList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '8px',
    backgroundColor: '#111214',
    border: '1px solid #2B2D31',
    borderRadius: '8px',
    md: {
      maxHeight: '500px',
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
    backgroundColor: '#2B2D31',
    border: '1px solid #313338',
    fontSize: '13px',
    lineHeight: '1.35',
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
      true: {},
    },
    isRequest: {
      true: {
        backgroundColor: 'rgba(88, 101, 242, 0.15)',
        border: '1px solid #5865F2',
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
    border: '2px solid transparent',
    boxSizing: 'border-box',
    flexShrink: 0,
    md: {
      width: '32px',
      height: '32px',
    },
  },
  variants: {
    isTyping: {
      true: {
        borderColor: '#3BA55C',
      },
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
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#DDE0E6',
    md: {
      fontSize: '13px',
    },
  },
});

export const MessageText = styled('span', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#F2F3F5',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    md: {
      fontSize: '15px',
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
    display: 'inline-flex',
    alignItems: 'center',
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

export const TypingIndicator = styled('div', {
  base: {
    minHeight: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#B5BAC1',
    paddingLeft: '2px',
  },
});

export const TypingAvatarStack = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    flexShrink: 0,
  },
});

export const TypingAvatar = styled('div', {
  base: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #2B2D31',
    boxSizing: 'border-box',
    marginLeft: '-6px',
    _first: {
      marginLeft: '0px',
    },
  },
});

export const ChatInput = styled('input', {
  base: {
    flex: 1,
    padding: '10px 12px',
    fontSize: '13px',
    color: '#F2F3F5',
    backgroundColor: '#0F1012',
    border: '1px solid #2B2D31',
    borderRadius: '8px',
    outline: 'none',
    _focus: {
      borderColor: '#5865F2',
      boxShadow: '0 0 0 3px rgba(88, 101, 242, 0.28)',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
});

export const RequestButtonGroup = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
  },
});

export const RequestButton = styled('button', {
  base: {
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(88, 101, 242, 0.25)',
    border: '1px solid #5865F2',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    _hover: {
      backgroundColor: 'rgba(88, 101, 242, 0.35)',
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    md: {
      fontSize: '13px',
      padding: '10px 12px',
    },
  },
});

export const RequestCharacterPanel = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
    gap: '8px',
    marginTop: '8px',
    padding: '8px',
    backgroundColor: '#1E1F22',
    borderRadius: '8px',
    width: '100%',
  },
});

export const RequestCharacterItem = styled('button', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '6px',
    backgroundColor: '#2B2D31',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    width: '100%',
    _hover: {
      borderColor: '#5865F2',
      backgroundColor: '#313338',
    },
  },
});

export const RequestCharacterLabel = styled('span', {
  base: {
    fontSize: '11px',
    color: '#B5BAC1',
    textAlign: 'center',
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
    padding: '8px 10px',
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
      padding: '10px 12px',
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

export const NewMessageToast = styled('button', {
  base: {
    width: '100%',
    paddingInline: '12px',
    position: 'absolute',
    bottom: '0px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(88, 101, 242, 0.55)',
    backgroundColor: 'rgba(88, 101, 242, 0.18)',
    color: '#F2F3F5',
    fontSize: '12px',
    cursor: 'pointer',
    backdropFilter: 'blur(6px)',
    textAlign: 'left',
    _hover: {
      backgroundColor: 'rgba(88, 101, 242, 0.26)',
    },
    _focusVisible: {
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(88, 101, 242, 0.28)',
    },
    md: {
      fontSize: '13px',
    },
  },
});

export const NewMessageToastAvatar = styled('span', {
  base: {
    width: '24px',
    height: '24px',
    borderRadius: '9999px',
    overflow: 'hidden',
    flexShrink: 0,
    border: '2px solid rgba(17, 18, 20, 0.9)',
    boxSizing: 'border-box',
  },
});

export const NewMessageToastText = styled('span', {
  base: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#DDE0E6',
    flex: 1,
  },
});

export const NewMessageToastBadge = styled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    minWidth: '34px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(88, 101, 242, 0.55)',
    color: '#FFFFFF',
    flexShrink: 0,
  },
});

export const ScrollToBottomFloatingButton = styled('button', {
  base: {
    position: 'absolute',
    right: '12px',
    bottom: '12px',
    zIndex: 10,
    width: '40px',
    height: '40px',
    borderRadius: '9999px',
    border: '1px solid #2B2D31',
    backgroundColor: '#111214',
    color: '#F2F3F5',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.35)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.12s ease, background-color 0.12s ease',
    _hover: {
      backgroundColor: '#1E1F22',
      transform: 'translateY(-1px)',
    },
    _focusVisible: {
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(88, 101, 242, 0.28)',
    },
    md: {
      right: '16px',
      bottom: '16px',
      width: '44px',
      height: '44px',
    },
  },
});
