import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Check, Plus, Moon, BookOpen, Layers, BatteryMedium, BatteryLow,
  Flame, AlertTriangle, ChevronRight, ChevronLeft, X, Sparkles,
  Pencil, Trash2, CalendarDays, RotateCcw
} from "lucide-react";

/* ---------------------------------------------------------------------
   TYPES
--------------------------------------------------------------------- */
type Bucket = "study" | "other";
type Kind = "fixed" | "flexible";
type Priority = "P0" | "P1" | "P2" | "P3";
type Energy = "high" | "medium" | "low";
type RevisionStage = 1 | 4 | 7;

interface Revision {
  stage: RevisionStage;
}

interface Block {
  id: string;
  start: number;        // decimal hour, e.g. 9.5 = 9:30
  duration: number;     // minutes
  label: string;
  bucket: Bucket;
  kind: Kind;
  subject: string | null;
  priority: Priority | null;
  energy: Energy | null;
  revision: Revision | null;
  groupId: string | null; // links a 1-4-7 revision chain together
  completed: boolean;
}

interface DayData {
  sleepStart?: number;
  sleepEnd?: number;
  blocks: Block[];
}

type DaysData = Record<string, DayData>;

interface BlockOpts {
  bucket?: Bucket;
  kind?: Kind;
  subject?: string | null;
  priority?: Priority | null;
  energy?: Energy | null;
  revision?: Revision | null;
  groupId?: string | null;
  completed?: boolean;
}

interface DayTotals {
  sleep: number;
  study: number;
  other: number;
}

declare global {
  interface Window {
    storage?: {
      get: (key: string, shared?: boolean) => Promise<{ key: string; value: string; shared: boolean } | null>;
      set: (key: string, value: string, shared?: boolean) => Promise<{ key: string; value: string; shared: boolean } | null>;
      delete: (key: string, shared?: boolean) => Promise<{ key: string; deleted: boolean; shared: boolean } | null>;
      list: (prefix?: string, shared?: boolean) => Promise<{ keys: string[]; prefix?: string; shared: boolean } | null>;
    };
  }
}

/* ---------------------------------------------------------------------
   TOKENS — Aether OS theme-integrated instrument tokens
--------------------------------------------------------------------- */
const COLORS = {
  page: "var(--aether-bg-app, #f8fafc)",
  panel: "var(--aether-bg-surface, #ffffff)",
  panel2: "var(--aether-bg-surface-elevated, #f1f5f9)",
  line: "var(--aether-border-color, #e2e8f0)",
  text: "var(--aether-text-main, #0f172a)",
  muted: "var(--aether-text-muted, #64748b)",
  sleep: "#6366f1",
  study: "#0891b2",
  other: "#10b981",
  p0: "#ef4444",
  p1: "#f59e0b",
  p2: "#3b82f6",
  p3: "#94a3b8",
  revision: "#8b5cf6",
};

const GlobalStyle: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .aether-root * { box-sizing: border-box; }
    .aether-root { font-family: 'Inter', sans-serif; background: ${COLORS.page}; color: ${COLORS.text}; position: relative; overflow: hidden; }
    .aether-root .display { font-family: 'Fraunces', serif; }
    .aether-root .mono { font-family: 'IBM Plex Mono', monospace; }
    .aether-root ::selection { background: ${COLORS.study}33; }
    .aether-root button { font-family: inherit; cursor: pointer; }
    .aether-root button:focus-visible, .aether-root input:focus-visible, .aether-root select:focus-visible {
      outline: 2px solid ${COLORS.study}; outline-offset: 2px;
    }
    .aether-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
    .aether-scroll::-webkit-scrollbar-thumb { background: ${COLORS.line}; border-radius: 4px; }
    .dial-btn { transition: transform .18s ease, box-shadow .18s ease; }
    .dial-btn:hover { transform: translateY(-2px); }
    .icon-btn { transition: background .15s ease, color .15s ease, opacity .15s ease; }
    .icon-btn:hover { background: ${COLORS.panel2}; }
    .task-row { transition: background .15s ease, border-color .15s ease, box-shadow .15s ease; position: relative; }
    .task-row:hover { background: ${COLORS.panel2}; box-shadow: 0 1px 0 ${COLORS.line}; }
    .task-row:hover .task-actions { opacity: 1; }
    .task-actions { opacity: 0; transition: opacity .15s ease; }
    .chk { transition: all .15s ease; }
    .fade-in { animation: fadeIn .2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
    input, select { font-family: inherit; }

    /* ---------------- ambient floating background ---------------- */
    .aether-float-layer { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
    .aether-blob { position: absolute; border-radius: 50%; filter: blur(64px); will-change: transform; }
    .aether-blob-1 {
      width: 420px; height: 420px; top: -120px; left: -80px;
      background: radial-gradient(circle at 30% 30%, ${COLORS.sleep}26, transparent 70%);
      animation: floatA 26s ease-in-out infinite;
    }
    .aether-blob-2 {
      width: 480px; height: 480px; top: 10%; right: -140px;
      background: radial-gradient(circle at 60% 40%, ${COLORS.study}20, transparent 70%);
      animation: floatB 32s ease-in-out infinite;
    }
    .aether-blob-3 {
      width: 380px; height: 380px; bottom: -140px; left: 20%;
      background: radial-gradient(circle at 50% 50%, ${COLORS.other}1E, transparent 70%);
      animation: floatC 30s ease-in-out infinite;
    }
    @keyframes floatA {
      0%   { transform: translate(0, 0) scale(1); }
      33%  { transform: translate(40px, 30px) scale(1.06); }
      66%  { transform: translate(-20px, 50px) scale(0.96); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes floatB {
      0%   { transform: translate(0, 0) scale(1); }
      50%  { transform: translate(-60px, 40px) scale(1.08); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes floatC {
      0%   { transform: translate(0, 0) scale(1); }
      40%  { transform: translate(30px, -40px) scale(1.05); }
      75%  { transform: translate(-30px, -10px) scale(0.94); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .aether-blob { animation: none !important; }
    }
    .aether-content { position: relative; z-index: 1; }

    @media (max-width: 720px) {
      .aether-week-grid { grid-template-columns: repeat(7, minmax(76px,1fr)) !important; overflow-x: auto; }
    }
  `}</style>
);

/* ---------------------------------------------------------------------
   TIME + DATE HELPERS
--------------------------------------------------------------------- */
const pad2 = (n: number): string => n.toString().padStart(2, "0");

const fmtHM = (decHour: number): string => {
  const h = ((Math.floor(decHour) % 24) + 24) % 24;
  const m = Math.round((decHour - Math.floor(decHour)) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  return `${h12}:${pad2(m)} ${ampm}`;
};
const fmtDur = (mins: number): string => {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};
const hoursToLabel = (h: number): string => `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`.replace(" 0m", "");

const decToTimeInput = (dec: number): string => {
  const h = Math.floor(((dec % 24) + 24) % 24);
  const m = Math.round((dec - Math.floor(dec)) * 60);
  return `${pad2(h)}:${pad2(m)}`;
};
const timeInputToDec = (s: string): number => {
  const [h, m] = s.split(":").map(Number);
  return h + (m || 0) / 60;
};

const dateKey = (d: Date): string => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const addDays = (d: Date, n: number): Date => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const startOfWeek = (d: Date): Date => { const dow = (d.getDay() + 6) % 7; return addDays(d, -dow); }; // Monday-based
const todayKey = (): string => dateKey(new Date());

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_SLEEP = { start: 23, end: 7 };

/* ---------------------------------------------------------------------
   DATA ACCESS HELPERS
--------------------------------------------------------------------- */
let uid = 1;
const nid = (): string => `t${Date.now().toString(36)}${(uid++).toString(36)}`;

const mk = (start: number, duration: number, label: string, opts: BlockOpts = {}): Block => ({
  id: nid(), start, duration, label,
  bucket: opts.bucket || "other",
  kind: opts.kind || "flexible",
  subject: opts.subject || null,
  priority: opts.priority || null,
  energy: opts.energy || null,
  revision: opts.revision || null,
  groupId: opts.groupId || null,
  completed: opts.completed || false,
});

function getDay(daysData: DaysData, key: string): DayData {
  const entry = daysData[key];
  return {
    sleepStart: entry?.sleepStart ?? DEFAULT_SLEEP.start,
    sleepEnd: entry?.sleepEnd ?? DEFAULT_SLEEP.end,
    blocks: entry?.blocks ?? [],
  };
}

function dayTotals(day: DayData): DayTotals {
  const s = day.sleepStart ?? DEFAULT_SLEEP.start, e = day.sleepEnd ?? DEFAULT_SLEEP.end;
  const sleepHours = e >= s ? e - s : (24 - s) + e;
  let studyMin = 0, otherMin = 0;
  day.blocks.forEach(b => { if (b.bucket === "study") studyMin += b.duration; else otherMin += b.duration; });
  return { sleep: sleepHours, study: studyMin / 60, other: otherMin / 60 };
}

function reasonForShortfall(day: DayData, totals: DayTotals): string {
  const fixedMin = day.blocks.filter(b => b.kind === "fixed").reduce((s, b) => s + b.duration, 0);
  if (fixedMin >= 120) return `${fmtDur(fixedMin)} of fixed commitments left less room for study today.`;
  if (totals.sleep < 7.9) return `Sleep was protected first — study flexed around it.`;
  if (day.blocks.length === 0) return `Nothing's scheduled yet.`;
  return `Flexible time ran into other plans today.`;
}

/* ---------------------------------------------------------------------
   DIAL — signature element: a 24h instrument face per day
--------------------------------------------------------------------- */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx: number, cy: number, r: number, startH: number, endH: number, gap = 1.4): string {
  const a1 = (startH / 24) * 360 + gap;
  let a2 = (endH / 24) * 360 - gap;
  if (a2 <= a1) a2 = a1 + 0.5;
  const s = polar(cx, cy, r, a1), e = polar(cx, cy, r, a2);
  const large = a2 - a1 <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

interface DialProps {
  day: DayData; size?: number; selected: boolean; onClick: () => void; label: string; isToday: boolean;
}
const Dial: React.FC<DialProps> = ({ day, size = 84, selected, onClick, label, isToday }) => {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  const sw = size * 0.1;
  const s0 = day.sleepStart ?? DEFAULT_SLEEP.start, s1 = day.sleepEnd ?? DEFAULT_SLEEP.end;
  const sleepSegs: [number, number][] = s1 >= s0 ? [[s0, s1]] : [[s0, 24], [0, s1]];
  const totals = dayTotals(day);
  return (
    <button className="dial-btn" onClick={onClick} aria-label={`View ${label}`} style={{
      background: selected ? COLORS.panel2 : COLORS.panel,
      border: `1px solid ${selected ? COLORS.study : COLORS.line}`,
      borderRadius: 14, padding: "10px 8px 8px", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 6, minWidth: size + 24,
      boxShadow: selected ? `0 0 0 3px ${COLORS.study}22, 0 2px 8px rgba(33,30,23,0.06)` : "0 1px 3px rgba(33,30,23,0.04)",
    }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: 1, color: selected ? COLORS.study : COLORS.muted, display: "flex", alignItems: "center", gap: 5 }}>
        {label}
        {isToday && <span style={{ width: 5, height: 5, borderRadius: 99, background: COLORS.study, display: "inline-block" }} />}
      </div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.line} strokeWidth={sw} />
        {sleepSegs.map((seg, i) => (
          <path key={`s${i}`} d={arcPath(cx, cy, r, seg[0], seg[1])} stroke={COLORS.sleep} strokeWidth={sw} fill="none" strokeLinecap="round" />
        ))}
        {day.blocks.map(b => (
          <path key={b.id} d={arcPath(cx, cy, r, b.start, b.start + b.duration / 60)}
            stroke={b.bucket === "study" ? COLORS.study : COLORS.other}
            strokeWidth={sw} fill="none" strokeLinecap="round"
            strokeDasharray={b.kind === "fixed" ? `${sw * 0.9} ${sw * 0.6}` : "none"}
            opacity={b.completed ? 0.4 : 1} />
        ))}
        <text x={cx} y={cy - 1} textAnchor="middle" className="display" fontSize={size * 0.19} fill={COLORS.text} fontWeight={600}>
          {totals.study.toFixed(1)}h
        </text>
        <text x={cx} y={cy + size * 0.16} textAnchor="middle" className="mono" fontSize={size * 0.1} fill={COLORS.muted}>
          study
        </text>
      </svg>
    </button>
  );
};

/* ---------------------------------------------------------------------
   SMALL UI PIECES
--------------------------------------------------------------------- */
function PriorityTag({ p }: { p: Priority | null }) {
  if (!p) return null;
  const map: Record<Priority, { c: string; label: string }> = {
    P0: { c: COLORS.p0, label: "P0 · Critical" },
    P1: { c: COLORS.p1, label: "P1 · High" },
    P2: { c: COLORS.p2, label: "P2 · Normal" },
    P3: { c: COLORS.p3, label: "P3 · Low" },
  };
  const m = map[p];
  return (
    <span className="mono" style={{
      fontSize: 10.5, color: m.c, border: `1px solid ${m.c}55`, borderRadius: 999,
      padding: "2px 8px", background: `${m.c}12`, whiteSpace: "nowrap",
    }}>{m.label}</span>
  );
}
function EnergyTag({ e }: { e: Energy | null }) {
  if (!e) return null;
  const map: Record<Energy, { icon: typeof Flame; label: string; c: string }> = {
    high: { icon: Flame, label: "High energy", c: COLORS.p0 },
    medium: { icon: BatteryMedium, label: "Medium energy", c: COLORS.study },
    low: { icon: BatteryLow, label: "Low energy", c: COLORS.other },
  };
  const m = map[e]; const Icon = m.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, color: COLORS.muted }}>
      <Icon size={11} color={m.c} /> {m.label}
    </span>
  );
}
function RevisionTag({ r, missed }: { r: Revision | null; missed?: boolean }) {
  if (!r) return null;
  const labels: Record<RevisionStage, string> = { 1: "Day 1 · Learn", 4: "Day 4 · Revision 1", 7: "Day 7 · Revision 2" };
  return (
    <span className="mono" style={{
      fontSize: 10.5, color: missed ? COLORS.p0 : COLORS.revision,
      border: `1px solid ${missed ? COLORS.p0 : COLORS.revision}55`, borderRadius: 999,
      padding: "2px 8px", background: missed ? `${COLORS.p0}12` : `${COLORS.revision}12`,
    }}>
      {missed ? "● overdue · " : "↻ "}{labels[r.stage]}
    </span>
  );
}

/* ---------------------------------------------------------------------
   GAUGE — weekly 8-8-8 balance bar
--------------------------------------------------------------------- */
function Gauge({ label, actual, target, color, icon: Icon }: {
  label: string; actual: number; target: number; color: string; icon: typeof Moon;
}) {
  const pct = Math.min(100, target > 0 ? (actual / target) * 100 : 0);
  const delta = actual - target;
  return (
    <div style={{ flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.text, fontSize: 13, fontWeight: 600 }}>
          <Icon size={14} color={color} /> {label}
        </div>
        <div className="mono" style={{ fontSize: 11.5, color: COLORS.muted }}>
          {actual.toFixed(1)}h / {target}h
        </div>
      </div>
      <div style={{ height: 8, background: COLORS.line, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width .4s ease" }} />
      </div>
      <div className="mono" style={{ fontSize: 10.5, marginTop: 4, color: delta >= 0 ? COLORS.other : COLORS.muted }}>
        {delta >= 0 ? `+${delta.toFixed(1)}h ahead` : `${Math.abs(delta).toFixed(1)}h under target`}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   ADD / EDIT TASK FORM
--------------------------------------------------------------------- */
interface FormState {
  label: string; subject: string; start: string; duration: number;
  priority: Priority; energy: Energy; bucket: Bucket; kind: Kind; enableRevision: boolean;
}
const blankForm = (): FormState => ({
  label: "", subject: "", start: "18:00", duration: 45,
  priority: "P2", energy: "medium", bucket: "study", kind: "flexible", enableRevision: false,
});
const formFromBlock = (b: Block): FormState => ({
  label: b.label, subject: b.subject || "", start: decToTimeInput(b.start), duration: b.duration,
  priority: b.priority || "P2", energy: b.energy || "medium", bucket: b.bucket, kind: b.kind, enableRevision: false,
});

function TaskForm({ initial, isEdit, onSubmit, onClose }: {
  initial: FormState; isEdit: boolean;
  onSubmit: (f: FormState) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.label.trim()) return;
    onSubmit({ ...form, label: form.label.trim() });
  };

  const inputStyle: React.CSSProperties = {
    background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 8,
    color: COLORS.text, padding: "8px 10px", fontSize: 13, width: "100%",
  };
  const field = (labelText: string, node: React.ReactNode) => (
    <div style={{ flex: 1, minWidth: 110 }}>
      <div className="mono" style={{ fontSize: 10, color: COLORS.muted, marginBottom: 4, letterSpacing: 0.5 }}>{labelText.toUpperCase()}</div>
      {node}
    </div>
  );

  return (
    <div className="fade-in" style={{ background: COLORS.panel2, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 14, marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{isEdit ? "Edit task" : "Add to this day"}</div>
        <button onClick={onClose} className="icon-btn" style={{ background: "none", border: "none", color: COLORS.muted, borderRadius: 6, padding: 2 }}><X size={15} /></button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        {field("Task", <input style={inputStyle} placeholder="e.g. Physics — Kinematics" value={form.label} onChange={e => set("label", e.target.value)} autoFocus />)}
        {field("Subject", <input style={inputStyle} placeholder="optional" value={form.subject} onChange={e => set("subject", e.target.value)} />)}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        {field("Start", <input type="time" style={inputStyle} value={form.start} onChange={e => set("start", e.target.value)} />)}
        {field("Duration (min)", <input type="number" min={5} step={5} style={inputStyle} value={form.duration} onChange={e => set("duration", Number(e.target.value))} />)}
        {field("Bucket", (
          <select style={inputStyle} value={form.bucket} onChange={e => set("bucket", e.target.value as Bucket)}>
            <option value="study">Study</option>
            <option value="other">Other</option>
          </select>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        {field("Priority", (
          <select style={inputStyle} value={form.priority} onChange={e => set("priority", e.target.value as Priority)}>
            <option value="P0">P0 · Critical</option>
            <option value="P1">P1 · High</option>
            <option value="P2">P2 · Normal</option>
            <option value="P3">P3 · Low</option>
          </select>
        ))}
        {field("Energy needed", (
          <select style={inputStyle} value={form.energy} onChange={e => set("energy", e.target.value as Energy)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        ))}
        {field("Kind", (
          <select style={inputStyle} value={form.kind} onChange={e => set("kind", e.target.value as Kind)}>
            <option value="flexible">Flexible</option>
            <option value="fixed">Fixed</option>
          </select>
        ))}
      </div>
      {!isEdit && form.bucket === "study" && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 12.5, color: COLORS.text, cursor: "pointer" }}>
          <input type="checkbox" checked={form.enableRevision} onChange={e => set("enableRevision", e.target.checked)} style={{ width: 15, height: 15 }} />
          Start a 1-4-7 revision cycle (auto-schedules Day 4 and Day 7 revisions)
        </label>
      )}
      <button onClick={submit} style={{
        background: COLORS.study, color: "#FFFFFF", border: "none", borderRadius: 8,
        padding: "9px 16px", fontSize: 13, fontWeight: 700,
      }}>{isEdit ? "Save changes" : "Add task"}</button>
    </div>
  );
}

/* ---------------------------------------------------------------------
   TASK ROW
--------------------------------------------------------------------- */
interface TaskRowProps {
  b: Block; missed: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void;
}
const TaskRow: React.FC<TaskRowProps> = ({ b, missed, onToggle, onEdit, onDelete }) => {
  const barColor = b.bucket === "study" ? COLORS.study : COLORS.other;
  return (
    <div className="task-row" style={{
      display: "flex", gap: 12, padding: "10px 12px", borderRadius: 10,
      border: `1px solid ${COLORS.line}`, alignItems: "flex-start",
      opacity: b.completed ? 0.55 : 1, marginBottom: 8, background: COLORS.panel,
      boxShadow: "0 1px 2px rgba(33,30,23,0.03)",
    }}>
      <button onClick={onToggle} aria-label={b.completed ? "Mark incomplete" : "Mark complete"} className="chk" style={{
        width: 20, height: 20, borderRadius: 6, marginTop: 2, flexShrink: 0,
        border: `1.5px solid ${b.completed ? barColor : COLORS.line}`,
        background: b.completed ? barColor : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {b.completed && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
      </button>
      <div style={{ width: 3, alignSelf: "stretch", background: barColor, borderRadius: 2, opacity: b.kind === "fixed" ? 0.4 : 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, textDecoration: b.completed ? "line-through" : "none" }}>{b.label}</div>
          <div className="mono" style={{ fontSize: 11, color: COLORS.muted, whiteSpace: "nowrap" }}>
            {fmtHM(b.start)} · {fmtDur(b.duration)}
          </div>
        </div>
        {(b.priority || b.energy || b.revision || b.kind === "fixed") && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6, alignItems: "center" }}>
            {b.kind === "fixed" && (
              <span className="mono" style={{ fontSize: 10.5, color: COLORS.muted, border: `1px solid ${COLORS.line}`, borderRadius: 999, padding: "2px 8px" }}>Fixed</span>
            )}
            <PriorityTag p={b.priority} />
            <RevisionTag r={b.revision} missed={missed} />
            <EnergyTag e={b.energy} />
          </div>
        )}
      </div>
      <div className="task-actions" style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        <button onClick={onEdit} aria-label="Edit task" className="icon-btn" style={{ background: "none", border: "none", color: COLORS.muted, borderRadius: 6, padding: 5 }}>
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} aria-label="Delete task" className="icon-btn" style={{ background: "none", border: "none", color: COLORS.muted, borderRadius: 6, padding: 5 }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------
   AMBIENT FLOATING BACKGROUND
--------------------------------------------------------------------- */
function FloatingBackground() {
  return (
    <div className="aether-float-layer" aria-hidden="true">
      <div className="aether-blob aether-blob-1" />
      <div className="aether-blob aether-blob-2" />
      <div className="aether-blob aether-blob-3" />
    </div>
  );
}

/* ---------------------------------------------------------------------
   SLEEP EDITOR
--------------------------------------------------------------------- */
function SleepEditor({ start, end, onSave, onClose }: {
  start: number; end: number; onSave: (s: number, e: number) => void; onClose: () => void;
}) {
  const [s, setS] = useState(decToTimeInput(start));
  const [e, setE] = useState(decToTimeInput(end));
  const inputStyle: React.CSSProperties = {
    background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 8,
    color: COLORS.text, padding: "6px 8px", fontSize: 12.5,
  };
  return (
    <div className="fade-in" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
      <input type="time" style={inputStyle} value={s} onChange={ev => setS(ev.target.value)} />
      <span className="mono" style={{ fontSize: 11, color: COLORS.muted }}>to</span>
      <input type="time" style={inputStyle} value={e} onChange={ev => setE(ev.target.value)} />
      <button onClick={() => onSave(timeInputToDec(s), timeInputToDec(e))} style={{
        background: COLORS.sleep, color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700,
      }}>Save</button>
      <button onClick={onClose} className="icon-btn" style={{ background: "none", border: "none", color: COLORS.muted, borderRadius: 6, padding: 4 }}><X size={14} /></button>
    </div>
  );
}

/* ---------------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------------- */
const STORAGE_KEY = "aether-planner-v2";

export default function AetherWeeklyPlanner() {
  const [daysData, setDaysData] = useState<DaysData>({});
  const [weekAnchor, setWeekAnchor] = useState<Date>(() => startOfWeek(new Date()));
  const [selectedKey, setSelectedKey] = useState<string>(() => todayKey());
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSleep, setEditingSleep] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const loadedOnce = useRef(false);

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekAnchor, i)), [weekAnchor]);
  const weekKeys = useMemo(() => weekDates.map(dateKey), [weekDates]);

  // load
  useEffect(() => {
    (async () => {
      try {
        let raw: string | null = null;
        if (typeof window !== "undefined" && window.storage) {
          const res = await window.storage.get(STORAGE_KEY);
          raw = res?.value ?? null;
        }
        if (!raw && typeof window !== "undefined") {
          raw = localStorage.getItem(STORAGE_KEY);
        }
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.daysData) setDaysData(parsed.daysData);
        }
      } catch { /* nothing saved yet */ }
      setLoaded(true);
    })();
  }, []);

  // save
  useEffect(() => {
    if (!loaded) return;
    if (!loadedOnce.current) { loadedOnce.current = true; return; }
    (async () => {
      const payload = JSON.stringify({ daysData });
      try {
        if (typeof window !== "undefined" && window.storage) {
          await window.storage.set(STORAGE_KEY, payload);
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, payload);
        }
      } catch (e) { console.error("Save failed", e); }
    })();
  }, [daysData, loaded]);

  const updateDay = useCallback((key: string, updater: (d: DayData) => DayData) => {
    setDaysData(prev => ({ ...prev, [key]: updater(getDay(prev, key)) }));
  }, []);

  const toggleTask = useCallback((key: string, id: string) => {
    updateDay(key, d => ({ ...d, blocks: d.blocks.map(b => b.id === id ? { ...b, completed: !b.completed } : b) }));
  }, [updateDay]);

  const deleteBlock = useCallback((key: string, block: Block) => {
    if (block.groupId && block.revision?.stage === 1) {
      // cascade: remove every block in this revision chain, wherever it landed
      setDaysData(prev => {
        const next: DaysData = {};
        for (const k of Object.keys(prev)) {
          next[k] = { ...prev[k], blocks: prev[k].blocks.filter(b => b.groupId !== block.groupId) };
        }
        return next;
      });
    } else {
      updateDay(key, d => ({ ...d, blocks: d.blocks.filter(b => b.id !== block.id) }));
    }
  }, [updateDay]);

  const addTask = useCallback((key: string, form: FormState) => {
    const startDec = timeInputToDec(form.start);
    const base: BlockOpts = {
      bucket: form.bucket, kind: form.kind, subject: form.subject || null,
      priority: form.priority, energy: form.energy,
    };
    if (form.bucket === "study" && form.enableRevision) {
      const groupId = nid();
      const block1 = mk(startDec, form.duration, form.label, { ...base, revision: { stage: 1 }, groupId });
      updateDay(key, d => ({ ...d, blocks: [...d.blocks, block1].sort((a, b) => a.start - b.start) }));

      const key4 = dateKey(addDays(new Date(key), 4));
      const block4 = mk(startDec, form.duration, `${form.label} · Revision 1 (Day 4)`, { ...base, revision: { stage: 4 }, groupId });
      updateDay(key4, d => ({ ...d, blocks: [...d.blocks, block4].sort((a, b) => a.start - b.start) }));

      const key7 = dateKey(addDays(new Date(key), 7));
      const block7 = mk(startDec, form.duration, `${form.label} · Revision 2 (Day 7)`, { ...base, revision: { stage: 7 }, groupId });
      updateDay(key7, d => ({ ...d, blocks: [...d.blocks, block7].sort((a, b) => a.start - b.start) }));
    } else {
      const block = mk(startDec, form.duration, form.label, base);
      updateDay(key, d => ({ ...d, blocks: [...d.blocks, block].sort((a, b) => a.start - b.start) }));
    }
  }, [updateDay]);

  const editTask = useCallback((key: string, id: string, form: FormState) => {
    const startDec = timeInputToDec(form.start);
    updateDay(key, d => ({
      ...d,
      blocks: d.blocks.map(b => b.id === id ? {
        ...b, start: startDec, duration: form.duration, label: form.label,
        bucket: form.bucket, kind: form.kind, subject: form.subject || null,
        priority: form.priority, energy: form.energy,
      } : b).sort((a, b) => a.start - b.start),
    }));
  }, [updateDay]);

  const saveSleep = useCallback((key: string, s: number, e: number) => {
    updateDay(key, d => ({ ...d, sleepStart: s, sleepEnd: e }));
    setEditingSleep(false);
  }, [updateDay]);

  // parseable Date object from a key, used for +4/+7 offset math above (new Date(key) works because key is YYYY-MM-DD)
  // note: browsers parse "YYYY-MM-DD" as UTC midnight; that's fine here since we only add whole days and re-derive local Y/M/D via dateKey().

  const weekTotals = useMemo(() => {
    return weekKeys.reduce((acc, k) => {
      const t = dayTotals(getDay(daysData, k));
      return { sleep: acc.sleep + t.sleep, study: acc.study + t.study, other: acc.other + t.other };
    }, { sleep: 0, study: 0, other: 0 });
  }, [daysData, weekKeys]);

  const selectedDay = getDay(daysData, selectedKey);
  const sorted = useMemo(() => [...selectedDay.blocks].sort((a, b) => a.start - b.start), [selectedDay]);
  const totals = dayTotals(selectedDay);
  const shortfall = totals.study < 7.8 ? reasonForShortfall(selectedDay, totals) : null;
  const isPastSelected = selectedKey < todayKey();

  const nextUp = useMemo(() => {
    const priOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return [...selectedDay.blocks]
      .filter(b => !b.completed)
      .sort((a, b) => ((priOrder[a.priority ?? ""] ?? 4) - (priOrder[b.priority ?? ""] ?? 4)) || (a.start - b.start))[0];
  }, [selectedDay]);

  const revisionsToday = selectedDay.blocks.filter(b => b.revision).length;
  const completedCount = selectedDay.blocks.filter(b => b.completed).length;

  // scan the whole dataset (not just this week) for the revision engine panel — dynamic, not hardcoded
  const revisionScan = useMemo(() => {
    const items: { key: string; block: Block }[] = [];
    const entries = Object.entries(daysData) as [string, DayData][];
    for (const [k, d] of entries) {
      for (const b of d.blocks) if (b.revision) items.push({ key: k, block: b });
    }
    const groups = new Set(items.filter(i => !i.block.completed).map(i => i.block.groupId).filter(Boolean));
    const today = todayKey();
    const upcoming = items
      .filter(i => !i.block.completed && i.key >= today)
      .sort((a, b) => a.key.localeCompare(b.key) || a.block.start - b.block.start)
      .slice(0, 4);
    return { activeCycles: groups.size, upcoming };
  }, [daysData]);

  const openAdd = () => { setFormMode("add"); setEditingId(null); };
  const openEdit = (id: string) => { setFormMode("edit"); setEditingId(id); };
  const closeForm = () => { setFormMode(null); setEditingId(null); };
  const editingBlock = editingId ? selectedDay.blocks.find(b => b.id === editingId) || null : null;

  const goPrevWeek = () => setWeekAnchor(w => addDays(w, -7));
  const goNextWeek = () => setWeekAnchor(w => addDays(w, 7));
  const goThisWeek = () => { setWeekAnchor(startOfWeek(new Date())); setSelectedKey(todayKey()); };
  const jumpTo = (key: string) => { setWeekAnchor(startOfWeek(new Date(key + "T00:00:00"))); setSelectedKey(key); };

  const weekLabel = `${weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekDates[6].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
  const isThisWeek = weekKeys.includes(todayKey());

  return (
    <div className="aether-root" style={{ minHeight: "100%", padding: "28px 20px 60px" }}>
      <GlobalStyle />
      <FloatingBackground />
      <div className="aether-content" style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.study, fontSize: 12, letterSpacing: 2 }} className="mono">
              <Sparkles size={13} /> AETHER · WEEKLY INSTRUMENT
            </div>
            <div className="display" style={{ fontSize: 32, fontWeight: 600, marginTop: 4 }}>This week's balance</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={goPrevWeek} aria-label="Previous week" className="icon-btn" style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 7 }}>
              <ChevronLeft size={15} />
            </button>
            <div className="mono" style={{ fontSize: 12, color: COLORS.muted, minWidth: 150, textAlign: "center" }}>{weekLabel}</div>
            <button onClick={goNextWeek} aria-label="Next week" className="icon-btn" style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 7 }}>
              <ChevronRight size={15} />
            </button>
            {!isThisWeek && (
              <button onClick={goThisWeek} className="icon-btn" style={{ display: "flex", alignItems: "center", gap: 5, background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "7px 10px", fontSize: 12 }}>
                <CalendarDays size={13} /> Today
              </button>
            )}
          </div>
        </div>

        {/* WEEKLY 8-8-8 GAUGES */}
        <div style={{
          display: "flex", gap: 24, flexWrap: "wrap", background: COLORS.panel,
          border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "18px 20px", marginBottom: 22,
          boxShadow: "0 2px 10px rgba(33,30,23,0.05)",
        }}>
          <Gauge label="Sleep" actual={weekTotals.sleep} target={56} color={COLORS.sleep} icon={Moon} />
          <Gauge label="Study" actual={weekTotals.study} target={56} color={COLORS.study} icon={BookOpen} />
          <Gauge label="Other" actual={weekTotals.other} target={56} color={COLORS.other} icon={Layers} />
        </div>

        {/* DIAL STRIP */}
        <div className="aether-scroll aether-week-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginBottom: 22, paddingBottom: 4,
        }}>
          {weekDates.map((d, i) => {
            const k = weekKeys[i];
            return (
              <Dial key={k} day={getDay(daysData, k)} selected={k === selectedKey} isToday={k === todayKey()}
                label={`${DAY_NAMES[i]} ${d.getDate()}`} onClick={() => setSelectedKey(k)} />
            );
          })}
        </div>

        {/* SELECTED DAY */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* Timeline */}
          <div style={{ flex: "2 1 420px", minWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
              <div className="display" style={{ fontSize: 20, fontWeight: 600 }}>
                {selectedKey === todayKey() ? "Today" : new Date(selectedKey + "T00:00:00").toLocaleDateString(undefined, { weekday: "long" })}
                <span className="mono" style={{ fontSize: 13, color: COLORS.muted, marginLeft: 8 }}>
                  {new Date(selectedKey + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
              <button onClick={openAdd} style={{
                display: "flex", alignItems: "center", gap: 6, background: COLORS.study,
                border: "none", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 12.5, fontWeight: 700,
              }}>
                <Plus size={14} /> Add task
              </button>
            </div>

            {/* today's balance readout */}
            <div className="mono" style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 8, marginBottom: 4, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <span>Sleep {hoursToLabel(totals.sleep)}</span>
              <span>Study {hoursToLabel(totals.study)}</span>
              <span>Other {hoursToLabel(totals.other)}</span>
              {selectedDay.blocks.length > 0 && <span>{completedCount}/{selectedDay.blocks.length} done</span>}
              {revisionsToday > 0 && <span>↻ {revisionsToday} revision{revisionsToday > 1 ? "s" : ""} today</span>}
              <button onClick={() => setEditingSleep(s => !s)} className="icon-btn" style={{ background: "none", border: "none", color: COLORS.sleep, borderRadius: 4, padding: "2px 4px", display: "flex", alignItems: "center", gap: 3, fontSize: 11 }}>
                <Pencil size={10} /> edit sleep
              </button>
            </div>
            {editingSleep && (
              <SleepEditor
                start={selectedDay.sleepStart ?? DEFAULT_SLEEP.start}
                end={selectedDay.sleepEnd ?? DEFAULT_SLEEP.end}
                onSave={(s, e) => saveSleep(selectedKey, s, e)}
                onClose={() => setEditingSleep(false)}
              />
            )}

            {shortfall && selectedDay.blocks.length > 0 && (
              <div className="fade-in" style={{
                display: "flex", gap: 8, alignItems: "flex-start", background: `${COLORS.study}0F`,
                border: `1px solid ${COLORS.study}33`, borderRadius: 10, padding: "10px 12px", marginTop: 14, marginBottom: 4, fontSize: 12.5,
              }}>
                <AlertTriangle size={14} color={COLORS.study} style={{ marginTop: 1, flexShrink: 0 }} />
                <div><b>Study is under the 8h target today.</b> {shortfall} This isn't a missed goal — sleep and fixed time are protected first.</div>
              </div>
            )}

            {formMode === "add" && (
              <TaskForm initial={blankForm()} isEdit={false} onClose={closeForm}
                onSubmit={f => { addTask(selectedKey, f); closeForm(); }} />
            )}
            {formMode === "edit" && editingBlock && (
              <TaskForm initial={formFromBlock(editingBlock)} isEdit onClose={closeForm}
                onSubmit={f => { editTask(selectedKey, editingBlock.id, f); closeForm(); }} />
            )}

            <div style={{ marginTop: 14 }}>
              {sorted.length === 0 ? (
                <div style={{
                  border: `1px dashed ${COLORS.line}`, borderRadius: 12, padding: "28px 16px",
                  textAlign: "center", color: COLORS.muted, fontSize: 13,
                }}>
                  Nothing planned yet for this day.<br />
                  <button onClick={openAdd} style={{ marginTop: 10, background: "none", border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "7px 14px", fontSize: 12.5, color: COLORS.text, fontWeight: 600 }}>
                    Add your first task
                  </button>
                </div>
              ) : sorted.map(b => (
                <TaskRow key={b.id} b={b}
                  missed={isPastSelected && !!b.revision && !b.completed}
                  onToggle={() => toggleTask(selectedKey, b.id)}
                  onEdit={() => openEdit(b.id)}
                  onDelete={() => deleteBlock(selectedKey, b)}
                />
              ))}
            </div>
          </div>

          {/* Right rail */}
          <div style={{ flex: "1 1 260px", minWidth: 260, position: "sticky", top: 20 }}>
            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: "0 2px 10px rgba(33,30,23,0.05)" }}>
              <div className="mono" style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1, marginBottom: 10 }}>WHAT SHOULD I DO NOW</div>
              {nextUp ? (
                <>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{nextUp.label}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    <PriorityTag p={nextUp.priority} />
                    <EnergyTag e={nextUp.energy} />
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>
                    {fmtHM(nextUp.start)} · {fmtDur(nextUp.duration)}
                  </div>
                  <button onClick={() => toggleTask(selectedKey, nextUp.id)} style={{
                    width: "100%", background: COLORS.study, color: "#FFFFFF", border: "none",
                    borderRadius: 8, padding: "9px 12px", fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>Mark complete <ChevronRight size={14} /></button>
                </>
              ) : selectedDay.blocks.length > 0 ? (
                <div style={{ fontSize: 13, color: COLORS.muted }}>Everything on this day is done. Nice work.</div>
              ) : (
                <div style={{ fontSize: 13, color: COLORS.muted }}>Add a task to this day to see what's up next.</div>
              )}
            </div>

            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 16, boxShadow: "0 2px 10px rgba(33,30,23,0.05)" }}>
              <div className="mono" style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1, marginBottom: 10 }}>1-4-7 REVISION ENGINE</div>
              <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.5, marginBottom: 12 }}>
                Tick <b>"Start a 1-4-7 revision cycle"</b> when adding a study task, and its
                Day 4 and Day 7 revisions get placed on the calendar automatically.
              </div>
              {revisionScan.activeCycles > 0 ? (
                <>
                  <div className="mono" style={{ fontSize: 11, color: COLORS.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <RotateCcw size={12} color={COLORS.revision} /> {revisionScan.activeCycles} active cycle{revisionScan.activeCycles > 1 ? "s" : ""}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {revisionScan.upcoming.map(({ key, block }) => (
                      <button key={block.id} onClick={() => jumpTo(key)} style={{
                        display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center",
                        background: "none", border: `1px solid ${COLORS.line}`, borderRadius: 8,
                        padding: "6px 9px", textAlign: "left",
                      }}>
                        <span style={{ fontSize: 12, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{block.label}</span>
                        <span className="mono" style={{ fontSize: 10.5, color: COLORS.muted, flexShrink: 0 }}>
                          {key === todayKey() ? "Today" : new Date(key + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: COLORS.muted }}>No active revision cycles yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}