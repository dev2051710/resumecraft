import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../templates';
import { SAMPLE_RESUME } from '../utils/resumeHelpers';
import { useResumes } from '../context/ResumeContext';
import MiniPreview from '../components/MiniPreview';

export default function Templates() {
  const { settings, updateSettings, toast } = useResumes();
  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Resume Templates</h1>
      <p className="mt-1 text-sm text-muted">Pick a starting point. You can switch templates at any time – your content is never lost. Previews show sample content only.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TEMPLATES.map((t) => {
          const isDefault = settings.defaultTemplate === t.id;
          return (
            <div key={t.id} className="card flex flex-col overflow-hidden">
              <div className="bg-zinc-950/60 p-4">
                <MiniPreview resume={{ ...SAMPLE_RESUME, template: t.id }} />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted">{t.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-zinc-400">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-400" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2 pt-1">
                  <Link to={`/create?template=${t.id}`} className="btn-primary flex-1 !py-2 text-xs">
                    Use template <ArrowRight size={14} />
                  </Link>
                  <button
                    className="btn-ghost !py-2 text-xs"
                    disabled={isDefault}
                    onClick={() => {
                      updateSettings({ defaultTemplate: t.id });
                      toast(`${t.name} is now your default template`);
                    }}
                  >
                    {isDefault ? 'Default' : 'Set default'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
