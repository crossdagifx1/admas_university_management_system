import React from 'react';

// Renders the high-quality official Admas University logo (circular blue seal).
const AdmasEmblem = ({ size = 64, className = '' }) => {
  return (
    <img
      src="/admas-logo.png"
      alt="Admas University Logo"
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'inline-block',
        verticalAlign: 'middle',
        width: `${size}px`,
        height: `${size}px`,
      }}
      onError={(e) => {
        console.warn('[ATMS] Real logo image failed to load');
      }}
    />
  );
};

export default AdmasEmblem;
