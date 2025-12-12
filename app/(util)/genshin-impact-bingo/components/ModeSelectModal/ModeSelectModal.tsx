'use client';

import {
  Backdrop,
  ButtonRow,
  Description,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Title,
} from './ModeSelectModal.styles';

interface ModeSelectModalProps {
  isOpen: boolean;
  onSelectGame: () => void;
  onSelectSpectator: () => void;
}

export function ModeSelectModal({
  isOpen,
  onSelectGame,
  onSelectSpectator,
}: ModeSelectModalProps) {
  if (!isOpen) return null;

  return (
    <Backdrop>
      <Modal>
        <Title>모드 선택</Title>
        <Description>게임에 참가하거나 관전 모드를 선택해주세요</Description>
        <ButtonRow>
          <PrimaryButton type="button" onClick={onSelectGame}>
            게임 참가
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onSelectSpectator}>
            관전 모드
          </SecondaryButton>
        </ButtonRow>
      </Modal>
    </Backdrop>
  );
}
