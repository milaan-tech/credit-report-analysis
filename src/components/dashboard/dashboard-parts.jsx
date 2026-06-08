/* global React, Icon */
const { useState: useStateP } = React;

/* ============================ MOCK DATA ============================ */
const DATA = {
  completedDate: "May 15, 2025",
  completedTime: "1:24 PM",
  scores: [
    { bureau: "Experian", score: 640, rating: "Fair" },
    { bureau: "Equifax", score: 655, rating: "Fair" },
    { bureau: "TransUnion", score: 648, rating: "Fair" },
  ],
  overall: {
    rating: "Fair",
    health: 64,
    summary: "Your credit shows a mix of positive and negative factors. Several negative items are impacting your scores, but there are strong foundations to build on. Following the action plan below can help improve your credit profile.",
  },
  strengths: [
    "No bankruptcies found",
    "Low credit utilization (18%)",
    "Longest account age is 7 years",
    "8 accounts in good standing",
    "Steady employment history",
  ],
  weaknesses: [
    "2 collection accounts",
    "3 late payments",
    "1 charge-off account",
    "5 recent hard inquiries",
    "High balances on revolving accounts",
  ],
  negatives: [
    {
      priority: "High", name: "ABC Collections", acct: "123456789",
      type: "Collection Account", balance: "$1,250", status: "Collection", reported: "03/2022",
      reasons: ["Balance inconsistency", "Ownership not verified"],
      impact: "High", impactPts: "50–80 pts",
      laws: ["FCRA § 1681i — Right to dispute", "FDCPA § 809 — Debt validation"],
      action: "Send a debt-validation request and dispute the balance discrepancy. Demand proof of ownership and an itemized accounting before the item can remain reported.",
    },
    {
      priority: "High", name: "XYZ Financial", acct: "987654321",
      type: "Charge-Off Account", balance: "$2,450", status: "Charge-Off", reported: "11/2021",
      reasons: ["Balance may be inaccurate", "Payment history issues"],
      impact: "High", impactPts: "40–70 pts",
      laws: ["FCRA § 1681s-2 — Furnisher accuracy", "FCRA § 1681i — Reinvestigation"],
      action: "Dispute the reported balance and inconsistent payment history. Request the original signed agreement and a complete payment ledger from the furnisher.",
    },
    {
      priority: "Medium", name: "Capital One", acct: "555112223",
      type: "Credit Card", balance: "$0", status: "Late Payment", reported: "06/2019",
      reasons: ["Late payment reported", "Date accuracy"],
      impact: "Medium", impactPts: "10–30 pts",
      laws: ["FCRA § 1681i — Reinvestigation", "FCRA § 1681c — Obsolete information"],
      action: "Challenge the accuracy of the reported date and request a goodwill adjustment, as the account is otherwise in good standing.",
    },
    {
      priority: "Low", name: "Wells Fargo", acct: "444998887",
      type: "Credit Card", balance: "$0", status: "Late Payment", reported: "04/2018",
      reasons: ["Single late payment", "Older than 7 years"],
      impact: "Low", impactPts: "5–15 pts",
      laws: ["FCRA § 1681c — 7-year reporting limit"],
      action: "Request removal — the item approaches the 7-year reporting limit and reflects an isolated incident on an otherwise positive account.",
    },
  ],
  actionPlan: [
    { title: "Dispute ABC Collections", desc: "High impact collection account with potential verification issues.", impact: "High" },
    { title: "Dispute XYZ Financial Charge-Off", desc: "High impact charge-off with balance concerns.", impact: "High" },
    { title: "Remove Incorrect Late Payments", desc: "Dispute late payments that may be inaccurate or outdated.", impact: "Medium" },
    { title: "Challenge Recent Inquiries", desc: "Review and dispute any unauthorized hard inquiries.", impact: "Low" },
    { title: "Lower Credit Utilization", desc: "Continue keeping credit card balances low.", impact: "Positive" },
  ],
  summary: {
    text: "Your credit profile has several areas of opportunity. By addressing the negative items above and following the action plan, you can see meaningful improvement in your scores.",
    stats: [
      { icon: "layers", label: "Total Accounts Analyzed", value: "28" },
      { icon: "alert", label: "Negative Items Found", value: "4" },
      { icon: "calendar", label: "Total Late Payments", value: "3" },
      { icon: "hash", label: "Hard Inquiries (Last 2 Years)", value: "5" },
      { icon: "percent", label: "Credit Utilization", value: "18%" },
    ],
    improvement: "50–120",
  },
};

const BUREAUS = [
  { key: "experian", name: "Experian", color: "#2f6df0", abbr: "E", addr: "P.O. Box 4500\nAllen, TX 75013" },
  { key: "equifax", name: "Equifax", color: "#c0202e", abbr: "E", addr: "P.O. Box 740256\nAtlanta, GA 30374" },
  { key: "transunion", name: "TransUnion", color: "#1c9aa8", abbr: "tu", addr: "P.O. Box 2000\nChester, PA 19016" },
];

function buildLetter(b) {
  const items = DATA.negatives.map((n, i) =>
    `${i + 1}. ${n.name} — Account #${n.acct}\n   Type: ${n.type}   |   Reported Status: ${n.status} (${n.reported})\n   Reason for dispute: ${n.reasons.join("; ")}.`
  ).join("\n\n");
  return `${DATA.completedDate}

[Your Full Name]
[Street Address]
[City, State ZIP]

${b.name}
${b.addr.replace("\n", "\n")}

RE: Formal Dispute of Inaccurate Credit Information

To Whom It May Concern:

I am writing to formally dispute the following items appearing on my ${b.name} credit report. Under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681, I am entitled to a credit file that is accurate, complete, and verifiable. After reviewing my report, I have identified the following inaccuracies:

${items}

I respectfully request that you conduct a reasonable reinvestigation of each item above as required under FCRA § 1681i. If any item cannot be fully verified with the original furnisher, it must be promptly deleted or corrected, and an updated copy of my credit report must be provided to me.

Please complete this reinvestigation within 30 days of receipt of this letter and notify me in writing of the results. Enclosed are copies (not originals) of documents supporting my identity and this dispute.

Sincerely,

[Your Full Name]`;
}

/* ============================ COMPONENTS ============================ */
function Donut({ pct, size = 132 }) {
  const r = (size - 16) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4ebf6" strokeWidth="11" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--blue)" strokeWidth="11"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", lineHeight: 1 }}>
            {pct}<span style={{ fontSize: 15 }}>%</span>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>Credit Health</div>
        </div>
      </div>
    </div>
  );
}

function MiniGauge({ value }) {
  // small semicircle gauge, value 0..1
  const a = Math.PI * (1 - value);
  const x = 18 + 15 * Math.cos(a), y = 18 - 15 * Math.sin(a);
  return (
    <svg width="40" height="24" viewBox="0 0 36 22">
      <path d="M3 18 A15 15 0 0 1 33 18" fill="none" stroke="#e1e8f3" strokeWidth="3.5" strokeLinecap="round" />
      <path d={`M3 18 A15 15 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`} fill="none" stroke="var(--blue)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function ScoreCard({ s }) {
  const v = (s.score - 300) / (850 - 300);
  return (
    <div style={{ flex: 1, textAlign: "center", padding: "6px 8px" }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)" }}>{s.bureau}</div>
      <div style={{ fontSize: 40, fontWeight: 800, color: "var(--blue)", lineHeight: 1.15, letterSpacing: "-.01em" }} className="tnum">{s.score}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 8 }}>{s.rating}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--muted)", fontSize: 11.5 }}>
        <span>300 – 850</span><MiniGauge value={v} />
      </div>
    </div>
  );
}

function NegativeRow({ n, open, onToggle, last }) {
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid var(--border-2)" }}>
      <div className="neg-grid" style={{ alignItems: "start", padding: "16px 22px", cursor: "pointer" }} onClick={onToggle}>
        <div><span className={"badge " + n.priority.toLowerCase()}>{n.priority}</span></div>
        <div>
          <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{n.name}</div>
          <div style={{ color: "var(--ink-3)", fontSize: 12.5, marginTop: 2 }}>Account #: {n.acct}</div>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--blue)", fontSize: 12.5, fontWeight: 600, textDecoration: "none", marginTop: 5 }}>
            View on Report <Icon name="external" size={12} />
          </a>
        </div>
        <div style={{ color: "var(--ink-2)", fontSize: 13.5 }}>{n.type}</div>
        <div style={{ color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600 }} className="tnum">{n.balance}</div>
        <div style={{ color: "var(--ink-2)", fontSize: 13.5 }}>{n.status}<br /><span style={{ color: "var(--ink-3)", fontSize: 12.5 }}>{n.reported}</span></div>
        <div style={{ color: "var(--ink-2)", fontSize: 13 }}>
          {n.reasons.map((r) => (
            <div key={r} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
              <span style={{ color: "var(--muted)" }}>•</span><span>{r}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div className={"impact-" + n.impact.toLowerCase()} style={{ fontWeight: 700, fontSize: 13.5 }}>{n.impact}</div>
            <div style={{ color: "var(--ink-3)", fontSize: 12 }}>Score Impact</div>
            <div style={{ color: "var(--ink-2)", fontSize: 12.5, fontWeight: 600 }}>{n.impactPts}</div>
          </div>
          <span style={{ color: "var(--muted)", transition: ".2s", transform: open ? "rotate(180deg)" : "none", marginTop: 2 }}>
            <Icon name="chevronDown" size={18} />
          </span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 22px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="neg-expand">
          <div style={{ background: "var(--card-soft)", border: "1px solid var(--border-2)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 9 }}>Applicable Laws</div>
            {n.laws.map((l) => (
              <div key={l} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink-2)", marginBottom: 6 }}>
                <span style={{ color: "var(--blue)", marginTop: 1 }}><Icon name="scale" size={14} /></span>{l}
              </div>
            ))}
          </div>
          <div style={{ background: "#f1f7ff", border: "1px solid #dce8fb", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".05em", color: "var(--blue-ink)", textTransform: "uppercase", marginBottom: 9 }}>Recommended Action</div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>{n.action}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function LetterModal({ bureau, onClose }) {
  const [copied, setCopied] = useStateP(false);
  if (!bureau) return null;
  const text = buildLetter(bureau);
  const copy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Dispute Letter — ${bureau.name}.txt`;
    a.click(); URL.revokeObjectURL(a.href);
  };
  const print = () => {
    const w = window.open("", "_blank");
    w.document.write(`<pre style="font:14px/1.6 Georgia,serif;white-space:pre-wrap;padding:48px;max-width:720px;margin:auto">${text.replace(/</g, "&lt;")}</pre>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 250);
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,27,51,.45)", backdropFilter: "blur(3px)", display: "grid", placeItems: "center", padding: 24, zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "min(720px,100%)", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "var(--sh-pop)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BureauMark b={bureau} size={36} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>{bureau.name} Dispute Letter</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>AI-generated · ready to send</div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 9, borderRadius: 9 }} onClick={onClose} aria-label="Close"><Icon name="close" size={17} /></button>
        </div>
        <div style={{ padding: "22px 26px", overflow: "auto", background: "#fbfcfe" }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#1e293b" }}>{text}</pre>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "16px 22px", borderTop: "1px solid var(--border-2)", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={copy}><Icon name={copied ? "check" : "copy"} size={16} />{copied ? "Copied!" : "Copy"}</button>
          <button className="btn btn-outline" onClick={download}><Icon name="download" size={16} />Download</button>
          <button className="btn btn-outline" onClick={print}><Icon name="print" size={16} />Print</button>
        </div>
      </div>
    </div>
  );
}

function BureauMark({ b, size = 44 }) {
  return (
    <span style={{ width: size, height: size, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", background: b.color, color: "#fff", fontWeight: 800, fontSize: size * 0.42, letterSpacing: "-.02em" }}>
      {b.abbr}
    </span>
  );
}

Object.assign(window, { DATA, BUREAUS, Donut, ScoreCard, NegativeRow, LetterModal, BureauMark });
