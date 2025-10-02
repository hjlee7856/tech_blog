import React from 'react'

export interface ArrowIconProps {
  direction: 'left' | 'right'
  size?: number
  color?: string
  className?: string
}

export function ArrowIcon({ direction, size = 24, color = '#868b94', className }: ArrowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: 'inline', verticalAlign: 'middle' }}
    >
      {direction === 'left' ? (
        <path
          d="M15.5 19l-7-7 7-7"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8.5 5l7 7-7 7"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
