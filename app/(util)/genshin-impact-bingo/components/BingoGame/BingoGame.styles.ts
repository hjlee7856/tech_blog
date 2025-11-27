import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
  },
});

export const Header = styled('div', {
  base: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 10,
    md: {
      top: '40px',
      right: '20px',
    },
  },
});

export const UserInfo = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#2B2D31',
    borderRadius: '8px',
    md: {
      gap: '12px',
      padding: '8px 16px',
    },
  },
});

export const ProfileImage = styled('div', {
  base: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    md: {
      width: '32px',
      height: '32px',
    },
  },
});

export const UserName = styled('span', {
  base: {
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    md: {
      fontSize: '14px',
    },
  },
});

export const LogoutButton = styled('button', {
  base: {
    padding: '4px 10px',
    fontSize: '11px',
    backgroundColor: '#ED4245',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    _hover: {
      backgroundColor: '#C73E3A',
    },
    md: {
      padding: '6px 12px',
      fontSize: '13px',
    },
  },
});

export const GameStatus = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
});

export const StatusText = styled('p', {
  base: {
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
    textAlign: 'center',
    md: {
      fontSize: '16px',
    },
  },
  variants: {
    isStarted: {
      true: {
        color: '#3BA55C',
      },
      false: {
        color: '#FAA61A',
      },
    },
  },
});

export const DrawnNameDisplay = styled('p', {
  base: {
    fontSize: '14px',
    color: '#5865F2',
    margin: 0,
    padding: '6px 12px',
    backgroundColor: '#2B2D31',
    borderRadius: '8px',
    md: {
      fontSize: '18px',
      padding: '8px 16px',
    },
  },
  variants: {
    isLatest: {
      true: {
        color: '#FFD700',
        fontWeight: 'bold',
        backgroundColor: '#3d3520',
      },
    },
  },
});

export const TurnSection = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    marginBottom: '12px',
    width: '100%',
    maxWidth: '400px',
    md: {
      padding: '16px 24px',
      marginBottom: '16px',
    },
  },
});

export const TurnInfo = styled('p', {
  base: {
    fontSize: '14px',
    color: 'white',
    margin: 0,
    textAlign: 'center',
    md: {
      fontSize: '16px',
    },
  },
  variants: {
    isMyTurn: {
      true: {
        color: '#3BA55C',
        fontWeight: 'bold',
      },
    },
  },
});

export const DrawButton = styled('button', {
  base: {
    padding: '10px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#5865F2',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#4752C4',
      transform: 'scale(1.05)',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    },
    md: {
      padding: '12px 32px',
      fontSize: '18px',
    },
  },
});

export const DrawnResult = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#3F4147',
    borderRadius: '8px',
    animation: 'fadeIn 0.3s ease-in-out',
    color: '#fff',
  },
});

export const DrawnResultName = styled('span', {
  base: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#5865F2',
  },
});

export const ReadySection = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    marginBottom: '12px',
    width: '100%',
    md: {
      padding: '16px 24px',
      marginBottom: '16px',
      maxWidth: '600px',
    },
  },
});

export const ReadyButton = styled('button', {
  base: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    md: {
      padding: '12px 32px',
      fontSize: '18px',
    },
  },
  variants: {
    isReady: {
      true: {
        backgroundColor: '#3BA55C',
        _hover: { backgroundColor: '#2D8049' },
      },
      false: {
        backgroundColor: '#FAA61A',
        _hover: { backgroundColor: '#D99316' },
      },
    },
  },
  defaultVariants: {
    isReady: false,
  },
});

export const StartGameButton = styled('button', {
  base: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#ED4245',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#C73E3A',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      backgroundColor: '#3F4147',
    },
    md: {
      padding: '12px 32px',
      fontSize: '18px',
    },
  },
});

export const ReadyStatus = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
});

export const PlayerReadyBadge = styled('span', {
  base: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    md: {
      padding: '4px 12px',
      fontSize: '14px',
    },
  },
  variants: {
    isReady: {
      true: {
        backgroundColor: '#3BA55C',
        color: 'white',
      },
      false: {
        backgroundColor: '#747F8D',
        color: 'white',
      },
    },
    isOnline: {
      true: {},
      false: {
        opacity: 0.5,
      },
    },
  },
});

export const OnlineIndicator = styled('span', {
  base: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginRight: '6px',
  },
  variants: {
    isOnline: {
      true: {
        backgroundColor: '#3BA55C',
      },
      false: {
        backgroundColor: '#747F8D',
      },
    },
  },
});

// 게임 종료 모달
export const ModalOverlay = styled('div', {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});

export const ModalContent = styled('div', {
  base: {
    backgroundColor: '#2B2D31',
    borderRadius: '16px',
    padding: '24px 16px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    md: {
      padding: '32px',
      maxWidth: '500px',
    },
  },
});

export const ModalTitle = styled('h2', {
  base: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '12px',
    md: {
      fontSize: '28px',
      marginBottom: '16px',
    },
  },
});

export const WinnerName = styled('p', {
  base: {
    fontSize: '16px',
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: '16px',
    md: {
      fontSize: '24px',
      marginBottom: '24px',
    },
  },
});

export const RankingList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
});

export const RankingItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: '#3F4147',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    md: {
      padding: '12px 16px',
      fontSize: '16px',
    },
  },
  variants: {
    rank: {
      1: {
        backgroundColor: '#FFD700',
        color: '#1E1F22',
        fontWeight: 'bold',
      },
      2: {
        backgroundColor: '#C0C0C0',
        color: '#1E1F22',
        fontWeight: 'bold',
      },
      3: {
        backgroundColor: '#CD7F32',
        color: '#1E1F22',
        fontWeight: 'bold',
      },
    },
  },
});

export const CloseButton = styled('button', {
  base: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#5865F2',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    _hover: {
      backgroundColor: '#4752C4',
    },
    md: {
      padding: '12px 32px',
      fontSize: '16px',
    },
  },
});

// 카운트다운 오버레이
export const CountdownOverlay = styled('div', {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});

export const CountdownNumber = styled('div', {
  base: {
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#FFD700',
    md: {
      fontSize: '180px',
    },
  },
});

export const CountdownText = styled('p', {
  base: {
    fontSize: '20px',
    color: 'white',
    marginTop: '16px',
    md: {
      fontSize: '28px',
    },
  },
});

// 내 순위 표시
export const MyRankDisplay = styled('div', {
  base: {
    marginTop: '16px',
    padding: '12px 20px',
    backgroundColor: '#5865F2',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    md: {
      fontSize: '18px',
      padding: '16px 24px',
    },
  },
});

// 뽑은 이름 목록
export const DrawnNamesSection = styled('div', {
  base: {
    width: '100%',
    maxWidth: '400px',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#2B2D31',
    borderRadius: '12px',
    md: {
      maxWidth: '600px',
      padding: '16px',
    },
  },
});

export const DrawnNamesTitle = styled('h3', {
  base: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#B5BAC1',
    marginBottom: '8px',
    textAlign: 'center',
    md: {
      fontSize: '16px',
      marginBottom: '12px',
    },
  },
});

export const DrawnNamesList = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    justifyContent: 'center',
    maxHeight: '120px',
    overflowY: 'auto',
    md: {
      gap: '8px',
      maxHeight: '150px',
    },
  },
});

export const DrawnNameTag = styled('span', {
  base: {
    padding: '4px 8px',
    fontSize: '12px',
    backgroundColor: '#3F4147',
    color: '#B5BAC1',
    borderRadius: '4px',
    md: {
      padding: '6px 10px',
      fontSize: '13px',
    },
  },
  variants: {
    isLatest: {
      true: {
        backgroundColor: '#5865F2',
        color: 'white',
        fontWeight: 'bold',
      },
    },
  },
});

// 이름 뽑기 모달
export const DrawModalContent = styled('div', {
  base: {
    backgroundColor: '#2B2D31',
    borderRadius: '16px',
    padding: '24px 16px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    md: {
      padding: '32px',
      maxWidth: '500px',
    },
  },
});

export const DrawModalTitle = styled('h2', {
  base: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    md: {
      fontSize: '24px',
    },
  },
});

export const DrawModalButtons = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    md: {
      gap: '16px',
    },
  },
});

export const RandomDrawButton = styled('button', {
  base: {
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#5865F2',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#4752C4',
      transform: 'scale(1.02)',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    },
    md: {
      padding: '20px 32px',
      fontSize: '20px',
    },
  },
});

export const CancelDrawButton = styled('button', {
  base: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#B5BAC1',
    backgroundColor: 'transparent',
    border: '1px solid #3F4147',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#3F4147',
    },
    md: {
      padding: '14px 28px',
      fontSize: '16px',
    },
  },
});

export const SelectDrawButton = styled('button', {
  base: {
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#3BA55C',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#2D8049',
      transform: 'scale(1.02)',
    },
    md: {
      padding: '20px 32px',
      fontSize: '20px',
    },
  },
});

// 이름 선택 그리드
export const NameSelectGrid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
    width: '100%',
    padding: '8px',
    md: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      maxHeight: '400px',
    },
  },
});

export const NameSelectItem = styled('button', {
  base: {
    padding: '8px 4px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#3F4147',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    wordBreak: 'keep-all',
    _hover: {
      backgroundColor: '#5865F2',
      borderColor: '#5865F2',
    },
    md: {
      padding: '10px 8px',
      fontSize: '13px',
    },
  },
  variants: {
    isInMyBoard: {
      true: {
        backgroundColor: '#3d3520',
        borderColor: '#FFD700',
        color: '#FFD700',
        _hover: {
          backgroundColor: '#4d4530',
          borderColor: '#FFD700',
        },
      },
    },
  },
});

// 게임 시작 동의 모달
export const StartRequestModal = styled('div', {
  base: {
    backgroundColor: '#2B2D31',
    borderRadius: '16px',
    padding: '24px 16px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    md: {
      padding: '32px',
      maxWidth: '450px',
    },
  },
});

export const StartRequestTitle = styled('h3', {
  base: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    md: {
      fontSize: '22px',
    },
  },
});

export const StartRequestInfo = styled('p', {
  base: {
    fontSize: '14px',
    color: '#B5BAC1',
    margin: 0,
    md: {
      fontSize: '16px',
    },
  },
});

export const AgreedUsersList = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    padding: '12px',
    backgroundColor: '#1E1F22',
    borderRadius: '8px',
    width: '100%',
  },
});

export const AgreedUserBadge = styled('span', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  variants: {
    agreed: {
      true: {
        backgroundColor: '#3BA55C',
        color: 'white',
      },
      false: {
        backgroundColor: '#3F4147',
        color: '#B5BAC1',
      },
    },
  },
});

export const AgreeButton = styled('button', {
  base: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#3BA55C',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: '#2D8049',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    md: {
      padding: '14px 40px',
      fontSize: '18px',
    },
  },
});

export const CancelRequestButton = styled('button', {
  base: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ED4245',
    backgroundColor: 'transparent',
    border: '1px solid #ED4245',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: 'rgba(237, 66, 69, 0.1)',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
    },
  },
});

export const RequestStartButton = styled('button', {
  base: {
    padding: '10px 24px',
    fontSize: '14px',
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
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    md: {
      padding: '12px 32px',
      fontSize: '18px',
    },
  },
});
