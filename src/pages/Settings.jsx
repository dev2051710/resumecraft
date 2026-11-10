import { useRef, useState } from 'react';
import { Download, Upload, Trash2, ShieldCheck } from 'lucide-react';
import { useResumes } from '../context/ResumeContext';
import { TEMPLATES } from '../templates';
import ConfirmDialog from '../components/ConfirmDialog';
import { Toggle } from '../components/Field';

export default function Settings() {
  const { resumes, settings, updateSettings, exportAll, importFile, deleteAll, saveNow, storageError } = useResumes();
  const fileRef = useRef(null);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-5 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">Preferences and data management. Everything is stored in this browser only.</p>
      </div>

      {storageError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          Your browser refused to save data (storage may be full or blocked). Export a JSON backup so you don’t lose your work.
        </div>
      )}

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Preferences</h2>
        <div>
          <label className="label">Default template for new resumes</label>
          <select className="input max-w-xs" value={settings.defaultTemplate} onChange={(e) => updateSettings({ defaultTemplate: e.target.value })}>
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <Toggle label="Show page-break guides in the live preview" checked={settings.showGuides} onChange={(v) => updateSettings({ showGuides: v })} />
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Your data</h2>
        <p className="text-sm text-muted">{resumes.length} resume{resumes.length === 1 ? '' : 's'} stored in this browser.</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={saveNow}>
            Save now
          </button>
          <button className="btn-ghost" disabled={!resumes.length} onClick={exportAll}>
            <Download size={16} /> Export all (JSON)
          </button>
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              e.target.value = '';
              if (f) importFile(f);
            }}
          />
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShieldCheck size={18} className="text-emerald-400" /> Privacy
        </h2>
        <p className="text-sm text-muted">
          ResumeCraft has no backend, no accounts and no analytics. Resumes are saved in your browser’s localStorage and PDFs are generated on your device. Clearing your browser data or using another browser or device will not carry your resumes over, so export a JSON backup regularly.
        </p>
      </section>

      <section className="card space-y-3 border-red-500/20 p-5">
        <h2 className="font-semibold text-red-300">Danger zone</h2>
        <p className="text-sm text-muted">Permanently delete every resume stored in this browser.</p>
        <button className="btn-danger" disabled={!resumes.length} onClick={() => setConfirm(true)}>
          <Trash2 size={16} /> Delete all resumes
        </button>
      </section>

      <ConfirmDialog
        open={confirm}
        title="Delete all resumes?"
        message={`This permanently removes all ${resumes.length} resume(s) from this browser. Export a backup first if you may need them.`}
        confirmLabel="Delete everything"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          deleteAll();
        }}
      />
    </div>
  );
}
