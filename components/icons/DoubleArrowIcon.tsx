import React from 'react'

export interface DoubleArrowIconProps {
  direction: 'left' | 'right'
  size?: number
  color?: string
  className?: string
}

export function DoubleArrowIcon({ direction, size = 24, color = '#868b94', className }: DoubleArrowIconProps) {
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
        <>
          <path
            d="M17.5 19l-7-7 7-7"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.5 19l-7-7 7-7"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M6.5 5l7 7-7 7"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 5l7 7-7 7"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  )
}
