import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, LayoutTemplate, Settings, Plus, X, ShieldCheck, FileText } from 'lucide-react';
import { useResumes } from '../context/ResumeContext';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent2 shadow-lg shadow-accent/30">
        <FileText size={18} className="text-white" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Resume<span className="text-accent">Craft</span>
      </span>
    </Link>
  );
}

const LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/resumes', label: 'My Resumes', icon: FolderOpen },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { resumes } = useResumes();
  const recent = [...resumes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-line bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button className="icon-btn lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="px-4">
          <Link to="/create" onClick={onClose} className="btn-primary w-full">
            <Plus size={16} /> Create New Resume
          </Link>
        </div>

        <nav className="mt-5 space-y-1 px-3">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-accent/10 text-ink ring-1 ring-accent/30' : 'text-muted hover:bg-zinc-800/60 hover:text-ink'}`}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {recent.length > 0 && (
          <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Recent</div>
            <div className="space-y-0.5">
              {recent.map((r) => (
                <Link key={r.id} to={`/editor/${r.id}`} onClick={onClose} className="block truncate rounded-md px-2 py-1.5 text-sm text-muted hover:bg-zinc-800/60 hover:text-ink">
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto p-4">
          <div className="flex items-start gap-2 rounded-lg border border-line bg-card p-3 text-xs text-muted">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-400" />
            Private by design. Your resume data never leaves this browser.
          </div>
        </div>
      </aside>
    </>
  );
}
