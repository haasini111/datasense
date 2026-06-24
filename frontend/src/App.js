import React, { useState, useRef } from 'react';
import { api } from './api';

// ---- Styles (inline to keep single file) ----
const s = {
  container: { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
  heading: { fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8 },
  sub: { fontSize: 15, color: '#888', marginBottom: 40 },
  card: { background: '#141414', border: '1px solid #222', borderRadius: 12, padding: 24, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#666', marginBottom: 8, display: 'block' },
  input: { width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: 8, padding: '12px 14px', color: '#e8e8e8', fontSize: 14, resize: 'vertical' },
  btn: { background: '#e8e8e8', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnOutline: { background: 'transparent', color: '#e8e8e8', border: '1px solid #333', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer' },
  btnDanger: { background: '#2d1212', color: '#f87171', border: '1px solid #3d1515', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer' },
  tag: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: color === 'high' ? '#0d2b0d' : color === 'medium' ? '#2b1f0d' : '#2b0d0d', color: color === 'high' ? '#4ade80' : color === 'medium' ? '#fbbf24' : '#f87171', marginLeft: 8 }),
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #222', color: '#666', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' },
  td: { padding: '8px 12px', borderBottom: '1px solid #1a1a1a', color: '#ccc' },
  error: { background: '#2d1212', border: '1px solid #3d1515', borderRadius: 8, padding: 16, color: '#f87171', marginBottom: 16, fontSize: 14 },
  success: { background: '#0d2b0d', border: '1px solid #1a3d1a', borderRadius: 8, padding: 16, color: '#4ade80', marginBottom: 16, fontSize: 14 },
  chatBubble: (isUser) => ({ alignSelf: isUser ? 'flex-end' : 'flex-start', background: isUser ? '#1a1a2e' : '#141414', border: `1px solid ${isUser ? '#2d2d5e' : '#222'}`, borderRadius: 10, padding: '10px 14px', maxWidth: '80%', fontSize: 14, lineHeight: 1.5, marginBottom: 8 }),
};

// ---- Step indicator ----
function StepBar({ step }) {
  const steps = ['Upload', 'Plan', 'Results'];
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: i < step ? '#e8e8e8' : i === step ? '#e8e8e8' : '#222', color: i <= step ? '#0a0a0a' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
          <span style={{ fontSize: 13, color: i <= step ? '#e8e8e8' : '#555' }}>{s}</span>
          {i < 2 && <div style={{ width: 40, height: 1, background: i < step ? '#444' : '#222' }} />}
        </div>
      ))}
    </div>
  );
}

// ---- Data preview table ----
function DataTable({ rows }) {
  if (!rows || rows.length === 0) return null;
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={s.table}>
        <thead><tr>{cols.map(c => <th key={c} style={s.th}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => (
          <tr key={i}>{cols.map(c => <td key={c} style={s.td}>{String(row[c] ?? '')}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ---- Cleaning step card ----
function StepCard({ step, accepted, onToggle }) {
  return (
    <div style={{ ...s.card, borderColor: accepted ? '#1a3d1a' : '#222', opacity: accepted ? 1 : 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e8e8e8' }}>{step.column}</span>
            <span style={s.tag(step.confidence)}>{step.confidence}</span>
            <span style={{ marginLeft: 8, fontSize: 11, color: '#555', background: '#1a1a1a', padding: '2px 6px', borderRadius: 4 }}>{step.action}</span>
          </div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
            <strong style={{ color: '#aaa' }}>Found: </strong>{step.issue_detected}
          </p>
          <p style={{ fontSize: 13, color: '#6ee7b7', lineHeight: 1.5 }}>
            <strong>Why: </strong>{step.reason}
          </p>
        </div>
        <button onClick={onToggle} style={accepted ? s.btnDanger : s.btn}>
          {accepted ? 'Skip' : 'Include'}
        </button>
      </div>
    </div>
  );
}

// ---- Chat panel ----
function ChatPanel({ sessionId, onActionProposed }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Hi! I have full context of your cleaning session. Ask me anything about what was changed, or request further adjustments." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await api.chat(sessionId, userMsg);
      setMessages(m => [...m, { role: 'assistant', text: res.response }]);
      if (res.action) onActionProposed(res.action);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: `Error: ${e.message}` }]);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div style={{ ...s.card, display: 'flex', flexDirection: 'column', height: 480 }}>
      <span style={s.label}>AI Assistant</span>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={s.chatBubble(m.role === 'user')}>{m.text}</div>
        ))}
        {loading && <div style={s.chatBubble(false)}>Thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about the data or request a change..." style={{ ...s.input, resize: 'none' }} />
        <button onClick={send} style={s.btn}>Send</button>
      </div>
    </div>
  );
}

// ---- Main App ----
export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data state
  const [sessionId, setSessionId] = useState(null);
  const [profileReport, setProfileReport] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [problemStatement, setProblemStatement] = useState('');
  const [cleaningPlan, setCleaningPlan] = useState(null);
  const [acceptedSteps, setAcceptedSteps] = useState(new Set());
  const [executeResults, setExecuteResults] = useState(null);
  const [cleanedPreview, setCleanedPreview] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);

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
    if (!problemStatement.trim()) { setError("Please enter a problem statement"); return; }
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
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  return (
    <div style={s.container}>
      <div style={s.heading}>DataSense</div>
      <div style={s.sub}>AI-powered data cleaning with explainable reasoning</div>
      <StepBar step={step} />

      {error && <div style={s.error}>{error}</div>}

      {/* STEP 0 — Upload */}
      {step === 0 && (
        <>
          <div style={s.card}>
            <span style={s.label}>Upload Dataset</span>
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} style={{ color: '#aaa', fontSize: 14 }} />
            <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>CSV or Excel files up to 50MB</p>
          </div>

          {profileReport && (
            <>
              <div style={s.card}>
                <span style={s.label}>Dataset Preview</span>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
                  {profileReport.total_rows} rows · {profileReport.total_columns} columns · {profileReport.duplicate_rows} duplicate rows found
                </p>
                <DataTable rows={previewRows} />
              </div>

              <div style={s.card}>
                <span style={s.label}>Problem Statement</span>
                <textarea
                  value={problemStatement}
                  onChange={e => setProblemStatement(e.target.value)}
                  placeholder="Describe what this dataset will be used for. E.g. 'Predicting loan default for rural Indian borrowers — the target variable is loan_status. Date fields should follow Indian standard DD/MM/YYYY format.'"
                  style={{ ...s.input, minHeight: 100 }}
                />
                <button onClick={handleGeneratePlan} disabled={loading} style={{ ...s.btn, marginTop: 12 }}>
                  {loading ? 'Generating cleaning plan...' : 'Generate Cleaning Plan →'}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* STEP 1 — Cleaning Plan */}
      {step === 1 && cleaningPlan && (
        <>
          <div style={s.card}>
            <span style={s.label}>Dataset Analysis</span>
            <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6 }}>{cleaningPlan.dataset_summary}</p>
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={s.label}>Proposed Cleaning Steps ({acceptedSteps.size} of {cleaningPlan.cleaning_steps.length} selected)</span>
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
            <div style={s.card}>
              <span style={s.label}>Flagged for Your Review</span>
              {cleaningPlan.flagged_for_review.map((flag, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #1a1a1a' }}>
                  <strong style={{ fontSize: 13 }}>{flag.column}</strong>
                  <p style={{ fontSize: 13, color: '#888' }}>{flag.observation}</p>
                  <p style={{ fontSize: 12, color: '#555' }}>{flag.why_not_acted}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setStep(0)} style={s.btnOutline}>← Back</button>
            <button onClick={handleExecute} disabled={loading} style={s.btn}>
              {loading ? 'Cleaning...' : `Apply ${acceptedSteps.size} Steps →`}
            </button>
          </div>
        </>
      )}

      {/* STEP 2 — Results */}
      {step === 2 && (
        <>
          <div style={{ ...s.card, borderColor: '#1a3d1a' }}>
            <span style={s.label}>Cleaning Complete</span>
            <div style={{ display: 'flex', gap: 24 }}>
              {executeResults?.map(r => (
                <div key={r.step_id} style={{ fontSize: 13 }}>
                  <span style={{ color: r.status === 'success' ? '#4ade80' : '#f87171' }}>
                    {r.status === 'success' ? '✓' : '✗'}
                  </span>
                  {' '}{r.step_id} — {r.rows_affected} rows affected
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={s.label}>Cleaned Data Preview</span>
              <button onClick={() => api.downloadCsv(sessionId)} style={s.btn}>Download CSV</button>
            </div>
            <DataTable rows={cleanedPreview} />
          </div>

          {pendingAction && (
            <div style={{ ...s.card, borderColor: '#2d2d5e' }}>
              <span style={s.label}>Pending Action from Chat</span>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 12 }}>
                The assistant wants to: <strong>{pendingAction.action}</strong> on column <strong>{pendingAction.column}</strong>
              </p>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{pendingAction.reason}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleApplyAction} style={s.btn}>Apply Change</button>
                <button onClick={() => setPendingAction(null)} style={s.btnOutline}>Dismiss</button>
              </div>
            </div>
          )}

          <ChatPanel sessionId={sessionId} onActionProposed={setPendingAction} />
        </>
      )}
    </div>
  );
}