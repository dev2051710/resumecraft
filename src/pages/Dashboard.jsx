import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, LayoutTemplate, Upload, ArrowRight, Search, FilePlus2 } from 'lucide-react';
import { useResumes } from '../context/ResumeContext';
import ResumeCard from '../components/ResumeCard';
import { ProgressRing } from '../components/ProgressIndicator';
import { TEMPLATES } from '../templates';
import { completion } from '../utils/resumeHelpers';

export default function Dashboard({ view = 'home' }) {
  const { resumes, createResume, importFile } = useResumes();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [query, setQuery] = useState('');

  const sorted = [...resumes].sort((a, b) => b.updatedAt - a.updatedAt);
  const latest = sorted[0];
  const pct = latest ? completion(latest) : 0;

  const onImport = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const ids = await importFile(file);
    if (ids.length === 1) navigate(`/editor/${ids[0]}`);
  };

  const importInput = <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} />;

  const empty = (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <FilePlus2 size={26} />
      </span>
      <h3 className="text-lg font-semibold">No resumes yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">Create your first resume or import one from a JSON file you exported earlier.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link to="/create" className="btn-primary">
          <Plus size={16} /> Create New Resume
        </Link>
        <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Import JSON
        </button>
      </div>
    </div>
  );

  if (view === 'resumes') {
    const list = sorted.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
    return (
      <div className="mx-auto max-w-6xl p-5 sm:p-8">
        {importInput}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Resumes</h1>
            <p className="text-sm text-muted">{resumes.length} saved in this browser</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Import
            </button>
            <Link to="/create" className="btn-primary">
              <Plus size={16} /> New
            </Link>
          </div>
        </div>
        {resumes.length > 0 && (
          <div className="relative mb-5 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input className="input !pl-9" placeholder="Search resumes…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        )}
        {resumes.length === 0 ? empty : list.length === 0 ? <p className="text-sm text-muted">No resume matches “{query}”.</p> : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((r) => (
              <ResumeCard key={r.id} resume={r} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      {importInput}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-accent/20 via-card to-accent2/10 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-violet-200">Free · Private · No sign-up</span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Build a Resume That Gets Noticed</h1>
          <p className="mt-3 text-base text-muted sm:text-lg">Create a professional, ATS-friendly resume in minutes.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/create" className="btn-primary !px-5 !py-2.5">
              <Plus size={18} /> Create New Resume
            </Link>
            <button className="btn-ghost !px-5 !py-2.5" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Import JSON
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link to="/create" className="card group p-5 transition hover:border-accent/60">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Plus size={20} />
          </span>
          <h3 className="mt-4 font-semibold">Create New Resume</h3>
          <p className="mt-1 text-sm text-muted">Start from a blank resume.</p>
        </Link>
        <Link to="/resumes" className="card p-5 transition hover:border-accent/60">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent2/10 text-accent2">
            <FolderOpen size={20} />
          </span>
          <div className="mt-4 text-3xl font-bold">{resumes.length}</div>
          <p className="text-sm text-muted">My Saved Resume{resumes.length === 1 ? '' : 's'}</p>
        </Link>
        <Link to="/templates" className="card p-5 transition hover:border-accent/60">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <LayoutTemplate size={20} />
          </span>
          <div className="mt-4 text-3xl font-bold">{TEMPLATES.length}</div>
          <p className="text-sm text-muted">Available Templates</p>
        </Link>
        <div className="card flex items-center gap-4 p-5">
          <ProgressRing value={pct} size={72} />
          <div>
            <h3 className="font-semibold">Completion</h3>
            <p className="text-sm text-muted">{latest ? `of “${latest.name}”` : 'Create a resume to track progress'}</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent resumes</h2>
          {resumes.length > 0 && (
            <Link to="/resumes" className="flex items-center gap-1 text-sm text-muted hover:text-ink">
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>
        {resumes.length === 0 ? empty : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sorted.slice(0, 4).map((r) => (
              <ResumeCard key={r.id} resume={r} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Resume templates</h2>
          <Link to="/templates" className="flex items-center gap-1 text-sm text-muted hover:text-ink">
            Browse all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {TEMPLATES.map((t) => (
            <Link key={t.id} to={`/create?template=${t.id}`} className="card p-4 transition hover:border-accent/60">
              <h3 className="text-sm font-semibold">{t.name}</h3>
              <p className="mt-1 text-xs text-muted">{t.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
                Use template <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
