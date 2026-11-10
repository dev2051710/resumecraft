import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { createResume as makeResume, normalizeResume, downloadJson, safeName, uid, emptyData, defaultVisibility, SECTION_KEYS } from '../utils/resumeHelpers';

const Ctx = createContext(null);

export function useResumes() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useResumes must be used inside <ResumeProvider>');
  return c;
}

const DEFAULT_SETTINGS = { defaultTemplate: 'modern', showGuides: true };
const sanitizeResumes = (list) =>
  Array.isArray(list) ? list.filter((r) => r && typeof r === 'object' && r.id && r.data).map((r) => normalizeResume(r, true)) : [];

export function ResumeProvider({ children }) {
  const store = useLocalStorage('resumecraft:resumes:v1', [], { sanitize: sanitizeResumes });
  const prefs = useLocalStorage('resumecraft:settings:v1', DEFAULT_SETTINGS);
  const { value: resumes, setValue: setResumes } = store;
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...(prefs.value || {}) }), [prefs.value]);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = uid();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const updateResume = useCallback(
    (id, fn) => setResumes((list) => list.map((r) => (r.id === id ? { ...fn(r), updatedAt: Date.now() } : r))),
    [setResumes]
  );

  const createResume = useCallback(
    (opts = {}) => {
      const r = makeResume({ template: opts.template || settings.defaultTemplate, name: opts.name });
      setResumes((list) => [r, ...list]);
      return r.id;
    },
    [setResumes, settings.defaultTemplate]
  );

  const duplicateResume = useCallback(
    (id) => {
      const src = resumes.find((r) => r.id === id);
      if (!src) return null;
      const copy = normalizeResume({ ...src, name: `${src.name} (Copy)` });
      setResumes((list) => [copy, ...list]);
      toast('Resume duplicated');
      return copy.id;
    },
    [resumes, setResumes, toast]
  );

  const deleteResume = useCallback(
    (id) => {
      setResumes((list) => list.filter((r) => r.id !== id));
      toast('Resume deleted');
    },
    [setResumes, toast]
  );

  const clearResume = useCallback(
    (id) => {
      updateResume(id, (r) => ({ ...r, data: emptyData(), visibility: defaultVisibility(), order: [...SECTION_KEYS] }));
      toast('Resume cleared');
    },
    [updateResume, toast]
  );

  const importData = useCallback(
    (obj) => {
      const list = Array.isArray(obj?.resumes) ? obj.resumes : obj?.resume ? [obj.resume] : obj?.data ? [obj] : [];
      if (!list.length) throw new Error('This file does not look like a ResumeCraft export.');
      const imported = list.map((r) => normalizeResume(r));
      setResumes((l) => [...imported, ...l]);
      return imported.map((r) => r.id);
    },
    [setResumes]
  );

  const importFile = useCallback(
    async (file) => {
      try {
        const text = await file.text();
        const ids = importData(JSON.parse(text));
        toast(`Imported ${ids.length} resume${ids.length > 1 ? 's' : ''}`);
        return ids;
      } catch (e) {
        toast(e instanceof SyntaxError ? 'That file is not valid JSON.' : e.message || 'Import failed.', 'error');
        return [];
      }
    },
    [importData, toast]
  );

  const exportResume = useCallback(
    (id) => {
      const r = resumes.find((x) => x.id === id);
      if (!r) return;
      downloadJson(`${safeName(r.name)}.json`, { app: 'ResumeCraft', version: 1, exportedAt: new Date().toISOString(), resume: r });
      toast('Resume exported as JSON');
    },
    [resumes, toast]
  );

  const exportAll = useCallback(() => {
    downloadJson('ResumeCraft_backup.json', { app: 'ResumeCraft', version: 1, exportedAt: new Date().toISOString(), resumes });
    toast('Backup exported');
  }, [resumes, toast]);

  const deleteAll = useCallback(() => {
    setResumes([]);
    toast('All resumes deleted');
  }, [setResumes, toast]);

  const updateSettings = useCallback((patch) => prefs.setValue((s) => ({ ...DEFAULT_SETTINGS, ...s, ...patch })), [prefs]);

  const saveNow = useCallback(() => {
    const ok = store.flush() && prefs.flush();
    toast(ok ? 'Saved to this browser' : 'Could not save – browser storage is full or blocked', ok ? 'success' : 'error');
  }, [store, prefs, toast]);

  const value = {
    resumes,
    settings,
    updateSettings,
    createResume,
    updateResume,
    duplicateResume,
    deleteResume,
    clearResume,
    importFile,
    exportResume,
    exportAll,
    deleteAll,
    saveNow,
    savedAt: store.savedAt,
    storageError: store.error,
    toasts,
    toast,
    dismissToast,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
