// components/Tooltip.tsx
import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  tooltipText: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, tooltipText }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
      >
        {text}
      </span>
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            backgroundColor: '#333',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
