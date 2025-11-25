'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Backdrop,
  CharacterButton,
  CharacterImage,
  CharacterName,
  ClearCellButton,
  CloseButton,
  EmptyMessage,
  Header,
  ListContainer,
  Modal,
  SearchInput,
  Title,
} from './CharacterSelectModal.styles';

interface CharacterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableNames: string[];
  currentName: string | null;
  onSelect: (name: string) => void;
  onClear: () => void;
  nameMap: Map<string, string>;
}

export function CharacterSelectModal({
  isOpen,
  onClose,
  availableNames,
  currentName,
  onSelect,
  onClear,
  nameMap,
}: CharacterSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getImagePath = (koreanName: string) => {
    const englishName = nameMap.get(koreanName);
    if (!englishName) return '/genshin-impact/Aino_Avatar.webp';
    const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
    return `/genshin-impact/${safeName}_Avatar.webp`;
  };

  if (!isOpen) return null;

  const filteredNames = availableNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSearchTerm('');
    }
  };

  const handleSelect = (name: string) => {
    onSelect(name);
    setSearchTerm('');
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <Modal>
        <Header>
          <Title>캐릭터 선택</Title>
          <CloseButton
            onClick={() => {
              onClose();
              setSearchTerm('');
            }}
          >
            ✕
          </CloseButton>
        </Header>

        <SearchInput
          type="text"
          placeholder="캐릭터 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        {currentName && (
          <ClearCellButton onClick={onClear}>
            현재 선택 해제: {currentName}
          </ClearCellButton>
        )}

        <ListContainer>
          {filteredNames.length === 0 ? (
            <EmptyMessage>선택 가능한 캐릭터가 없습니다</EmptyMessage>
          ) : (
            filteredNames.map((name) => (
              <CharacterButton key={name} onClick={() => handleSelect(name)}>
                <CharacterImage>
                  <Image
                    src={getImagePath(name)}
                    alt={name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover' }}
                  />
                </CharacterImage>
                <CharacterName>{name}</CharacterName>
              </CharacterButton>
            ))
          )}
        </ListContainer>
      </Modal>
    </Backdrop>
  );
}
