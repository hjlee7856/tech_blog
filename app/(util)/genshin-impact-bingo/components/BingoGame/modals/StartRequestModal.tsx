'use client';

import Image from 'next/image';
import { getProfileImagePath } from '../../../lib/auth';
import type { Player } from '../../../lib/game';
import {
  AgreeButton,
  AgreedUserBadge,
  AgreedUsersList,
  CancelRequestButton,
  ModalOverlay,
  StartRequestInfo,
  StartRequestModal as StartRequestModalStyled,
  StartRequestTitle,
} from '../BingoGame.styles';

interface StartRequestModalProps {
  isOpen: boolean;
  requesterName: string;
  readyOnlinePlayers: Player[];
  agreedUsers: number[];
  hasAgreed: boolean;
  isRequester: boolean;
  remainingTime: number | null;
  onAgree: () => void;
  onCancel: () => void;
}

export function StartRequestModal({
  isOpen,
  requesterName,
  readyOnlinePlayers,
  agreedUsers,
  hasAgreed,
  isRequester,
  remainingTime,
  onAgree,
  onCancel,
}: StartRequestModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <StartRequestModalStyled>
        <StartRequestTitle>게임 시작 요청</StartRequestTitle>
        <StartRequestInfo>
          {requesterName}님이 게임 시작을 요청했습니다.
        </StartRequestInfo>
        <StartRequestInfo>
          모든 준비된 플레이어가 동의하면 게임이 시작됩니다.
        </StartRequestInfo>

        <AgreedUsersList>
          {readyOnlinePlayers.map((player) => (
            <AgreedUserBadge
              key={player.id}
              agreed={agreedUsers.includes(player.id)}
            >
              <Image
                src={getProfileImagePath(player.profile_image || 'Nahida')}
                alt={player.name}
                width={20}
                height={20}
                style={{ borderRadius: '50%' }}
              />
              {player.name}
              {agreedUsers.includes(player.id) ? ' ✓' : ''}
            </AgreedUserBadge>
          ))}
        </AgreedUsersList>

        <StartRequestInfo>
          {agreedUsers.length} / {readyOnlinePlayers.length}명 동의
        </StartRequestInfo>

        {remainingTime !== null && (
          <StartRequestInfo
            style={{ color: remainingTime <= 10 ? '#ED4245' : '#FAA61A' }}
          >
            남은 시간: {remainingTime}초
          </StartRequestInfo>
        )}

        {!hasAgreed && !isRequester && (
          <AgreeButton onClick={onAgree}>동의하기</AgreeButton>
        )}

        {hasAgreed && !isRequester && (
          <StartRequestInfo style={{ color: '#3BA55C' }}>
            동의 완료! 다른 플레이어를 기다리는 중...
          </StartRequestInfo>
        )}

        {isRequester && (
          <CancelRequestButton onClick={onCancel}>
            요청 취소
          </CancelRequestButton>
        )}
      </StartRequestModalStyled>
    </ModalOverlay>
  );
}
