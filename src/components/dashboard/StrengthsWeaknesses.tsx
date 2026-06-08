import { Icon } from '@/components/ui/Icon';
import type { AnalysisResult } from '@/types';

interface StrengthsWeaknessesProps {
  strengths: AnalysisResult['strengths'];
  weaknesses: AnalysisResult['weaknesses'];
}

export function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="sw-grid">
      <section className="card" style={{ padding: 'clamp(18px,2.4vw,26px)', borderTop: '3px solid var(--green)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
          <span style={{ color: 'var(--green)' }}><Icon name="checkCircle" size={22} stroke={2} /></span>
          <h2 className="section-title">Strengths</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {strengths.map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ink-2)' }}>
              <span style={{ color: 'var(--green)', marginTop: 1, flex: 'none' }}><Icon name="checkCircle" size={17} /></span>
              {s}
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 'clamp(18px,2.4vw,26px)', borderTop: '3px solid var(--red)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
          <span style={{ color: 'var(--red)' }}><Icon name="alert" size={22} stroke={2} /></span>
          <h2 className="section-title">Weaknesses</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weaknesses.map((w) => (
            <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ink-2)' }}>
              <span style={{ color: 'var(--red)', marginTop: 1, flex: 'none' }}><Icon name="xCircle" size={17} /></span>
              {w}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
