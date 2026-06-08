import type { Bureau } from '@/types';

interface BureauMarkProps {
  bureau: Bureau;
  size?: number;
}

export function BureauMark({ bureau, size = 44 }: BureauMarkProps) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: bureau.color,
        color: '#fff',
        fontWeight: 800,
        fontSize: size * 0.42,
        letterSpacing: '-.02em',
      }}
    >
      {bureau.abbr}
    </span>
  );
}
