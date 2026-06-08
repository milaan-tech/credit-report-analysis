'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  touched: boolean;
}

export function ApiKeyInput({ value, onChange, touched }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);
  const missing = touched && !value;

  return (
    <section className="card" style={{ padding: 'clamp(18px,2.4vw,28px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 4 }}>
        <span style={{ color: 'var(--blue)', display: 'grid', placeItems: 'center' }}>
          <Icon name="key" size={22} stroke={2} />
        </span>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
          2. OpenAI API Key
        </h2>
      </div>
      <p style={{ margin: '6px 0 16px', color: 'var(--ink-3)', fontSize: 13.5 }}>
        Enter your OpenAI API key. It is used only for this session and never stored.
      </p>
      <div className="input-wrap">
        <input
          className={'input has-icon' + (missing ? ' err' : '')}
          type={showKey ? 'text' : 'password'}
          placeholder="sk-..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ height: 50, letterSpacing: showKey ? 'normal' : '.06em' }}
        />
        <button className="input-icon" onClick={() => setShowKey((v) => !v)} type="button" aria-label="Toggle key visibility">
          <Icon name={showKey ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </div>
      <a
        href="https://platform.openai.com/api-keys"
        target="_blank"
        rel="noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--blue)', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', marginTop: 14 }}
      >
        Get your API key from platform.openai.com <Icon name="external" size={14} />
      </a>
    </section>
  );
}
