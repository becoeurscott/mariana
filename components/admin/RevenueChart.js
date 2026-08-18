'use client';
import { motion } from 'framer-motion';

export default function RevenueChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const w = 720; const h = 220; const pad = { l: 40, r: 12, t: 12, b: 30 };
  const chartW = w - pad.l - pad.r; const chartH = h - pad.t - pad.b;
  const barW = chartW / data.length * 0.66;
  const gap  = chartW / data.length * 0.34;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="admin-chart" preserveAspectRatio="none">
      {/* Y grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((r) => {
        const y = pad.t + chartH - chartH * r;
        return (
          <g key={r}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#e6ddc9" strokeWidth="1" />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#5C5446">
              ${(max * r).toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = pad.l + i * (barW + gap) + gap / 2;
        const barHeight = (d.revenue / max) * chartH;
        const y = pad.t + chartH - barHeight;
        return (
          <g key={d.key}>
            <motion.rect
              className="admin-chart__bar"
              initial={{ height: 0, y: pad.t + chartH }}
              animate={{ height: barHeight, y }}
              transition={{ duration: 0.6, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              x={x} width={barW} rx={4} fill="#C88339"
            >
              <title>{`${d.label} — $${d.revenue.toFixed(2)} (${d.count} cmd.)`}</title>
            </motion.rect>
            <text x={x + barW / 2} y={h - pad.b + 14} textAnchor="middle" fontSize="10" fill="#5C5446">
              {d.label.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
