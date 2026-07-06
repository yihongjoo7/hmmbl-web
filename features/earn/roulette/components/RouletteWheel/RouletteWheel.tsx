/** [퍼블리셔] 룰렛 휠 애니메이션 */
interface RouletteWheelProps { isSpinning: boolean; segments: { label: string; reward: number; color: string }[]; onSpinEnd?: (index: number) => void; }
export function RouletteWheel({ isSpinning, segments }: RouletteWheelProps) {
  const size = 280; const cx = size / 2; const cy = size / 2; const r = cx - 10;
  const sliceAngle = 360 / segments.length;
  return (
    <div className={`transition-transform ${isSpinning ? 'animate-spin' : ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
          const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
          const x1 = cx + r * Math.cos(startAngle); const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);   const y2 = cy + r * Math.sin(endAngle);
          return (
            <g key={i}>
              <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={seg.color} stroke="white" strokeWidth={2} />
              <text x={cx + (r * 0.6) * Math.cos((startAngle + endAngle) / 2)} y={cy + (r * 0.6) * Math.sin((startAngle + endAngle) / 2)}
                textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={11} fontWeight="bold">{seg.label}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={12} fill="white" stroke="#93c5fd" strokeWidth={2} />
      </svg>
    </div>
  );
}
