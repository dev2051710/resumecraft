import { useState } from 'react';
import { ChevronDown, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

export default function FormSection({ icon: Icon, title, count, defaultOpen = false, hideable = false, visible = true, onToggleVisible, onMove, canUp = false, canDown = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`card overflow-hidden transition ${visible ? '' : 'opacity-70'}`}>
      <div className="flex items-center gap-1 pr-2">
        <button type="button" onClick={() => setOpen(!open)} className="flex flex-1 items-center gap-3 px-4 py-3 text-left" aria-expanded={open}>
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon size={16} />
            </span>
          )}
          <span className="text-sm font-semibold">{title}</span>
          {typeof count === 'number' && count > 0 && <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-muted">{count}</span>}
          {!visible && <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">Hidden</span>}
          <ChevronDown size={16} className={`ml-auto text-muted transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {onMove && (
          <>
            <button type="button" className="icon-btn" disabled={!canUp} onClick={() => onMove(-1)} title="Move section up" aria-label="Move section up">
              <ArrowUp size={15} />
            </button>
            <button type="button" className="icon-btn" disabled={!canDown} onClick={() => onMove(1)} title="Move section down" aria-label="Move section down">
              <ArrowDown size={15} />
            </button>
          </>
        )}
        {hideable && (
          <button type="button" className="icon-btn" onClick={() => onToggleVisible(!visible)} title={visible ? 'Hide from resume' : 'Show on resume'} aria-label="Toggle section visibility">
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>
      {open && <div className="space-y-3 border-t border-line p-4">{children}</div>}
    </div>
  );
}
