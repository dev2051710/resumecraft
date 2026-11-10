import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { SUMMARY_EXAMPLES, ACTION_VERBS, BULLET_FORMULA, BULLET_EXAMPLES, PROJECT_TIPS, COMMON_MISTAKES } from '../utils/writingTips';

const TABS = [
  ['summary', 'Summaries'],
  ['verbs', 'Action verbs'],
  ['bullets', 'Bullet points'],
  ['projects', 'Projects'],
  ['mistakes', 'Mistakes'],
];

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button type="button" onClick={copy} className="icon-btn shrink-0" title="Copy" aria-label="Copy">
      {done ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
    </button>
  );
}

export default function WritingAssistant({ onInsertSummary }) {
  const [tab, setTab] = useState('summary');
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">Built-in guidance – nothing here is sent anywhere. Replace anything in [brackets] with your real details.</p>
      <div className="flex flex-wrap gap-1.5">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${tab === k ? 'bg-accent text-white' : 'bg-zinc-800 text-muted hover:text-ink'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'summary' &&
        SUMMARY_EXAMPLES.map((s) => (
          <div key={s.label} className="card p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-accent">{s.label}</span>
              <div className="flex items-center">
                {onInsertSummary && (
                  <button type="button" className="rounded px-2 py-1 text-xs text-muted hover:bg-zinc-800 hover:text-ink" onClick={() => onInsertSummary(s.text)}>
                    Use as my summary
                  </button>
                )}
                <CopyButton text={s.text} />
              </div>
            </div>
            <p className="text-sm text-zinc-300">{s.text}</p>
          </div>
        ))}

      {tab === 'verbs' &&
        Object.entries(ACTION_VERBS).map(([group, verbs]) => (
          <div key={group} className="card p-3">
            <div className="mb-2 text-xs font-semibold text-accent">{group}</div>
            <div className="flex flex-wrap gap-1.5">
              {verbs.map((v) => (
                <span key={v} className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-200">
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}

      {tab === 'bullets' && (
        <>
          <div className="card border-accent/40 bg-accent/5 p-3 text-sm">
            <span className="font-semibold text-accent">Formula: </span>
            {BULLET_FORMULA}
          </div>
          <p className="text-xs text-zinc-500">Examples – only use numbers that are true for you.</p>
          {BULLET_EXAMPLES.map((b) => (
            <div key={b} className="card flex items-start justify-between gap-2 p-3">
              <p className="text-sm text-zinc-300">{b}</p>
              <CopyButton text={b} />
            </div>
          ))}
        </>
      )}

      {tab === 'projects' && (
        <ul className="card space-y-2 p-4 text-sm text-zinc-300">
          {PROJECT_TIPS.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-accent">•</span>
              {t}
            </li>
          ))}
        </ul>
      )}

      {tab === 'mistakes' && (
        <ul className="card space-y-2 p-4 text-sm text-zinc-300">
          {COMMON_MISTAKES.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-red-400">✕</span>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
