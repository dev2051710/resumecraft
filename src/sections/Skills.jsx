import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '../components/Field';
import EntryCard, { AddButton } from '../components/EntryCard';
import { moveItem, newSkillGroup } from '../utils/resumeHelpers';

function SkillAdder({ onAdd }) {
  const [text, setText] = useState('');
  const commit = () => {
    const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) onAdd(parts);
    setText('');
  };
  return (
    <div className="flex gap-2">
      <input
        className="input"
        value={text}
        placeholder="Type a skill and press Enter (use commas to add several)"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
      />
      <button type="button" className="btn-ghost shrink-0" onClick={commit} aria-label="Add skill">
        <Plus size={16} />
      </button>
    </div>
  );
}

export default function Skills({ items, onChange }) {
  const set = (i, patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <>
      {items.length === 0 && <p className="text-sm text-zinc-500">Group your skills into categories such as Languages, Frameworks or Tools.</p>}
      {items.map((g, i) => (
        <EntryCard key={g.id} title={g.category || 'Skill category'} index={i} count={items.length} onMove={(d) => onChange(moveItem(items, i, d))} onRemove={() => onChange(items.filter((_, k) => k !== i))} needsConfirm={g.items.length > 0}>
          <Input label="Category" value={g.category} onChange={(e) => set(i, { category: e.target.value })} placeholder="e.g. Programming Languages" />
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((s, k) => (
              <span key={`${s}-${k}`} className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 py-1 pl-3 pr-1.5 text-xs text-violet-200">
                {s}
                <button type="button" className="rounded-full p-0.5 hover:bg-accent/30" aria-label={`Remove ${s}`} onClick={() => set(i, { items: g.items.filter((_, x) => x !== k) })}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <SkillAdder onAdd={(parts) => set(i, { items: [...g.items, ...parts.filter((p) => !g.items.some((s) => s.toLowerCase() === p.toLowerCase()))] })} />
        </EntryCard>
      ))}
      <AddButton onClick={() => onChange([...items, newSkillGroup()])}>Add Skill Category</AddButton>
    </>
  );
}
