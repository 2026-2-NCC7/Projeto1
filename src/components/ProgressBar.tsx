import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  color,
  height = 8,
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  // Determine gradient color based on percentage if not provided
  let fillGradient = color;
  if (!fillGradient) {
    if (clamped >= 80) fillGradient = 'linear-gradient(90deg, #10B981, #00E8C6)';
    else if (clamped >= 60) fillGradient = 'linear-gradient(90deg, #0284C7, #38BDF8)';
    else if (clamped >= 40) fillGradient = 'linear-gradient(90deg, #F59E0B, #FBBF24)';
    else fillGradient = 'linear-gradient(90deg, #EF4444, #F87171)';
  }

  return (
    <div style={{ width: '100%', marginBottom: '0.5rem' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
          {label && <span>{label}</span>}
          {showPercent && <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{clamped.toFixed(1)}%</span>}
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            background: fillGradient,
          }}
        />
      </div>
    </div>
  );
};
