'use client';

import { useState, useRef, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

interface UploadAreaProps {
  file: File | null;
  setFile: (file: File | null) => void;
  error: string;
  setError: (error: string) => void;
}

export function UploadArea({ file, setFile, error, setError }: UploadAreaProps) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (f: File | null | undefined) => {
      if (!f) return;
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a PDF file.');
        return;
      }
      if (f.size > 25 * 1024 * 1024) {
        setError('File exceeds the 25 MB limit.');
        return;
      }
      setError('');
      setFile(f);
    },
    [setFile, setError]
  );

  if (file) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
        border: '1px solid #cfe0d6', background: '#f3faf5', borderRadius: 14,
      }}>
        <span style={{
          width: 44, height: 44, borderRadius: 11, flex: 'none',
          display: 'grid', placeItems: 'center', background: '#dcf3e4', color: 'var(--green)',
        }}>
          <Icon name="fileText" size={22} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>
            {fmtSize(file.size)} · Ready to analyze
          </div>
        </div>
        <button className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={() => setFile(null)} type="button">
          <Icon name="close" size={15} /> Remove
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `1.6px dashed ${drag ? 'var(--blue)' : '#c5d3ea'}`,
        background: drag ? '#eaf1ff' : '#f7f9fd',
        borderRadius: 14, padding: '36px 20px', textAlign: 'center',
        cursor: 'pointer', transition: '.15s ease',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <span style={{ color: 'var(--blue)', display: 'inline-grid', placeItems: 'center' }}>
        <Icon name="uploadCloud" size={46} stroke={1.7} />
      </span>
      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginTop: 10 }}>
        Drag &amp; drop your PDF file here
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 13.5, margin: '8px 0 14px' }}>or</div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
      >
        Choose File
      </button>
    </div>
  );
}
