const LEAF = (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3e7c53" />
        <stop offset="60%" stopColor="#2d5c3c" />
        <stop offset="100%" stopColor="#1e4028" />
      </linearGradient>
    </defs>
    <path
      d="M32 4 C 50 12, 58 30, 46 52 C 34 60, 18 56, 10 42 C 4 28, 14 12, 32 4 Z"
      fill="url(#lg)"
    />
    <path d="M32 8 C 30 22, 28 40, 22 52" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" fill="none" />
    <path d="M28 20 L 22 24 M28 28 L 20 32 M28 36 L 22 40 M28 44 L 22 48" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />
  </svg>
);

export default function FloatingLeaves({ count = 4 }) {
  const classes = ['leaf-1', 'leaf-2', 'leaf-3', 'leaf-4'];
  return (
    <>
      {classes.slice(0, count).map((c) => (
        <div key={c} className={`floating-leaf ${c}`}>{LEAF}</div>
      ))}
    </>
  );
}
