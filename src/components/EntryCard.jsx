import { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function EntryCard({ title, index, count, onMove, onRemove, needsConfirm = false, children }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="rounded-lg border border-line bg-canvas/60 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted">{title || `Entry ${index + 1}`}</span>
        <div className="flex shrink-0 items-center">
          <button type="button" className="icon-btn" disabled={index === 0} onClick={() => onMove(-1)} title="Move up" aria-label="Move up">
            <ArrowUp size={15} />
          </button>
          <button type="button" className="icon-btn" disabled={index === count - 1} onClick={() => onMove(1)} title="Move down" aria-label="Move down">
            <ArrowDown size={15} />
          </button>
          <button type="button" className="icon-btn hover:!text-red-400" onClick={() => (needsConfirm ? setConfirm(true) : onRemove())} title="Remove" aria-label="Remove entry">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
      <ConfirmDialog
        open={confirm}
        title="Remove this entry?"
        message="The entry and everything you typed in it will be deleted."
        confirmLabel="Remove"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onRemove();
        }}
      />
    </div>
  );
}

export function AddButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="btn-ghost w-full border-dashed text-muted hover:text-ink">
      <span className="text-lg leading-none">+</span> {children}
    </button>
  );
}
