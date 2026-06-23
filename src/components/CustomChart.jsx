import React from 'react';

export const EnrollmentChart = ({ data }) => {
  // SVG size parameters
  const width = 500;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Data processing
  const rawMax = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
  const maxVal = (rawMax || 10) * 1.15;
  const minVal = 0;

  const points = data.map((d, index) => {
    const denom = data.length > 1 ? data.length - 1 : 1;
    const x = paddingLeft + (index / denom) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';
  
  // Create area path under the line for the gradient fill
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
          <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00e5ff" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + ratio * chartHeight;
          const val = Math.round(maxVal - ratio * (maxVal - minVal));
          return (
            <g key={i}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 4} 
                fill="#6b6d7a" 
                fontSize="9" 
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Gradient fill */}
        {areaPath && <path d={areaPath} fill="url(#chartGlow)" />}

        {/* Line */}
        <path 
          d={linePath} 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#shadowGlow)"
        />

        {/* Points & Labels */}
        {points.map((p, i) => (
          <g key={i} className="group">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill="#090a0f" 
              stroke="#00e5ff" 
              strokeWidth="2" 
              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
            />
            {/* Value popups on hover */}
            <g style={{ pointerEvents: 'none' }}>
              <rect
                x={p.x - 22}
                y={p.y - 28}
                width="44"
                height="18"
                rx="4"
                fill="rgba(16, 17, 23, 0.95)"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                className="opacity-0 group-hover:opacity-100"
                style={{ transition: 'opacity 0.2s' }}
              />
              <text
                x={p.x}
                y={p.y - 16}
                fill="#f5f5f5"
                fontSize="8"
                fontWeight="600"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100"
                style={{ transition: 'opacity 0.2s' }}
              >
                {p.value}
              </text>
            </g>
            {/* X Axis Label */}
            <text 
              x={p.x} 
              y={height - 8} 
              fill="#6b6d7a" 
              fontSize="9" 
              textAnchor="middle"
              fontWeight="500"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const DONUT_COLORS = ['#00e5ff', '#14b8a6', '#10b981', '#eab308', '#f43f5e', '#8b5cf6', '#38bdf8'];

export const DonutChart = ({ data, size = 180, thickness = 26 }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const len = (d.value / total) * circumference;
          const seg = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span style={{ color: 'hsl(var(--text-secondary))' }}>{d.label}</span>
            <span style={{ color: 'hsl(var(--text-primary))', fontWeight: '700', marginLeft: 'auto', fontFamily: 'Outfit' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RadarChart = ({ axes, size = 260 }) => {
  // axes: [{ label, value (0-100) }]
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const n = axes.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i, ratio) => ({
    x: cx + r * ratio * Math.cos(angle(i)),
    y: cy + r * ratio * Math.sin(angle(i)),
  });
  const poly = axes.map((a, i) => { const p = point(i, a.value / 100); return `${p.x},${p.y}`; }).join(' ');

  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {[0.25, 0.5, 0.75, 1].map((ring, ri) => (
        <polygon
          key={ri}
          points={axes.map((_, i) => { const p = point(i, ring); return `${p.x},${p.y}`; }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
        />
      ))}
      {axes.map((a, i) => {
        const p = point(i, 1);
        const lp = point(i, 1.16);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" />
            <text x={lp.x} y={lp.y} fill="#a9abb3" fontSize="10" textAnchor="middle" dominantBaseline="middle">{a.label}</text>
          </g>
        );
      })}
      <polygon points={poly} fill="rgba(0,229,255,0.18)" stroke="#00e5ff" strokeWidth="2" />
      {axes.map((a, i) => { const p = point(i, a.value / 100); return <circle key={i} cx={p.x} cy={p.y} r="3" fill="#00e5ff" />; })}
    </svg>
  );
};

export const DistributionChart = ({ data }) => {
  const width = 500;
  const height = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const rawMax = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
  const maxVal = (rawMax || 10) * 1.1;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + ratio * chartHeight;
          const val = Math.round(maxVal - ratio * maxVal);
          return (
            <g key={i}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="rgba(255, 255, 255, 0.05)" 
              />
              <text 
                x={paddingLeft - 10} 
                y={y + 3} 
                fill="#6b6d7a" 
                fontSize="9" 
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, index) => {
          const numBars = data.length;
          const barWidth = (chartWidth / numBars) * 0.55;
          const spacing = chartWidth / numBars;
          const x = paddingLeft + (index * spacing) + (spacing - barWidth) / 2;
          
          const barHeight = (d.value / maxVal) * chartHeight;
          const y = paddingTop + chartHeight - barHeight;

          return (
            <g key={index} className="group">
              {/* Main Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill="url(#barGrad)"
                opacity="0.85"
                style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
              />
              {/* Glowing hover overlay */}
              <rect
                x={x - 2}
                y={y - 2}
                width={barWidth + 4}
                height={barHeight + 2}
                rx="6"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="1.5"
                className="opacity-0 group-hover:opacity-100"
                style={{ pointerEvents: 'none', transition: 'all 0.2s' }}
              />
              {/* Value display */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                fill="#f5f5f5"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100"
                style={{ transition: 'all 0.2s' }}
              >
                {d.value}
              </text>
              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={height - 8}
                fill="#6b6d7a"
                fontSize="9"
                textAnchor="middle"
                fontWeight="500"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
