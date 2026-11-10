import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Printer, Download, FileJson, Copy, Eraser, Trash2, Loader2, Pencil, Eye } from 'lucide-react';
import { useResumes } from '../context/ResumeContext';
import ResumeEditor from '../components/ResumeEditor';
import ResumePreview from '../components/ResumePreview';
import ConfirmDialog from '../components/ConfirmDialog';
import { TEMPLATES } from '../templates';
import { TEMPLATE_IDS } from '../utils/resumeHelpers';
import { exportResumePdf, printResume } from '../utils/pdfExport';

export default function CreateResume() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { resumes, settings, createResume, updateResume, duplicateResume, deleteResume, clearResume, exportResume, saveNow, savedAt, storageError, toast } = useResumes();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null); // 'clear' | 'delete'
  const [mobileTab, setMobileTab] = useState('edit');
  const created = useRef(false);

  // /create -> make a new resume and redirect to its editor (guarded against StrictMode double-run)
  useEffect(() => {
    if (id || created.current) return;
    created.current = true;
    const tpl = params.get('template');
    const newId = createResume({ template: TEMPLATE_IDS.includes(tpl) ? tpl : undefined });
    navigate(`/editor/${newId}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = resumes.find((r) => r.id === id);

  if (!id) return <div className="p-8 text-sm text-muted">Creating your resume…</div>;
  if (!resume) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="text-xl font-semibold">Resume not found</h1>
        <p className="mt-2 text-sm text-muted">It may have been deleted, or it was saved in a different browser.</p>
        <Link to="/resumes" className="btn-primary mt-5">
          Go to My Resumes
        </Link>
      </div>
    );
  }

  const onPdf = async () => {
    setBusy(true);
    try {
      await exportResumePdf(resume);
      toast('PDF downloaded');
    } catch (e) {
      console.error(e);
      toast('Could not generate the PDF. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const savedLabel = storageError
    ? 'Storage error – export a backup'
    : savedAt
      ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : 'Autosave on';

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-sidebar px-3 py-2.5 sm:px-4">
        <Link to="/resumes" className="icon-btn" aria-label="Back to my resumes" title="Back">
          <ArrowLeft size={18} />
        </Link>
        <input
          className="input !w-44 !py-1.5 font-medium sm:!w-56"
          value={resume.name}
          onChange={(e) => updateResume(resume.id, (r) => ({ ...r, name: e.target.value }))}
          aria-label="Resume name"
          placeholder="Resume name"
        />
        <select
          className="input !w-auto !py-1.5"
          value={resume.template}
          onChange={(e) => updateResume(resume.id, (r) => ({ ...r, template: e.target.value }))}
          aria-label="Template"
        >
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <span className={`hidden text-xs md:inline ${storageError ? 'text-red-400' : 'text-zinc-500'}`}>{savedLabel}</span>

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <button className="btn-ghost !px-2.5 !py-1.5" onClick={saveNow} title="Save now">
            <Save size={16} /> <span className="hidden xl:inline">Save</span>
          </button>
          <button className="icon-btn" onClick={() => exportResume(resume.id)} title="Export JSON" aria-label="Export JSON">
            <FileJson size={17} />
          </button>
          <button
            className="icon-btn"
            onClick={() => {
              const nid = duplicateResume(resume.id);
              if (nid) navigate(`/editor/${nid}`);
            }}
            title="Duplicate"
            aria-label="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button className="icon-btn hover:!text-amber-300" onClick={() => setConfirm('clear')} title="Clear resume" aria-label="Clear resume">
            <Eraser size={17} />
          </button>
          <button className="icon-btn hover:!text-red-400" onClick={() => setConfirm('delete')} title="Delete resume" aria-label="Delete resume">
            <Trash2 size={16} />
          </button>
          <button className="btn-ghost !px-2.5 !py-1.5" onClick={printResume} title="Print resume">
            <Printer size={16} /> <span className="hidden xl:inline">Print</span>
          </button>
          <button className="btn-primary !px-3 !py-1.5" onClick={onPdf} disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span className="hidden sm:inline">{busy ? 'Generating…' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-line bg-sidebar lg:hidden">
        {[
          ['edit', 'Edit', Pencil],
          ['preview', 'Preview', Eye],
        ].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setMobileTab(k)} className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium ${mobileTab === k ? 'border-b-2 border-accent text-ink' : 'text-muted'}`}>
            <Icon size={15} /> {l}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(380px,5fr)_7fr]">
        <div className={`${mobileTab === 'edit' ? 'block' : 'hidden'} min-h-0 border-r border-line lg:block`}>
          <ResumeEditor resume={resume} />
        </div>
        <div className={`${mobileTab === 'preview' ? 'block' : 'hidden'} min-h-0 lg:block`}>
          <ResumePreview resume={resume} showGuides={settings.showGuides} />
        </div>
      </div>

      <ConfirmDialog
        open={confirm === 'clear'}
        title="Clear this resume?"
        message="All content in this resume will be erased (the name and template are kept). This cannot be undone – export it as JSON first if you may need it."
        confirmLabel="Clear resume"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          clearResume(resume.id);
        }}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        title={`Delete “${resume.name}”?`}
        message="This permanently removes the resume from this browser."
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          deleteResume(resume.id);
          navigate('/resumes');
        }}
      />
    </div>
  );
}
