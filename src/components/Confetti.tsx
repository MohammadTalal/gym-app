import { useMemo } from 'react';

const COLORS = ['#33a3ff', '#1c84f5', '#f59e0b', '#ec4899', '#10b981', '#f43f5e', '#a855f7'];

/**
 * Lightweight, dependency-free confetti burst. Renders a fixed number of
 * pieces that fall and spin once, then the parent should unmount it.
 */
export function Confetti({ count = 80 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const left = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 240; // horizontal drift
        const delay = Math.random() * 0.4;
        const duration = 2 + Math.random() * 1.5;
        const size = 6 + Math.random() * 8;
        const color = COLORS[i % COLORS.length];
        const rounded = Math.random() > 0.5;
        return { left, dx, delay, duration, size, color, rounded, id: i };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-5vh] block animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.rounded ? '9999px' : '2px',
            // CSS var consumed by the `confetti` keyframes for drift.
            ['--dx' as string]: `${p.dx}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
