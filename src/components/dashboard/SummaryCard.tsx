import { Icon } from '@/components/ui/Icon';
import type { AnalysisResult } from '@/types';

type Stats = AnalysisResult['stats'];

function statRows(stats: Stats) {
  return [
    { icon: 'layers',   label: 'Total Accounts Analyzed',      value: String(stats.totalAccounts) },
    { icon: 'alert',    label: 'Negative Items Found',          value: String(stats.negativeItemCount) },
    { icon: 'calendar', label: 'Total Late Payments',           value: String(stats.latePayments) },
    { icon: 'hash',     label: 'Hard Inquiries (Last 2 Years)', value: String(stats.hardInquiries) },
    { icon: 'percent',  label: 'Credit Utilization',            value: stats.utilization },
  ];
}

interface SummaryCardProps {
  summary: AnalysisResult['summary'];
  stats: Stats;
}

export function SummaryCard({ summary, stats }: SummaryCardProps) {
  return (
    <section className="card" style={{ padding: 'clamp(18px,2.4vw,26px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}>
          <Icon name="info" size={15} stroke={2.2} />
        </span>
        <h2 className="section-title">Summary</h2>
      </div>

      <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.65 }}>{summary}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {statRows(stats).map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--ink-2)', fontSize: 13.5 }}>
              <span style={{ color: 'var(--muted)' }}><Icon name={s.icon} size={16} /></span>
              {s.label}
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }} className="tnum">{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--blue-tintbg)', border: '1px solid #d0dfff', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--blue)', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
          <Icon name="trending" size={16} /> Estimated Improvement Potential
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.02em', lineHeight: 1.1 }} className="tnum">
          {stats.estimatedImprovement} <span style={{ fontSize: 22 }}>pts</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--blue)', marginTop: 6, fontWeight: 500 }}>
          By completing the action plan and removing negative items.
        </div>
      </div>
    </section>
  );
}
