import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Download, Trash2, Pencil } from 'lucide-react';
import { useResumes } from '../context/ResumeContext';
import { getTemplate } from '../templates';
import { completion } from '../utils/resumeHelpers';
import MiniPreview from './MiniPreview';
import ProgressIndicator from './ProgressIndicator';
import ConfirmDialog from './ConfirmDialog';

export default function ResumeCard({ resume }) {
  const { duplicateResume, deleteResume, exportResume } = useResumes();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const pct = completion(resume);

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:border-zinc-600">
      <Link to={`/editor/${resume.id}`} className="block bg-zinc-950/60 p-4 pb-0">
        <div className="overflow-hidden rounded-t-md shadow-lg shadow-black/40 transition group-hover:-translate-y-0.5" style={{ maxHeight: 210 }}>
          <MiniPreview resume={resume} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link to={`/editor/${resume.id}`} className="block truncate font-semibold hover:text-accent">
            {resume.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted">
            {getTemplate(resume.template).name} · Edited {new Date(resume.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <ProgressIndicator value={pct} label="Completion" />
        <div className="mt-auto flex items-center gap-1">
          <button className="btn-ghost flex-1 !py-1.5 text-xs" onClick={() => navigate(`/editor/${resume.id}`)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="icon-btn" title="Duplicate" aria-label="Duplicate" onClick={() => duplicateResume(resume.id)}>
            <Copy size={15} />
          </button>
          <button className="icon-btn" title="Export JSON" aria-label="Export JSON" onClick={() => exportResume(resume.id)}>
            <Download size={15} />
          </button>
          <button className="icon-btn hover:!text-red-400" title="Delete" aria-label="Delete" onClick={() => setConfirm(true)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={confirm}
        title={`Delete “${resume.name}”?`}
        message="This permanently removes the resume from this browser. Export it as JSON first if you may need it again."
        confirmLabel="Delete"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          deleteResume(resume.id);
        }}
      />
    </div>
  );
}
