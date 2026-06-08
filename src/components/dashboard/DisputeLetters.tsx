'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { BureauMark } from '@/components/ui/BureauMark';
import { BUREAUS } from '@/lib/bureaus';
import type { AnalysisResult } from '@/types';

interface LetterModalProps {
  bureauKey: string;
  body: string;
  onClose: () => void;
}

function LetterModal({ bureauKey, body, onClose }: LetterModalProps) {
  const [copied, setCopied] = useState(false);
  const bureau = BUREAUS.find((b) => b.key === bureauKey);
  if (!bureau) return null;

  const copy = () => {
    navigator.clipboard?.writeText(body).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    const blob = new Blob([body], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Dispute Letter — ${bureau.name}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const print = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(
      `<pre style="font:14px/1.6 Georgia,serif;white-space:pre-wrap;padding:48px;max-width:720px;margin:auto">${body.replace(/</g, '&lt;')}</pre>`
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,27,51,.45)', backdropFilter: 'blur(3px)', display: 'grid', placeItems: 'center', padding: 24, zIndex: 50 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, width: 'min(720px,100%)', maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--sh-pop)', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BureauMark bureau={bureau} size={36} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--ink)' }}>{bureau.name} Dispute Letter</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>AI-generated · ready to send</div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 9, borderRadius: 9 }} onClick={onClose} aria-label="Close">
            <Icon name="close" size={17} />
          </button>
        </div>

        <div style={{ padding: '22px 26px', overflow: 'auto', background: '#fbfcfe' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, lineHeight: 1.7, color: '#1e293b' }}>
            {body}
          </pre>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '16px 22px', borderTop: '1px solid var(--border-2)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={copy}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className="btn btn-outline" onClick={download}>
            <Icon name="download" size={16} /> Download
          </button>
          <button className="btn btn-outline" onClick={print}>
            <Icon name="print" size={16} /> Print
          </button>
        </div>
      </div>
    </div>
  );
}

interface DisputeLettersProps {
  letters: AnalysisResult['disputeLetters'];
}

export function DisputeLetters({ letters }: DisputeLettersProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const letterMap = Object.fromEntries(letters.map((l) => [l.bureau.toLowerCase(), l.body]));
  const activeBody = openKey ? (letterMap[openKey] ?? null) : null;

  return (
    <>
      <section className="card" style={{ padding: 'clamp(18px,2.4vw,26px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 22 }}>
          <span style={{ color: 'var(--blue)', flex: 'none', marginTop: 1 }}>
            <Icon name="fileText" size={22} />
          </span>
          <div>
            <h2 className="section-title">Dispute Letters</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--ink-3)' }}>
              AI-generated dispute letters customized for each credit bureau.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="letters-grid">
          {BUREAUS.map((b) => (
            <div key={b.key} style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 10 }}>
                <BureauMark bureau={b} size={44} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{b.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--green)', fontWeight: 600 }}>
                    <Icon name="checkCircle" size={14} /> Dispute letter ready to send
                  </div>
                </div>
              </div>
              <button
                className="btn btn-outline"
                style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}
                onClick={() => setOpenKey(b.key)}
              >
                View Letter
              </button>
            </div>
          ))}
        </div>
      </section>

      {openKey && activeBody && (
        <LetterModal bureauKey={openKey} body={activeBody} onClose={() => setOpenKey(null)} />
      )}
    </>
  );
}
