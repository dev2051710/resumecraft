import { useState } from 'react';
import { User, GraduationCap, Wrench, Briefcase, FolderGit2, Award, Trophy } from 'lucide-react';
import { useResumes } from '../context/ResumeContext';
import FormSection from './FormSection';
import ProgressIndicator from './ProgressIndicator';
import TemplateSelector from './TemplateSelector';
import WritingAssistant from './WritingAssistant';
import PersonalInfo from '../sections/PersonalInfo';
import Education from '../sections/Education';
import Experience from '../sections/Experience';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Certifications from '../sections/Certifications';
import Achievements from '../sections/Achievements';
import { SECTION_LABELS, completion, getChecklist, moveItem } from '../utils/resumeHelpers';

const SECTION_META = {
  education: { icon: GraduationCap, Comp: Education },
  skills: { icon: Wrench, Comp: Skills },
  experience: { icon: Briefcase, Comp: Experience },
  projects: { icon: FolderGit2, Comp: Projects },
  certifications: { icon: Award, Comp: Certifications },
  achievements: { icon: Trophy, Comp: Achievements },
};

const TABS = [
  ['content', 'Content'],
  ['template', 'Template'],
  ['tips', 'Writing tips'],
];

export default function ResumeEditor({ resume }) {
  const { updateResume } = useResumes();
  const [tab, setTab] = useState('content');
  const id = resume.id;

  const setSection = (key, val) => updateResume(id, (r) => ({ ...r, data: { ...r.data, [key]: val } }));
  const setVis = (key, val) => updateResume(id, (r) => ({ ...r, visibility: { ...r.visibility, [key]: val } }));
  const moveSection = (key, dir) => updateResume(id, (r) => ({ ...r, order: moveItem(r.order, r.order.indexOf(key), dir) }));

  const pct = completion(resume);
  const missing = getChecklist(resume).filter((c) => !c.done).slice(0, 4);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex gap-1 border-b border-line px-3 pt-3">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${tab === k ? 'bg-card text-ink' : 'text-muted hover:text-ink'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {tab === 'content' && (
          <>
            <div className="card p-4">
              <ProgressIndicator value={pct} label="Resume completion" />
              {missing.length > 0 && (
                <p className="mt-2 text-xs text-zinc-500">
                  Next: {missing.map((m) => m.label.toLowerCase()).join(' · ')}
                </p>
              )}
            </div>

            <FormSection icon={User} title="Personal Information" defaultOpen>
              <PersonalInfo data={resume.data.personal} onChange={(v) => setSection('personal', v)} visibility={resume.visibility} onVisibility={setVis} />
            </FormSection>

            {resume.order.map((key, idx) => {
              const { icon, Comp } = SECTION_META[key];
              return (
                <FormSection
                  key={key}
                  icon={icon}
                  title={SECTION_LABELS[key]}
                  count={resume.data[key].length}
                  hideable
                  visible={resume.visibility[key] !== false}
                  onToggleVisible={(v) => setVis(key, v)}
                  onMove={(dir) => moveSection(key, dir)}
                  canUp={idx > 0}
                  canDown={idx < resume.order.length - 1}
                >
                  <Comp items={resume.data[key]} onChange={(v) => setSection(key, v)} />
                </FormSection>
              );
            })}
            <p className="px-1 pb-6 text-xs text-zinc-500">Use the arrows on a section header to change its order on the resume, and the eye icon to hide it.</p>
          </>
        )}

        {tab === 'template' && <TemplateSelector value={resume.template} onChange={(t) => updateResume(id, (r) => ({ ...r, template: t }))} />}

        {tab === 'tips' && <WritingAssistant onInsertSummary={(text) => setSection('personal', { ...resume.data.personal, summary: text })} />}
      </div>
    </div>
  );
}
