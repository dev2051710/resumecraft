import { Check } from 'lucide-react';
import { TEMPLATES } from '../templates';
import { SAMPLE_RESUME } from '../utils/resumeHelpers';
import MiniPreview from './MiniPreview';

export default function TemplateSelector({ value, onChange, columns = 2 }) {
  return (
    <div>
      <div className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {TEMPLATES.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`group relative rounded-xl border p-2 text-left transition ${active ? 'border-accent bg-accent/10 ring-2 ring-accent/30' : 'border-line bg-card hover:border-zinc-600'}`}
            >
              <MiniPreview resume={{ ...SAMPLE_RESUME, template: t.id }} />
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-sm font-medium">{t.name}</span>
                {active && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={12} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-zinc-500">Thumbnails use sample content. Your own information is never lost when you switch templates.</p>
    </div>
  );
}
