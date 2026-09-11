import { useMemo } from 'react';

export default function GaugeCard({ total }) {
  // SVG gauge parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const maxValue = 6; // max tCO2/t on scale
  const clampedTotal = Math.min(total, maxValue);
  const progress = clampedTotal / maxValue;
  const dashOffset = circumference * (1 - progress * 0.75); // 270-degree arc

  // Color based on emission level
  const getColor = (val) => {
    if (val <= 1.5) return { color: '#22C55E', label: 'Excellent', bg: 'bg-accent-green/10' };
    if (val <= 2.5) return { color: '#EAB308', label: 'Good', bg: 'bg-accent-yellow/10' };
    if (val <= 3.5) return { color: '#F59E4C', label: 'Average', bg: 'bg-brand-light/10' };
    return { color: '#EF4444', label: 'High', bg: 'bg-accent-red/10' };
  };

  const rating = getColor(total);

  // Rotation to start from bottom-left of the arc
  const startAngle = 135; // degrees

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 self-start mb-4">
        <div className="w-2 h-6 bg-brand rounded-full" />
        <h3 className="text-sm font-bold text-slate-300">Total Emissions</h3>
      </div>

      <div className="relative w-52 h-44">
        <svg viewBox="0 0 200 170" className="w-full h-full">
          {/* Background arc */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="#334155"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            transform={`rotate(${startAngle} 100 100)`}
          />
          {/* Value arc */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={rating.color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(${startAngle} 100 100)`}
            className="gauge-circle transition-all duration-700 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${rating.color}40)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="text-4xl font-black text-white tracking-tight" style={{ color: rating.color }}>
            {total.toFixed(2)}
          </span>
          <span className="text-sm text-slate-400 font-medium mt-1">t CO₂ / tonne steel</span>
        </div>
      </div>

      {/* Rating badge */}
      <div 
        className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold ${rating.bg}`}
        style={{ color: rating.color }}
      >
        {rating.label}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between w-full mt-3 px-4">
        <span className="text-xs text-accent-green font-medium">0</span>
        <span className="text-xs text-slate-500">3</span>
        <span className="text-xs text-accent-red font-medium">6+</span>
      </div>
    </div>
  );
}
