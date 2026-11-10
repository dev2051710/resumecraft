import { Input, Textarea } from '../components/Field';
import EntryCard, { AddButton } from '../components/EntryCard';
import { isValidUrl, moveItem, newProject } from '../utils/resumeHelpers';

export default function Projects({ items, onChange }) {
  const set = (i, patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const err = (v) => (v && !isValidUrl(v) ? 'Enter a valid URL' : '');
  return (
    <>
      {items.length === 0 && <p className="text-sm text-zinc-500">No projects added yet.</p>}
      {items.map((p, i) => (
        <EntryCard key={p.id} title={p.name} index={i} count={items.length} onMove={(d) => onChange(moveItem(items, i, d))} onRemove={() => onChange(items.filter((_, k) => k !== i))} needsConfirm={!!(p.name || p.description)}>
          <Input label="Project name" value={p.name} onChange={(e) => set(i, { name: e.target.value })} placeholder="Project name" />
          <Textarea label="Project description" rows={4} value={p.description} onChange={(e) => set(i, { description: e.target.value })} placeholder="What it does, what you built, the outcome. One line per bullet." />
          <Input label="Technologies used" value={p.tech} onChange={(e) => set(i, { tech: e.target.value })} placeholder="React, Tailwind CSS, Python" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Project URL" value={p.url} onChange={(e) => set(i, { url: e.target.value })} placeholder="myproject.vercel.app" error={err(p.url)} />
            <Input label="GitHub URL" value={p.github} onChange={(e) => set(i, { github: e.target.value })} placeholder="github.com/username/repo" error={err(p.github)} />
          </div>
        </EntryCard>
      ))}
      <AddButton onClick={() => onChange([...items, newProject()])}>Add Project</AddButton>
    </>
  );
}
