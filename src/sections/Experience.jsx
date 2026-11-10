import { Input, Textarea, Toggle } from '../components/Field';
import EntryCard, { AddButton } from '../components/EntryCard';
import { moveItem, newExperience } from '../utils/resumeHelpers';

export default function Experience({ items, onChange }) {
  const set = (i, patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <>
      {items.length === 0 && <p className="text-sm text-zinc-500">No experience added yet. Internships and freelance work count too.</p>}
      {items.map((e, i) => (
        <EntryCard key={e.id} title={[e.title, e.company].filter(Boolean).join(' @ ')} index={i} count={items.length} onMove={(d) => onChange(moveItem(items, i, d))} onRemove={() => onChange(items.filter((_, k) => k !== i))} needsConfirm={!!(e.title || e.company || e.responsibilities || e.achievements)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Job title" value={e.title} onChange={(ev) => set(i, { title: ev.target.value })} placeholder="Software Engineer Intern" />
            <Input label="Company name" value={e.company} onChange={(ev) => set(i, { company: ev.target.value })} placeholder="Company" />
            <Input label="Location" value={e.location} onChange={(ev) => set(i, { location: ev.target.value })} placeholder="City or Remote" />
            <div />
            <Input label="Start date" type="month" value={e.start} onChange={(ev) => set(i, { start: ev.target.value })} />
            <Input label="End date" type="month" value={e.end} disabled={e.current} onChange={(ev) => set(i, { end: ev.target.value })} />
          </div>
          <Toggle label="I currently work here (shows “Present”)" checked={e.current} onChange={(v) => set(i, { current: v })} />
          <Textarea label="Responsibilities" rows={4} value={e.responsibilities} onChange={(ev) => set(i, { responsibilities: ev.target.value })} placeholder={'One bullet per line, starting with an action verb\nBuilt…\nMaintained…'} />
          <Textarea label="Achievements" rows={3} value={e.achievements} onChange={(ev) => set(i, { achievements: ev.target.value })} placeholder="One per line – results you can back up" />
        </EntryCard>
      ))}
      <AddButton onClick={() => onChange([...items, newExperience()])}>Add Experience</AddButton>
    </>
  );
}
