import { Input, Textarea, Toggle } from '../components/Field';
import EntryCard, { AddButton } from '../components/EntryCard';
import { moveItem, newEducation } from '../utils/resumeHelpers';

export default function Education({ items, onChange }) {
  const set = (i, patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <>
      {items.length === 0 && <p className="text-sm text-zinc-500">No education added yet.</p>}
      {items.map((e, i) => (
        <EntryCard key={e.id} title={e.degree || e.school} index={i} count={items.length} onMove={(d) => onChange(moveItem(items, i, d))} onRemove={() => onChange(items.filter((_, k) => k !== i))} needsConfirm={!!(e.degree || e.school || e.description)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Degree" value={e.degree} onChange={(ev) => set(i, { degree: ev.target.value })} placeholder="B.Tech in Computer Science" />
            <Input label="College / University" value={e.school} onChange={(ev) => set(i, { school: ev.target.value })} placeholder="Institute name" />
            <Input label="Location" value={e.location} onChange={(ev) => set(i, { location: ev.target.value })} placeholder="City, State" />
            <Input label="CGPA or Percentage" value={e.grade} onChange={(ev) => set(i, { grade: ev.target.value })} placeholder="e.g. CGPA 8.2 / 10" />
            <Input label="Start date" type="month" value={e.start} onChange={(ev) => set(i, { start: ev.target.value })} />
            <Input label="End date (or expected)" type="month" value={e.end} disabled={e.current} onChange={(ev) => set(i, { end: ev.target.value })} />
          </div>
          <Toggle label="Currently studying (shows “Present”)" checked={e.current} onChange={(v) => set(i, { current: v })} />
          <Textarea label="Description (optional)" value={e.description} onChange={(ev) => set(i, { description: ev.target.value })} placeholder="Relevant coursework, honors… (one per line for bullets)" />
        </EntryCard>
      ))}
      <AddButton onClick={() => onChange([...items, newEducation()])}>Add Education</AddButton>
    </>
  );
}
