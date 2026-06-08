/* global React, Icon, Brand, DATA, BUREAUS, Donut, ScoreCard, NegativeRow, LetterModal, BureauMark */
const { useState } = React;

const impactColor = { High: "#dc2626", Medium: "#b45309", Low: "#16a34a", Positive: "#2563eb" };
const impactBg    = { High: "#fde8e8", Medium: "#fdf0d5", Low: "#dcfce7", Positive: "#eef3ff" };

/* ---- helpers ---- */
function CardSection({ title, icon, children, style = {} }) {
  return (
    <section className="card" style={{ padding: "22px clamp(18px,2.4vw,26px) 24px", ...style }}>
      {(title || icon) && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          {icon && <span style={{ color: "var(--blue)" }}><Icon name={icon} size={20} /></span>}
          {title && <h2 className="section-title">{title}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}

function ActionBadge({ impact }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 11px", borderRadius: 999,
      background: impactBg[impact], color: impactColor[impact],
      fontSize: 12, fontWeight: 700,
    }}>Impact: {impact}</span>
  );
}

/* ---- Dashboard ---- */
function Dashboard() {
  const [openRow, setOpenRow] = useState(null);
  const [letter, setLetter] = useState(null);

  const d = DATA;

  return (
    <div className="page-pad">
      <div className="shell">

        {/* top bar */}
        <header className="topbar">
          <Brand />
          <a href="Upload Page.html" className="btn btn-ghost" style={{ fontSize: 14 }}>
            <Icon name="refresh" size={15} /> New Analysis
          </a>
        </header>

        <div style={{ padding: "clamp(22px,3vw,36px) clamp(18px,3vw,38px) 44px" }}>

          {/* page heading */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,34px)", fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)" }}>
                Analysis Summary
              </h1>
              <p style={{ margin: "7px 0 0", color: "var(--ink-3)", fontSize: 14.5 }}>
                Review your credit report analysis and recommended actions.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "8px 14px" }}>
              <span style={{ color: "var(--green)", display: "grid", placeItems: "center" }}><Icon name="checkCircle" size={17} /></span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--green)" }}>Analysis completed</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{d.completedDate} &bull; {d.completedTime}</div>
              </div>
            </div>
          </div>

          {/* ── Section 1: Credit Overview ── */}
          <CardSection style={{ marginBottom: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 18 }}>Credit Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.7fr", gap: 0 }} className="overview-grid">
              {d.scores.map((s, i) => (
                <div key={s.bureau} style={{
                  borderRight: i < 2 ? "1px solid var(--border-2)" : "none",
                  paddingRight: i < 2 ? 0 : 0,
                }}>
                  <ScoreCard s={s} />
                </div>
              ))}
              <div style={{ borderLeft: "1px solid var(--border-2)", paddingLeft: "clamp(16px,2vw,28px)", display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>Overall Assessment</span>
                    <span className="badge fair">{d.overall.rating}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{d.overall.summary}</p>
                </div>
                <Donut pct={d.overall.health} />
              </div>
            </div>
          </CardSection>

          {/* ── Section 2+3: Strengths & Weaknesses ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="sw-grid">
            <CardSection style={{ borderTop: "3px solid var(--green)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <span style={{ color: "var(--green)" }}><Icon name="checkCircle" size={22} stroke={2} /></span>
                <h2 className="section-title">Strengths</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.strengths.map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--ink-2)" }}>
                    <span style={{ color: "var(--green)", marginTop: 1, flex: "none" }}><Icon name="checkCircle" size={17} /></span>
                    {s}
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 18, background: "none", border: "none", padding: 0, color: "var(--green)", fontSize: 13.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                View full details <Icon name="arrowRight" size={15} />
              </button>
            </CardSection>

            <CardSection style={{ borderTop: "3px solid var(--red)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <span style={{ color: "var(--red)" }}><Icon name="alert" size={22} stroke={2} /></span>
                <h2 className="section-title">Weaknesses</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.weaknesses.map((w) => (
                  <div key={w} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--ink-2)" }}>
                    <span style={{ color: "var(--red)", marginTop: 1, flex: "none" }}><Icon name="xCircle" size={17} /></span>
                    {w}
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 18, background: "none", border: "none", padding: 0, color: "var(--red)", fontSize: 13.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                View full details <Icon name="arrowRight" size={15} />
              </button>
            </CardSection>
          </div>

          {/* ── Section 4: Negative Items ── */}
          <CardSection style={{ marginBottom: 16, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "20px 22px 12px", borderBottom: "1px solid var(--border-2)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h2 className="section-title">Negative Items</h2>
                    <span style={{ background: "var(--red-bg)", color: "var(--red)", borderRadius: 999, padding: "2px 10px", fontSize: 12.5, fontWeight: 700 }}>{d.negatives.length}</span>
                    <span style={{ color: "var(--muted)" }}><Icon name="info" size={16} /></span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>These items are negatively impacting your credit scores.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
                  Sort by: <span style={{ fontWeight: 600 }}>Priority</span>
                  <span style={{ color: "var(--muted)" }}><Icon name="chevronDown" size={16} /></span>
                </div>
              </div>
            </div>
            {/* column headers */}
            <div className="neg-grid" style={{ padding: "10px 22px", background: "#f8fafd", borderBottom: "1px solid var(--border-2)" }}>
              {["Priority","Account Details","Type","Balance","Status / Reported","Reason Flagged","Impact"].map(col => (
                <div key={col} style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-3)", textTransform: "uppercase" }}>{col}</div>
              ))}
            </div>
            {d.negatives.map((n, i) => (
              <NegativeRow key={n.acct} n={n} open={openRow === i}
                onToggle={() => setOpenRow(openRow === i ? null : i)}
                last={i === d.negatives.length - 1} />
            ))}
            <div style={{ padding: "12px 22px 16px" }}>
              <button style={{ background: "none", border: "none", padding: 0, color: "var(--blue)", fontSize: 13.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                View all items on credit report <Icon name="arrowRight" size={15} />
              </button>
            </div>
          </CardSection>

          {/* ── Section 5+6: Action Plan + Summary ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }} className="ap-grid">
            <CardSection>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ color: "var(--ink-3)" }}><Icon name="fileText" size={20} /></span>
                <h2 className="section-title">Action Plan</h2>
              </div>
              <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-3)" }}>Follow this prioritized plan to improve your credit.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {d.actionPlan.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 14px", background: "var(--card-soft)", borderRadius: 12, border: "1px solid var(--border-2)" }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: "50%", flex: "none",
                      display: "grid", placeItems: "center", fontSize: 13.5, fontWeight: 800, color: "#fff",
                      background: impactColor[a.impact],
                    }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{a.title}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>{a.desc}</div>
                    </div>
                    <ActionBadge impact={a.impact} />
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 18, background: "none", border: "none", padding: 0, color: "var(--blue)", fontSize: 13.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                View detailed action plan guide <Icon name="arrowRight" size={15} />
              </button>
            </CardSection>

            {/* summary */}
            <CardSection>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center", flex: "none" }}>
                  <Icon name="info" size={15} stroke={2.2} />
                </span>
                <h2 className="section-title">Summary</h2>
              </div>
              <p style={{ margin: "0 0 18px", fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.65 }}>{d.summary.text}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {d.summary.stats.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border-2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--ink-2)", fontSize: 13.5 }}>
                      <span style={{ color: "var(--muted)" }}><Icon name={s.icon} size={16} /></span>
                      {s.label}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }} className="tnum">{s.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--blue-tintbg)", border: "1px solid #d0dfff", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--blue)", fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                  <Icon name="trending" size={16} /> Estimated Improvement Potential
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.02em", lineHeight: 1.1 }} className="tnum">
                  {d.summary.improvement} <span style={{ fontSize: 22 }}>pts</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--blue)", marginTop: 6, fontWeight: 500 }}>
                  By completing the action plan and removing negative items.
                </div>
              </div>
            </CardSection>
          </div>

          {/* ── Section 7: Dispute Letters ── */}
          <CardSection>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 22 }}>
              <span style={{ color: "var(--blue)", flex: "none", marginTop: 1 }}><Icon name="fileText" size={22} /></span>
              <div>
                <h2 className="section-title">Dispute Letters</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--ink-3)" }}>AI-generated dispute letters customized for each credit bureau.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="letters-grid">
              {BUREAUS.map((b) => (
                <div key={b.key} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: "20px 20px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 10 }}>
                    <BureauMark b={b} size={44} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{b.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--green)", fontWeight: 600 }}>
                        <Icon name="checkCircle" size={14} /> Dispute letter ready to send
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-outline" style={{ width: "100%", marginTop: 10, justifyContent: "center" }} onClick={() => setLetter(b)}>
                    View Letter
                  </button>
                </div>
              ))}
            </div>
          </CardSection>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28, color: "var(--muted)", fontSize: 12.8 }}>
            <Icon name="lock" size={14} /> Your data is never stored. Everything is processed in real-time and discarded after your session.
          </div>

        </div>
      </div>

      {letter && <LetterModal bureau={letter} onClose={() => setLetter(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
