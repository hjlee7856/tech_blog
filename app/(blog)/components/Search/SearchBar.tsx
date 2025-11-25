import React from 'react'

import { FaSearch } from 'react-icons/fa'
import { Container, InputContainer, Input, Button } from './SearchBar.styles'

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  loading?: boolean
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onKeyDown,
  loading = false,
  placeholder = '제목 / 소개글 검색',
}: SearchBarProps) {
  return (
    <Container>
      <InputContainer>
        <Button
          onClick={onSearch}
          disabled={loading}
          aria-label="검색"
        >
          <FaSearch color="#94a3b8" />
        </Button>
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={loading}
        />
      </InputContainer>
    </Container>
  )
}
