
import React from 'react';

export const COLORS = {
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#128807',
  navy: '#000080',
  dark: '#020617'
};

export const SHAPE_ICONS: Record<string, React.ReactNode> = {
  HEXAGON: (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current">
      <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" />
    </svg>
  ),
  SQUARE: (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current">
      <rect x="10" y="10" width="80" height="80" rx="4" />
    </svg>
  ),
  CIRCLE: (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current">
      <circle cx="50" cy="50" r="40" />
    </svg>
  ),
  TRIANGLE: (
    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current">
      <path d="M50 10 L90 85 L10 85 Z" />
    </svg>
  )
};
