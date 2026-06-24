import React, { useState, useRef } from 'react';
import { api } from './api';

const palette = {
  sand: '#F5F0E8',
  linen: '#EDE8DF',
  fog: '#D6D0C4',
  driftwood: '#A89F8C',
  tide: '#7BA7A7',
  ocean: '#4A7C8A',
  deep: '#2C5364',
  ink: '#1A2E35',
  salt: '#FFFFFF',
  mist: '#F0EDE8',
};

const font = {
  display: "'Cormorant Garamond', 'Georgia', serif",
  body: "'Inter', -apple-system, sans-serif",
};

const s = {
  page: {
    minHeight: '100vh',
    background: palette.sand,
    fontFamily: font.body,
    color: palette.ink,
  },
  header: {
    borderBottom: `1px solid ${palette.fog}`,
    background: palette.salt,
    padding: '0 48px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: font.display,
    fontSize: 24,
    fontWeight: 600,
    color: palette.deep,
    letterSpacing: '0.02em',
  },
  logoAccent: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: palette.tide,
    marginLeft: 4,
    verticalAlign: 'middle',
    marginBottom: 2,
  },
  nav: {
    display: 'flex',
    gap: 32,
    alignItems: 'center',
  },
  navStep: (active) => ({
    fontSize: 13,
    color: active ? palette.deep : palette.driftwood,
    fontWeight: active ? 500 : 400,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }),
  navDot: (active, done) => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: done ? palette.tide : active ? palette.deep : 'transparent',
    border: `1.5px solid ${done ? palette.tide : active ? palette.deep : palette.fog}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    color: done || active ? palette.salt : palette.driftwood,
    fontWeight: 600,
    flexShrink: 0,
  }),
  navLine: {
    width: 24,
    height: 1,
    background: palette.fog,
  },
  main: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '56px 24px',
  },
  hero: {
    marginBottom: 48,
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: palette.tide,
    fontWeight: 500,
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: font.display,
    fontSize: 48,
    fontWeight: 400,
    color: palette.deep,
    lineHeight: 1.1,
    marginBottom: 16,
    letterSpacing: '-0.01em',
  },
  heroSub: {
    fontSize: 16,
    color: palette.driftwood,
    lineHeight: 1.6,
    maxWidth: 480,
  },
  card: {
    background: palette.salt,
    border: `1px solid ${palette.fog}`,
    borderRadius: 2,
    padding: '28px 32px',
    marginBottom: 16,
  },
  cardAccent: {
    background: palette.salt,
    border: `1px solid ${palette.fog}`,
    borderLeft: `3px solid ${palette.tide}`,
    borderRadius: 2,
    padding: '28px 32px',
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: palette.driftwood,
    fontWeight: 500,
    marginBottom: 12,
    display: 'block',
  },
  uploadZone: {
    border: `1.5px dashed ${palette.fog}`,
    borderRadius: 2,
    padding: '40px 32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    background: palette.mist,
  },
  uploadIcon: {
    fontSize: 32,
    color: palette.tide,
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 15,
    color: palette.deep,
    fontWeight: 500,
    marginBottom: 4,
  },
  uploadSub: {
    fontSize: 13,
    color: palette.driftwood,
  },
  textarea: {
    width: '100%',
    background: palette.mist,
    border: `1px solid ${palette.fog}`,
    borderRadius: 2,
    padding: '14px 16px',
    color: palette.ink,
    fontSize: 14,
    lineHeight: 1.6,
    resize: 'vertical',
    minHeight: 100,
    fontFamily: font.body,
    outline: 'none',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    background: palette.deep,
    color: palette.salt,
    border: 'none',
    borderRadius: 2,
    padding: '12px 28px',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  btnSecondary: {
    background: 'transparent',
    color: palette.deep,
    border: `1px solid ${palette.fog}`,
    borderRadius: 2,
    padding: '11px 24px',
    fontSize: 13,
    fontWeight: 400,
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  btnAccept: {
    background: 'transparent',
    color: palette.tide,
    border: `1px solid ${palette.tide}`,
    borderRadius: 2,
    padding: '7px 16px',
    fontSize: 12,
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  btnSkip: {
    background: 'transparent',
    color: palette.driftwood,
    border: `1px solid ${palette.fog}`,
    borderRadius: 2,
    padding: '7px 16px',
    fontSize: 12,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    borderBottom: `1px solid ${palette.linen}`,
    color: palette.driftwood,
    fontWeight: 500,
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  td: {
    padding: '10px 12px',
    borderBottom: `1px solid ${palette.linen}`,
    color: palette.ink,
    fontSize: 13,
  },
  confidenceBadge: (c) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 1,
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: c === 'high' ? '#EAF4F4' : c === 'medium' ? '#FAF3E0' : '#FDF0ED',
    color: c === 'high' ? palette.tide : c === 'medium' ? '#A07840' : '#A05040',
  }),
  actionBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 1,
    fontSize: 10,
    background: palette.linen,
    color: palette.driftwood,
    letterSpacing: '0.06em',
    fontFamily: 'monospace',
  },
  stepCard: (accepted) => ({
    background: palette.salt,
    border: `1px solid ${accepted ? palette.tide : palette.fog}`,
    borderRadius: 2,
    padding: '20px 24px',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    opacity: accepted ? 1 : 0.55,
    transition: 'all 0.15s',
  }),
  error: {
    background: '#FDF0ED',
    border: `1px solid #E8B8A8`,
    borderRadius: 2,
    padding: '14px 18px',
    color: '#8B3A2A',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 1.5,
  },
  divider: {
    height: 1,
    background: palette.fog,
    margin: '24px 0',
  },
  statRow: {
    display: 'flex',
    gap: 24,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    background: palette.mist,
    border: `1px solid ${palette.linen}`,
    borderRadius: 2,
    padding: '16px 20px',
  },
  statVal: {
    fontFamily: font.display,
    fontSize: 28,
    fontWeight: 400,
    color: palette.deep,
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: palette.driftwood,
  },
  chatWrap: {
    background: palette.salt,
    border: `1px solid ${palette.fog}`,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    height: 460,
    marginTop: 16,
  },
  chatHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${palette.linen}`,
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: palette.driftwood,
    fontWeight: 500,
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  chatBubble: (isUser) => ({
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    background: isUser ? palette.deep : palette.mist,
    color: isUser ? palette.salt : palette.ink,
    border: `1px solid ${isUser ? palette.deep : palette.linen}`,
    borderRadius: 2,
    padding: '10px 14px',
    maxWidth: '78%',
    fontSize: 13,
    lineHeight: 1.6,
  }),
  chatInputRow: {
    padding: '12px 16px',
    borderTop: `1px solid ${palette.linen}`,
    display: 'flex',
    gap: 10,
  },
  chatInput: {
    flex: 1,
    background: palette.mist,
    border: `1px solid ${palette.fog}`,
    borderRadius: 2,
    padding: '10px 14px',
    fontSize: 13,
    color: palette.ink,
    fontFamily: font.body,
    outline: 'none',
  },
  pendingCard: {
    background: '#EAF4F4',
    border: `1px solid ${palette.tide}`,
    borderRadius: 2,
    padding: '18px 22px',
    marginBottom: 16,
  },
};

function Header({ step }) {
  const steps = ['Upload', 'Plan', 'Results'];
  return (
    <header style={s.header}>
      <div style={s.logo}>
        DataSense<span style={s.logoAccent} />
      </div>
      <nav style={s.nav}>
        {steps.map((name, i) => (
          <React.Fragment key={name}>
            {i > 0 && <div style={s.navLine} />}
            <div style={s.navStep(i === step)}>
              <div style={s.navDot(i === step, i < step)}>
                {i < step ? '✓' : i + 1}
              </div>
              {name}
            </div>
          </React.Fragment>
        ))}
      </nav>
    </header>
  );
}

function DataTable({ rows }) {
  if (!rows?.length) return null;
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={s.table}>
        <thead>
          <tr>{cols.map(c => <th key={c} style={s.th}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{cols.map(c => <td key={c} style={s.td}>{String(row[c] ?? '')}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepCard({ step, accepted, onToggle }) {
  return (
    <div style={s.stepCard(accepted)}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: palette.deep }}>{step.column}</span>
          <span style={s.confidenceBadge(step.confidence)}>{step.confidence}</span>
          <span style={s.actionBadge}>{step.action}</span>
        </div>
        <p style={{ fontSize: 13, color: palette.driftwood, marginBottom: 6, lineHeight: 1.5 }}>
          {step.issue_detected}
        </p>
        <p style={{ fontSize: 13, color: palette.ocean, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 500 }}>Why — </span>{step.reason}
        </p>
      </div>
      <button onClick={onToggle} style={accepted ? s.btnSkip : s.btnAccept}>
        {accepted ? 'Skip' : 'Include'}
      </button>
    </div>
  );
}

function ChatPanel({ sessionId, onActionProposed }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: 'I have full context of your cleaning session. Ask me anything about the changes made, or request further adjustments to the data.'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await api.chat(sessionId, msg);
      setMessages(m => [...m, { role: 'assistant', text: res.response }]);
      if (res.action) onActionProposed(res.action);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: `Something went wrong: ${e.message}` }]);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div style={s.chatWrap}>
      <div style={s.chatHeader}>Assistant</div>
      <div style={s.chatMessages}>
        {messages.map((m, i) => (
          <div key={i} style={s.chatBubble(m.role === 'user')}>{m.text}</div>
        ))}
        {loading && <div style={s.chatBubble(false)}>Thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={s.chatInputRow}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about the data or request a change..."
          style={s.chatInput}
        />
        <button onClick={send} style={s.btnPrimary}>Send</button>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [profileReport, setProfileReport] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [problemStatement, setProblemStatement] = useState('');
  const [cleaningPlan, setCleaningPlan] = useState(null);
  const [acceptedSteps, setAcceptedSteps] = useState(new Set());
  const [executeResults, setExecuteResults] = useState(null);
  const [cleanedPreview, setCleanedPreview] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const fileInputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.uploadFile(file);
      setSessionId(res.session_id);
      setProfileReport(res.profile_report);
      setPreviewRows(res.preview_rows);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!problemStatement.trim()) { setError('Please describe what this dataset will be used for.'); return; }
    setError(null);
    setLoading(true);
    try {
      const plan = await api.generatePlan(sessionId, problemStatement);
      setCleaningPlan(plan);
      setAcceptedSteps(new Set(
        plan.cleaning_steps.filter(s => s.confidence === 'high').map(s => s.step_id)
      ));
      setStep(1);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleExecute = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.execute(sessionId, [...acceptedSteps]);
      setExecuteResults(res.results);
      setCleanedPreview(res.preview_rows);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleApplyAction = async () => {
    if (!pendingAction) return;
    try {
      const res = await api.applyChatAction(sessionId, pendingAction);
      setCleanedPreview(res.preview_rows);
      setPendingAction(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStep = (stepId) => {
    setAcceptedSteps(prev => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
      <Header step={step} />

      <main style={s.main}>

        {/* ── STEP 0 ── */}
        {step === 0 && (
          <>
            <div style={s.hero}>
              <div style={s.heroEyebrow}>Intelligent preprocessing</div>
              <h1 style={s.heroTitle}>Clean data,<br />clear reasoning.</h1>
              <p style={s.heroSub}>Upload a dataset, describe your goal. DataSense analyses, cleans, and explains every decision it makes.</p>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <div style={s.card}>
              <span style={s.label}>Dataset</span>
              <div
                style={s.uploadZone}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={s.uploadIcon}>↑</div>
                <div style={s.uploadTitle}>
                  {loading ? 'Analysing...' : 'Drop your file here, or click to browse'}
                </div>
                <div style={s.uploadSub}>CSV or Excel · up to 50 MB</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {profileReport && (
              <>
                <div style={s.statRow}>
                  <div style={s.stat}>
                    <div style={s.statVal}>{profileReport.total_rows.toLocaleString()}</div>
                    <div style={s.statLabel}>Rows</div>
                  </div>
                  <div style={s.stat}>
                    <div style={s.statVal}>{profileReport.total_columns}</div>
                    <div style={s.statLabel}>Columns</div>
                  </div>
                  <div style={s.stat}>
                    <div style={s.statVal}>{profileReport.duplicate_rows}</div>
                    <div style={s.statLabel}>Duplicates found</div>
                  </div>
                </div>

                <div style={s.card}>
                  <span style={s.label}>Preview</span>
                  <DataTable rows={previewRows} />
                </div>

                <div style={s.card}>
                  <span style={s.label}>Problem statement</span>
                  <textarea
                    value={problemStatement}
                    onChange={e => setProblemStatement(e.target.value)}
                    placeholder="Describe what this data is for. The more specific you are, the better the cleaning decisions. E.g. 'Predicting loan default for rural Indian borrowers — target variable is loan_status, dates should follow DD/MM/YYYY for Indian reporting standards.'"
                    style={s.textarea}
                  />
                  <div style={{ marginTop: 16 }}>
                    <button onClick={handleGeneratePlan} disabled={loading} style={s.btnPrimary}>
                      {loading ? 'Generating plan...' : 'Generate cleaning plan →'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && cleaningPlan && (
          <>
            {error && <div style={s.error}>{error}</div>}

            <div style={s.cardAccent}>
              <span style={s.label}>Analysis</span>
              <p style={{ fontSize: 15, color: palette.ink, lineHeight: 1.7 }}>{cleaningPlan.dataset_summary}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <span style={s.label}>Proposed steps</span>
              <span style={{ fontSize: 12, color: palette.driftwood }}>
                {acceptedSteps.size} of {cleaningPlan.cleaning_steps.length} selected
              </span>
            </div>

            {cleaningPlan.cleaning_steps.map(step => (
              <StepCard
                key={step.step_id}
                step={step}
                accepted={acceptedSteps.has(step.step_id)}
                onToggle={() => toggleStep(step.step_id)}
              />
            ))}

            {cleaningPlan.flagged_for_review?.length > 0 && (
              <>
                <div style={s.divider} />
                <span style={s.label}>Flagged for your review</span>
                {cleaningPlan.flagged_for_review.map((flag, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: palette.deep, marginBottom: 4 }}>{flag.column}</p>
                    <p style={{ fontSize: 13, color: palette.driftwood, lineHeight: 1.5 }}>{flag.observation}</p>
                    <p style={{ fontSize: 12, color: palette.fog, marginTop: 4 }}>{flag.why_not_acted}</p>
                  </div>
                ))}
              </>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(0)} style={s.btnSecondary}>← Back</button>
              <button onClick={handleExecute} disabled={loading} style={s.btnPrimary}>
                {loading ? 'Cleaning...' : `Apply ${acceptedSteps.size} steps →`}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            {error && <div style={s.error}>{error}</div>}

            <div style={s.cardAccent}>
              <span style={s.label}>Cleaning complete</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                {executeResults?.map(r => (
                  <span key={r.step_id} style={{ fontSize: 13, color: r.status === 'success' ? palette.tide : '#A05040' }}>
                    {r.status === 'success' ? '✓' : '✗'} {r.step_id} · {r.rows_affected} rows
                  </span>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={s.label}>Cleaned data</span>
                <button onClick={() => api.downloadCsv(sessionId)} style={s.btnPrimary}>
                  Download CSV
                </button>
              </div>
              <DataTable rows={cleanedPreview} />
            </div>

            {pendingAction && (
              <div style={s.pendingCard}>
                <span style={{ ...s.label, color: palette.tide }}>Proposed change from assistant</span>
                <p style={{ fontSize: 13, color: palette.deep, marginBottom: 4 }}>
                  <strong>{pendingAction.action}</strong> on column <strong>{pendingAction.column}</strong>
                </p>
                <p style={{ fontSize: 13, color: palette.driftwood, marginBottom: 14 }}>{pendingAction.reason}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleApplyAction} style={s.btnPrimary}>Apply</button>
                  <button onClick={() => setPendingAction(null)} style={s.btnSecondary}>Dismiss</button>
                </div>
              </div>
            )}

            <ChatPanel sessionId={sessionId} onActionProposed={setPendingAction} />
          </>
        )}
      </main>
    </div>
  );
}