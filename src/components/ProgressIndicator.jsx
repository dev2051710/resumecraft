export default function ProgressIndicator({ value, label = 'Completion' }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-ink">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 64 }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#27272A" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
          style={{ transition: 'stroke-dashoffset .5s' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{value}%</div>
    </div>
  );
}
