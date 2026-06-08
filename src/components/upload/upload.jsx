/* global React, Icon, Brand */
const { useState, useRef, useCallback } = React;

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

function SectionHead({ icon, n, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 4 }}>
      <span style={{ color: "var(--blue)", display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={22} stroke={2} />
      </span>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>
        {n}. {title}
      </h2>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function fmtSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function UploadArea({ file, setFile, error, setError }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handle = useCallback((f) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file."); return;
    }
    if (f.size > 25 * 1024 * 1024) { setError("File exceeds the 25MB limit."); return; }
    setError(""); setFile(f);
  }, [setFile, setError]);

  if (file) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
        border: "1px solid #cfe0d6", background: "#f3faf5", borderRadius: 14,
      }}>
        <span style={{
          width: 44, height: 44, borderRadius: 11, flex: "none", display: "grid",
          placeItems: "center", background: "#dcf3e4", color: "var(--green)",
        }}><Icon name="fileText" size={22} /></span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{fmtSize(file.size)} · Ready to analyze</div>
        </div>
        <button className="btn btn-ghost" style={{ padding: "8px 12px" }} onClick={() => setFile(null)}>
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
        border: `1.6px dashed ${drag ? "var(--blue)" : "#c5d3ea"}`,
        background: drag ? "#eaf1ff" : "#f7f9fd",
        borderRadius: 14, padding: "36px 20px", textAlign: "center",
        cursor: "pointer", transition: ".15s ease",
      }}>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden
        onChange={(e) => handle(e.target.files[0])} />
      <span style={{ color: "var(--blue)", display: "inline-grid", placeItems: "center" }}>
        <Icon name="uploadCloud" size={46} stroke={1.7} />
      </span>
      <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", marginTop: 10 }}>
        Drag &amp; drop your PDF file here
      </div>
      <div style={{ color: "var(--muted)", fontSize: 13.5, margin: "8px 0 14px" }}>or</div>
      <button className="btn btn-primary" type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
        Choose File
      </button>
    </div>
  );
}

function UploadPage() {
  const [form, setForm] = useState({ first: "", last: "", dob: "", ssn: "", address: "", city: "", state: "", zip: "", apiKey: "" });
  const [showKey, setShowKey] = useState(false);
  const [file, setFile] = useState(null);
  const [fileErr, setFileErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const fmtSSN = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 5) return d.slice(0, 3) + "-" + d.slice(3);
    return d.slice(0, 3) + "-" + d.slice(3, 5) + "-" + d.slice(5);
  };

  const valid = form.first && form.last && form.apiKey && file;

  const analyze = () => {
    setTouched(true);
    if (!valid) {
      if (!file) setFileErr("Please upload your credit report PDF.");
      return;
    }
    setLoading(true);
    setTimeout(() => { window.location.href = "Analysis Dashboard.html"; }, 1600);
  };

  const missing = (k) => touched && !form[k];

  return (
    <div className="page-pad">
      <div className="shell">
        {/* top bar */}
        <header className="topbar">
          <Brand />
          <div className="topbar-note">
            <span className="lk"><Icon name="lock" size={14} /></span>
            <span>Your data is never stored.<br />Everything is processed securely in real-time.</span>
          </div>
        </header>

        <div style={{ padding: "clamp(24px,3.5vw,40px) clamp(20px,3vw,40px) 40px" }}>
          {/* intro */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 30 }}>
            <div style={{ maxWidth: 600 }}>
              <h1 style={{ margin: 0, fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
                Upload Your Credit Report
              </h1>
              <p style={{ margin: "12px 0 0", color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.6, maxWidth: 560 }}>
                Enter your information, add your OpenAI API key, and upload your credit report PDF.
                We&rsquo;ll analyze it and give you a detailed summary, action plan, and dispute letters.
              </p>
            </div>
            <div style={{
              background: "var(--blue-tintbg)", border: "1px solid #d9e4ff", borderRadius: 14,
              padding: "16px 18px", maxWidth: 290, color: "var(--ink-2)", fontSize: 13.2, lineHeight: 1.55,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--blue-ink)", fontWeight: 700, marginBottom: 6 }}>
                <Icon name="shield" size={17} /> We respect your privacy.
              </div>
              No data is stored. All analysis is done in real-time and discarded after your session.
            </div>
          </div>

          {/* sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* 1. Personal info */}
            <section className="card" style={{ padding: "22px clamp(18px,2.4vw,28px) 26px" }}>
              <SectionHead icon="user" n="1" title="Personal Information" />
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="grid-4">
                <Field label="First Name">
                  <input className={"input" + (missing("first") ? " err" : "")} placeholder="First Name" value={form.first} onChange={set("first")} />
                </Field>
                <Field label="Last Name">
                  <input className={"input" + (missing("last") ? " err" : "")} placeholder="Last Name" value={form.last} onChange={set("last")} />
                </Field>
                <Field label="Date of Birth">
                  <div className="input-wrap">
                    <input className="input has-icon" placeholder="MM/DD/YYYY" value={form.dob} onChange={set("dob")} />
                    <span className="input-icon"><Icon name="calendar" size={17} /></span>
                  </div>
                </Field>
                <Field label="Social Security Number">
                  <div className="input-wrap">
                    <input className="input has-icon" placeholder="XXX-XX-XXXX" value={form.ssn}
                      onChange={(e) => setForm((s) => ({ ...s, ssn: fmtSSN(e.target.value) }))} />
                    <span className="input-icon"><Icon name="lock" size={16} /></span>
                  </div>
                </Field>
              </div>
              <div style={{ marginTop: 16 }}>
                <Field label="Address">
                  <input className="input" placeholder="Street Address" value={form.address} onChange={set("address")} />
                </Field>
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="grid-3">
                <Field label="City">
                  <input className="input" placeholder="City" value={form.city} onChange={set("city")} />
                </Field>
                <Field label="State">
                  <div className="input-wrap">
                    <select className="input has-icon" value={form.state} onChange={set("state")} style={{ color: form.state ? "var(--ink)" : "#9aa6b6" }}>
                      <option value="">Select State</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="input-icon"><Icon name="chevronDown" size={17} /></span>
                  </div>
                </Field>
                <Field label="Zip Code">
                  <input className="input" placeholder="Zip Code" value={form.zip}
                    onChange={(e) => setForm((s) => ({ ...s, zip: e.target.value.replace(/\D/g, "").slice(0, 5) }))} />
                </Field>
              </div>
            </section>

            {/* 2. API key */}
            <section className="card" style={{ padding: "22px clamp(18px,2.4vw,28px) 26px" }}>
              <SectionHead icon="key" n="2" title="OpenAI API Key" />
              <p style={{ margin: "6px 0 16px", color: "var(--ink-3)", fontSize: 13.5 }}>
                Enter your OpenAI API key. It is used only for this session and never stored.
              </p>
              <div className="input-wrap">
                <input className={"input has-icon" + (missing("apiKey") ? " err" : "")} type={showKey ? "text" : "password"}
                  placeholder="sk-..." value={form.apiKey} onChange={set("apiKey")}
                  style={{ height: 50, letterSpacing: showKey ? "normal" : ".06em" }} />
                <button className="input-icon" onClick={() => setShowKey((v) => !v)} type="button" aria-label="Toggle key visibility">
                  <Icon name={showKey ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--blue)", fontSize: 13.5, fontWeight: 600, textDecoration: "none", marginTop: 14 }}>
                Get your API key from platform.openai.com <Icon name="external" size={14} />
              </a>
            </section>

            {/* 3. Upload */}
            <section className="card" style={{ padding: "22px clamp(18px,2.4vw,28px) 26px" }}>
              <SectionHead icon="file" n="3" title="Upload Credit Report" />
              <p style={{ margin: "6px 0 16px", color: "var(--ink-3)", fontSize: 13.5 }}>
                Upload your credit report PDF file. Make sure the file is clear and complete.
              </p>
              <UploadArea file={file} setFile={setFile} error={fileErr} setError={setFileErr} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-3)", fontSize: 12.8 }}>
                  <Icon name="file" size={14} /> Accepted file type: PDF&nbsp;&nbsp;·&nbsp;&nbsp;Max file size: 25MB
                </div>
                {fileErr && <span style={{ color: "var(--red)", fontSize: 12.8, fontWeight: 600 }}>{fileErr}</span>}
              </div>
            </section>
          </div>

          {/* analyze */}
          <button className="btn btn-primary" onClick={analyze} disabled={loading}
            style={{ width: "100%", height: 58, fontSize: 17, marginTop: 22, borderRadius: 13, opacity: loading ? .85 : 1 }}>
            {loading
              ? <><span className="spin" /> Analyzing your report…</>
              : <><Icon name="sparkle" size={19} fill="currentColor" stroke={0} /> Analyze My Report</>}
          </button>
          {touched && !valid && !loading &&
            <div style={{ textAlign: "center", color: "var(--red)", fontSize: 13, marginTop: 10, fontWeight: 600 }}>
              Please complete your name, API key, and upload a report to continue.
            </div>}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18, color: "var(--ink-3)", fontSize: 12.8 }}>
            <Icon name="lock" size={14} /> Your information is secure and never stored. We value your privacy.
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<UploadPage />);
