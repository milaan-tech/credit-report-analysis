import type { AnalysisResult } from '@/types';

function MiniGauge({ value }: { value: number }) {
  const a = Math.PI * (1 - value);
  const x = 18 + 15 * Math.cos(a);
  const y = 18 - 15 * Math.sin(a);
  return (
    <svg width="40" height="24" viewBox="0 0 36 22">
      <path d="M3 18 A15 15 0 0 1 33 18" fill="none" stroke="#e1e8f3" strokeWidth="3.5" strokeLinecap="round" />
      <path d={`M3 18 A15 15 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`} fill="none" stroke="var(--blue)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function ScoreCard({ s }: { s: AnalysisResult['scores'][0] }) {
  const v = s.score !== null ? (s.score - 300) / (850 - 300) : 0;
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '6px 8px' }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{s.bureau}</div>
      <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--blue)', lineHeight: 1.15, letterSpacing: '-.01em' }} className="tnum">
        {s.score ?? 'N/A'}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 8 }}>{s.rating}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--muted)', fontSize: 11.5 }}>
        <span>300 – 850</span>
        <MiniGauge value={v} />
      </div>
    </div>
  );
}

function Donut({ pct, size = 132 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4ebf6" strokeWidth="11" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--blue)" strokeWidth="11"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>
            {pct}<span style={{ fontSize: 15 }}>%</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>Credit Health</div>
        </div>
      </div>
    </div>
  );
}

interface CreditOverviewProps {
  scores: AnalysisResult['scores'];
  overall: AnalysisResult['overall'];
}

export function CreditOverview({ scores, overall }: CreditOverviewProps) {
  return (
    <section className="card" style={{ padding: 'clamp(18px,2.4vw,26px)', marginBottom: 16 }}>
      <h2 className="section-title" style={{ marginBottom: 18 }}>Credit Overview</h2>
      <div style={{ display: 'grid', gap: 0 }} className="overview-grid">
        {scores.map((s, i) => (
          <div key={s.bureau} style={{ borderRight: i < scores.length - 1 ? '1px solid var(--border-2)' : 'none' }}>
            <ScoreCard s={s} />
          </div>
        ))}
        <div style={{ borderLeft: '1px solid var(--border-2)', paddingLeft: 'clamp(16px,2vw,28px)', display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Overall Assessment</span>
              <span className="badge fair">{overall.rating}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{overall.summary}</p>
          </div>
          <Donut pct={overall.health} />
        </div>
      </div>
    </section>
  );
}
