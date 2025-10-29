'use client'

import { HeaderContainer, HeaderContent, SidebarToggleButton, HeaderTitle, HeaderLeft, HeaderRight } from './Header.styles'

interface HeaderProps {
  onToggleSidebar?: () => void
  showToggle?: boolean
}

export function Header({ onToggleSidebar, showToggle = false }: HeaderProps) {
  return (
    <HeaderContainer>
      <HeaderContent>
        <HeaderLeft>
          {showToggle && (
            <SidebarToggleButton onClick={onToggleSidebar}>☰</SidebarToggleButton>
          )}
        </HeaderLeft>
        <HeaderTitle>HJ's Blog</HeaderTitle>
        <HeaderRight />
      </HeaderContent>
    </HeaderContainer>
  )
}
