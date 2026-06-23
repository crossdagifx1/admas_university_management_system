import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = true, onClick, style }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card ${hoverEffect ? '' : 'hover:transform-none'} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Subtle border glow reflection */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

export default GlassCard;
