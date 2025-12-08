import { styled } from '@/styled-system/jsx';

export const Container = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    md: {
      gap: '20px',
      padding: '20px',
    },
  },
});

export const ButtonContainer = styled('div', {
  base: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    md: {
      gap: '12px',
    },
  },
});

export const Button = styled('button', {
  base: {
    padding: '10px 16px',
    fontSize: '14px',
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
    md: {
      padding: '12px 24px',
      fontSize: '16px',
    },
  },
});

export const ClearButton = styled('button', {
  base: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#ED4245',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    _hover: {
      backgroundColor: '#C73E3A',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
    },
  },
});

export const Board = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '4px',
    maxWidth: '100%',
    width: '100%',
    md: {
      gap: '8px',
      maxWidth: '600px',
    },
  },
});

export const Cell = styled('button', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '8px',
    fontWeight: '500',
    backgroundColor: '#2B2D31',
    color: 'white',
    border: '1px solid #3F4147',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    _hover: {
      backgroundColor: '#3F4147',
      borderColor: '#5865F2',
    },
    md: {
      gap: '8px',
      fontSize: '11px',
      border: '2px solid #3F4147',
      borderRadius: '8px',
      padding: '4px',
    },
  },
});

export const MatchedCell = styled('div', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '8px',
    fontWeight: '600',
    backgroundColor: '#1a4a2a',
    color: '#4ade80',
    border: '2px solid #4ade80',
    borderRadius: '4px',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    boxShadow:
      '0 0 8px #4ade80, 0 0 16px #4ade80, inset 0 0 8px rgba(74, 222, 128, 0.3)',
    md: {
      gap: '8px',
      fontSize: '11px',
      border: '3px solid #4ade80',
      borderRadius: '8px',
      padding: '4px',
      boxShadow:
        '0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 30px #4ade80, inset 0 0 10px rgba(74, 222, 128, 0.3)',
    },
  },
});

export const BingoLineCell = styled('div', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '8px',
    fontWeight: '600',
    backgroundColor: '#3d3520',
    color: '#FFD700',
    border: '2px solid #FFD700',
    borderRadius: '4px',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    boxShadow:
      '0 0 8px #FFD700, 0 0 16px #FFD700, inset 0 0 8px rgba(255, 215, 0, 0.3)',
    md: {
      gap: '8px',
      fontSize: '11px',
      border: '3px solid #FFD700',
      borderRadius: '8px',
      padding: '4px',
      boxShadow:
        '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700, inset 0 0 10px rgba(255, 215, 0, 0.3)',
    },
  },
});

// 모든 셀이 매칭되었을 때 (보라색 네온)
export const AllMatchedCell = styled('div', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '8px',
    fontWeight: '600',
    backgroundColor: '#2d1a3d',
    color: '#a855f7',
    border: '2px solid #a855f7',
    borderRadius: '4px',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    boxShadow:
      '0 0 8px #a855f7, 0 0 16px #a855f7, inset 0 0 8px rgba(168, 85, 247, 0.3)',
    md: {
      gap: '8px',
      fontSize: '11px',
      border: '3px solid #a855f7',
      borderRadius: '8px',
      padding: '4px',
      boxShadow:
        '0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 30px #a855f7, inset 0 0 10px rgba(168, 85, 247, 0.3)',
    },
  },
});

export const CellImage = styled('div', {
  base: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    md: {
      width: '48px',
      height: '48px',
    },
  },
});

export const CellName = styled('span', {
  base: {
    fontSize: '13px',
    lineHeight: '1.1',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'wrap',
    md: {
      fontSize: '15px',
    },
  },
});

// 내 턴에 선택 가능한 셀 (아직 뽑히지 않은 셀)
export const SelectableCell = styled('button', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '8px',
    fontWeight: '500',
    backgroundColor: '#1a2a4a',
    color: '#60a5fa',
    border: '2px solid #5865F2',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    _hover: {
      backgroundColor: '#2a3a5a',
      borderColor: '#818cf8',
      transform: 'scale(1.05)',
    },
    md: {
      gap: '8px',
      fontSize: '11px',
      border: '3px solid #5865F2',
      borderRadius: '8px',
      padding: '4px',
    },
  },
});

// 선택된 셀 (확인 대기 중)
export const SelectedForDrawCell = styled('button', {
  base: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '8px',
    fontWeight: '600',
    backgroundColor: '#3d2a1a',
    color: '#fbbf24',
    border: '3px solid #fbbf24',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '2px',
    textAlign: 'center',
    wordBreak: 'keep-all',
    lineHeight: '1.1',
    overflow: 'hidden',
    boxShadow:
      '0 0 10px #fbbf24, 0 0 20px #fbbf24, inset 0 0 10px rgba(251, 191, 36, 0.3)',
    md: {
      gap: '8px',
      fontSize: '11px',
      border: '4px solid #fbbf24',
      borderRadius: '8px',
      padding: '4px',
    },
  },
});

// 뽑기 확인 모달 오버레이
export const DrawConfirmOverlay = styled('div', {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});

// 뽑기 확인 모달
export const DrawConfirmModal = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    backgroundColor: '#2B2D31',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    md: {
      padding: '32px',
      gap: '24px',
    },
  },
});

export const DrawConfirmText = styled('p', {
  base: {
    fontSize: '14px',
    color: 'white',
    textAlign: 'center',
    margin: 0,
    md: {
      fontSize: '16px',
    },
  },
});

export const DrawConfirmButtons = styled('div', {
  base: {
    display: 'flex',
    gap: '12px',
  },
});

export const ConfirmButton = styled('button', {
  base: {
    padding: '10px 24px',
    fontSize: '14px',
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
      padding: '12px 32px',
      fontSize: '16px',
    },
  },
});

export const CancelButton = styled('button', {
  base: {
    padding: '10px 24px',
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
      padding: '12px 32px',
      fontSize: '16px',
    },
  },
});
