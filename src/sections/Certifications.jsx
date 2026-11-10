import { Input } from '../components/Field';
import EntryCard, { AddButton } from '../components/EntryCard';
import { isValidUrl, moveItem, newCertification } from '../utils/resumeHelpers';

export default function Certifications({ items, onChange }) {
  const set = (i, patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <>
      {items.length === 0 && <p className="text-sm text-zinc-500">No certifications added yet.</p>}
      {items.map((c, i) => (
        <EntryCard key={c.id} title={c.name} index={i} count={items.length} onMove={(d) => onChange(moveItem(items, i, d))} onRemove={() => onChange(items.filter((_, k) => k !== i))} needsConfirm={!!c.name}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Certificate name" value={c.name} onChange={(e) => set(i, { name: e.target.value })} placeholder="Certificate name" />
            <Input label="Issuing organization" value={c.org} onChange={(e) => set(i, { org: e.target.value })} placeholder="Organization" />
            <Input label="Issue date" type="month" value={c.date} onChange={(e) => set(i, { date: e.target.value })} />
            <Input label="Credential URL (optional)" value={c.url} onChange={(e) => set(i, { url: e.target.value })} placeholder="verify.example.com/abc" error={c.url && !isValidUrl(c.url) ? 'Enter a valid URL' : ''} />
          </div>
        </EntryCard>
      ))}
      <AddButton onClick={() => onChange([...items, newCertification()])}>Add Certification</AddButton>
    </>
  );
}
