import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useResumes } from '../context/ResumeContext';

export default function Toasts() {
  const { toasts, dismissToast } = useResumes();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-2 rounded-lg border border-line bg-card px-3 py-2.5 text-sm shadow-xl" role="status">
          {t.type === 'error' ? <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />}
          <span className="flex-1">{t.message}</span>
          <button className="text-muted hover:text-ink" onClick={() => dismissToast(t.id)} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
