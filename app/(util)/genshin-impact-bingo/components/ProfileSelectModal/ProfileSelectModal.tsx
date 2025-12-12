'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Backdrop,
  CharacterButton,
  CharacterImage,
  CharacterName,
  CloseButton,
  Description,
  Header,
  ListContainer,
  Modal,
  SearchInput,
  Title,
} from './ProfileSelectModal.styles';

interface ProfileSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterNames: string[];
  characterEnNames: string[];
  currentProfile: string;
  onSelect: (englishName: string) => void;
}

export function ProfileSelectModal({
  isOpen,
  onClose,
  characterNames,
  characterEnNames,
  currentProfile,
  onSelect,
}: ProfileSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // 한글 이름과 영어 이름 쌍으로 필터링
  const filteredCharacters = characterNames
    .map((kr, i) => ({ kr, en: characterEnNames[i] ?? '' }))
    .filter(({ kr, en }) => kr && en)
    .filter(
      ({ kr, en }) =>
        kr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        en.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSearchTerm('');
    }
  };

  const handleSelect = (englishName: string) => {
    onSelect(englishName);
    setSearchTerm('');
    onClose();
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <Modal>
        <Header>
          <Title>프로필 사진 변경</Title>
          <CloseButton
            onClick={() => {
              onClose();
              setSearchTerm('');
            }}
          >
            ✕
          </CloseButton>
        </Header>

        <Description>프로필 사진을 설정해주세요</Description>

        <SearchInput
          type="text"
          placeholder="캐릭터 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        <ListContainer>
          {filteredCharacters.map(({ kr, en }) => (
            <CharacterButton
              key={en}
              onClick={() => handleSelect(en)}
              isSelected={currentProfile === en}
            >
              <CharacterImage>
                <Image
                  src={`/genshin-impact/${en.replaceAll(' ', '_').replaceAll('%20', '_')}_Avatar.webp`}
                  alt={kr}
                  width={48}
                  height={48}
                  style={{ objectFit: 'cover' }}
                />
              </CharacterImage>
              <CharacterName>{kr}</CharacterName>
            </CharacterButton>
          ))}
        </ListContainer>
      </Modal>
    </Backdrop>
  );
}
