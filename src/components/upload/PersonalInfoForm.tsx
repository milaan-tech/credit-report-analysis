import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { UserInfo } from '@/types';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

function SectionHead({ icon, n, title }: { icon: string; n: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 4 }}>
      <span style={{ color: 'var(--blue)', display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={22} stroke={2} />
      </span>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
        {n}. {title}
      </h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

interface PersonalInfoFormProps {
  form: UserInfo;
  onChange: (key: keyof UserInfo, value: string) => void;
  touched: boolean;
}

export function PersonalInfoForm({ form, onChange, touched }: PersonalInfoFormProps) {
  const missing = (k: keyof UserInfo) => touched && !form[k];

  const fmtSSN = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 5) return d.slice(0, 3) + '-' + d.slice(3);
    return d.slice(0, 3) + '-' + d.slice(3, 5) + '-' + d.slice(5);
  };

  return (
    <section className="card" style={{ padding: 'clamp(18px,2.4vw,28px)' }}>
      <SectionHead icon="user" n="1" title="Personal Information" />
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-4">
        <Field label="First Name">
          <input className={'input' + (missing('first') ? ' err' : '')} placeholder="First Name"
            value={form.first} onChange={(e) => onChange('first', e.target.value)} />
        </Field>
        <Field label="Last Name">
          <input className={'input' + (missing('last') ? ' err' : '')} placeholder="Last Name"
            value={form.last} onChange={(e) => onChange('last', e.target.value)} />
        </Field>
        <Field label="Date of Birth">
          <div className="input-wrap">
            <input className="input has-icon" placeholder="MM/DD/YYYY"
              value={form.dob} onChange={(e) => onChange('dob', e.target.value)} />
            <span className="input-icon"><Icon name="calendar" size={17} /></span>
          </div>
        </Field>
        <Field label="Social Security Number">
          <div className="input-wrap">
            <input className="input has-icon" placeholder="XXX-XX-XXXX"
              value={form.ssn}
              onChange={(e) => onChange('ssn', fmtSSN(e.target.value))} />
            <span className="input-icon"><Icon name="lock" size={16} /></span>
          </div>
        </Field>
      </div>
      <div style={{ marginTop: 16 }}>
        <Field label="Address">
          <input className="input" placeholder="Street Address"
            value={form.address} onChange={(e) => onChange('address', e.target.value)} />
        </Field>
      </div>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }} className="grid-3">
        <Field label="City">
          <input className="input" placeholder="City"
            value={form.city} onChange={(e) => onChange('city', e.target.value)} />
        </Field>
        <Field label="State">
          <div className="input-wrap">
            <select className="input has-icon" value={form.state}
              onChange={(e) => onChange('state', e.target.value)}
              style={{ color: form.state ? 'var(--ink)' : '#9aa6b6' }}>
              <option value="">Select State</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="input-icon"><Icon name="chevronDown" size={17} /></span>
          </div>
        </Field>
        <Field label="Zip Code">
          <input className="input" placeholder="Zip Code"
            value={form.zip}
            onChange={(e) => onChange('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} />
        </Field>
      </div>
    </section>
  );
}
