import { Select, Textarea } from '../components/Field';
import EntryCard, { AddButton } from '../components/EntryCard';
import { ACHIEVEMENT_TYPES, moveItem, newAchievement } from '../utils/resumeHelpers';

export default function Achievements({ items, onChange }) {
  const set = (i, patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <>
      {items.length === 0 && <p className="text-sm text-zinc-500">Add achievements, leadership roles, extracurriculars or volunteer work.</p>}
      {items.map((a, i) => (
        <EntryCard key={a.id} title={a.type} index={i} count={items.length} onMove={(d) => onChange(moveItem(items, i, d))} onRemove={() => onChange(items.filter((_, k) => k !== i))} needsConfirm={!!a.text.trim()}>
          <Select label="Type" options={ACHIEVEMENT_TYPES} value={a.type} onChange={(e) => set(i, { type: e.target.value })} />
          <Textarea label="Description" rows={2} value={a.text} onChange={(e) => set(i, { text: e.target.value })} placeholder="What you did and why it mattered" />
        </EntryCard>
      ))}
      <AddButton onClick={() => onChange([...items, newAchievement()])}>Add Entry</AddButton>
    </>
  );
}
