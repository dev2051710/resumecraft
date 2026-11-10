import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = true, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="card w-full max-w-md p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-500/10 text-red-400' : 'bg-accent/10 text-accent'}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
