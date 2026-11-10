export const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

export const TEMPLATE_IDS = ['modern', 'ats', 'minimal', 'executive'];
export const SECTION_KEYS = ['education', 'skills', 'experience', 'projects', 'certifications', 'achievements'];
export const SECTION_LABELS = {
  education: 'Education',
  skills: 'Skills',
  experience: 'Work Experience',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements & Activities',
};
export const ACHIEVEMENT_TYPES = ['Achievement', 'Leadership', 'Extracurricular', 'Volunteer'];

/* ---------- entry factories ---------- */
export const newEducation = () => ({ id: uid(), degree: '', school: '', location: '', start: '', end: '', current: false, grade: '', description: '' });
export const newExperience = () => ({ id: uid(), title: '', company: '', location: '', start: '', end: '', current: false, responsibilities: '', achievements: '' });
export const newSkillGroup = () => ({ id: uid(), category: '', items: [] });
export const newProject = () => ({ id: uid(), name: '', description: '', tech: '', url: '', github: '' });
export const newCertification = () => ({ id: uid(), name: '', org: '', date: '', url: '' });
export const newAchievement = () => ({ id: uid(), type: 'Achievement', text: '' });

export const emptyData = () => ({
  personal: { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '', image: '' },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
});

export const defaultVisibility = () => ({
  photo: true,
  summary: true,
  education: true,
  skills: true,
  experience: true,
  projects: true,
  certifications: true,
  achievements: true,
});

export function createResume({ template = 'modern', name } = {}) {
  const now = Date.now();
  return {
    id: uid(),
    name: name || 'Untitled Resume',
    template: TEMPLATE_IDS.includes(template) ? template : 'modern',
    createdAt: now,
    updatedAt: now,
    order: [...SECTION_KEYS],
    visibility: defaultVisibility(),
    data: emptyData(),
  };
}

/* ---------- normalising stored / imported data ---------- */
const arr = (x) => (Array.isArray(x) ? x : []);
const str = (x) => (typeof x === 'string' ? x : x == null ? '' : String(x));

function cleanEntry(raw, factory) {
  const base = factory();
  const out = { id: uid() };
  Object.keys(base).forEach((k) => {
    if (k === 'id') return;
    const v = raw ? raw[k] : undefined;
    out[k] = typeof base[k] === 'boolean' ? Boolean(v) : str(v);
  });
  return out;
}

const cleanList = (list, factory, keepIds) =>
  arr(list)
    .filter((x) => x && typeof x === 'object')
    .map((x) => {
      const e = cleanEntry(x, factory);
      if (keepIds && x.id) e.id = String(x.id);
      return e;
    });

export function normalizeResume(raw, keepId = false) {
  const base = createResume({});
  const r = raw && typeof raw === 'object' ? raw : {};
  const d = r.data && typeof r.data === 'object' ? r.data : {};
  const p = d.personal && typeof d.personal === 'object' ? d.personal : {};

  const personal = {};
  Object.keys(base.data.personal).forEach((k) => (personal[k] = str(p[k])));

  const order = [...new Set(arr(r.order).filter((k) => SECTION_KEYS.includes(k)))];
  SECTION_KEYS.forEach((k) => {
    if (!order.includes(k)) order.push(k);
  });

  const skills = arr(d.skills)
    .filter((g) => g && typeof g === 'object')
    .map((g) => ({
      id: keepId && g.id ? String(g.id) : uid(),
      category: str(g.category),
      items: arr(g.items).map(str).filter(Boolean),
    }));

  const visibility = { ...base.visibility };
  Object.keys(visibility).forEach((k) => {
    if (r.visibility && typeof r.visibility[k] === 'boolean') visibility[k] = r.visibility[k];
  });

  return {
    id: keepId && r.id ? String(r.id) : uid(),
    name: str(r.name) || 'Imported Resume',
    template: TEMPLATE_IDS.includes(r.template) ? r.template : 'modern',
    createdAt: keepId && Number(r.createdAt) ? Number(r.createdAt) : Date.now(),
    updatedAt: keepId && Number(r.updatedAt) ? Number(r.updatedAt) : Date.now(),
    order,
    visibility,
    data: {
      personal,
      education: cleanList(d.education, newEducation, keepId),
      skills,
      experience: cleanList(d.experience, newExperience, keepId),
      projects: cleanList(d.projects, newProject, keepId),
      certifications: cleanList(d.certifications, newCertification, keepId),
      achievements: cleanList(d.achievements, newAchievement, keepId),
    },
  };
}

/* ---------- validation ---------- */
export const isValidEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const normalizeUrl = (v) => {
  const t = (v || '').trim();
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};
export const isValidUrl = (v) => {
  if (!v || !v.trim()) return true;
  try {
    const u = new URL(normalizeUrl(v));
    return u.hostname.includes('.') && !/\s/.test(v.trim());
  } catch {
    return false;
  }
};
export const displayUrl = (v) => (v || '').trim().replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

/* ---------- formatting ---------- */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatMonth(v) {
  const m = /^(\d{4})-(\d{2})$/.exec(v || '');
  if (!m) return v || '';
  return `${MONTHS[Number(m[2]) - 1] || ''} ${m[1]}`.trim();
}
export function dateRange(start, end, current) {
  return [formatMonth(start), current ? 'Present' : formatMonth(end)].filter(Boolean).join(' – ');
}
export const bullets = (text) =>
  (text || '')
    .split('\n')
    .map((s) => s.replace(/^[\s•\-–—*·]+/, '').trim())
    .filter(Boolean);

export function pdfFileName(name) {
  const base = (name || '').trim().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, '');
  return `${base || 'My'}_Resume.pdf`;
}
export const safeName = (name) =>
  (name || 'resume').trim().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, '') || 'resume';

export function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- what the templates actually render ---------- */
export function getVisible(resume) {
  const d = resume.data;
  const v = resume.visibility || {};
  const on = (k) => v[k] !== false;
  const p = d.personal;
  return {
    personal: p,
    showPhoto: on('photo') && !!p.image,
    summary: on('summary') ? (p.summary || '').trim() : '',
    order: resume.order || SECTION_KEYS,
    sections: {
      education: on('education') ? d.education.filter((e) => e.degree || e.school) : [],
      skills: on('skills')
        ? d.skills.map((g) => ({ ...g, items: (g.items || []).filter(Boolean) })).filter((g) => g.items.length)
        : [],
      experience: on('experience') ? d.experience.filter((e) => e.title || e.company) : [],
      projects: on('projects') ? d.projects.filter((x) => x.name) : [],
      certifications: on('certifications') ? d.certifications.filter((c) => c.name) : [],
      achievements: on('achievements') ? d.achievements.filter((a) => a.text.trim()) : [],
    },
  };
}

/* ---------- completion ---------- */
export function getChecklist(resume) {
  const d = resume.data;
  const p = d.personal;
  const skillCount = d.skills.reduce((n, g) => n + (g.items || []).length, 0);
  return [
    { key: 'name', label: 'Add your full name', done: !!p.fullName.trim() },
    { key: 'title', label: 'Add a professional title', done: !!p.title.trim() },
    { key: 'email', label: 'Add a valid email', done: !!p.email.trim() && isValidEmail(p.email) },
    { key: 'phone', label: 'Add a phone number', done: !!p.phone.trim() },
    { key: 'location', label: 'Add your location', done: !!p.location.trim() },
    { key: 'links', label: 'Add LinkedIn or GitHub', done: !!(p.linkedin.trim() || p.github.trim()) },
    { key: 'summary', label: 'Write a professional summary', done: p.summary.trim().length >= 30 },
    { key: 'education', label: 'Add education', done: d.education.some((e) => e.degree && e.school) },
    { key: 'skills', label: 'Add at least 3 skills', done: skillCount >= 3 },
    { key: 'experience', label: 'Add work experience', done: d.experience.some((e) => e.title && e.company) },
    { key: 'projects', label: 'Add a project', done: d.projects.some((x) => x.name) },
    { key: 'certifications', label: 'Add a certification', done: d.certifications.some((c) => c.name) },
    { key: 'achievements', label: 'Add an achievement or activity', done: d.achievements.some((a) => a.text.trim()) },
  ];
}
export const completion = (resume) => {
  const c = getChecklist(resume);
  return Math.round((c.filter((x) => x.done).length / c.length) * 100);
};

/* ---------- list helpers ---------- */
export const moveItem = (list, index, dir) => {
  const to = index + dir;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[index], next[to]] = [next[to], next[index]];
  return next;
};

/* ---------- profile image ---------- */
export function resizeImage(file, size = 320) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load the image.'));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(c.toDataURL('image/jpeg', 0.88));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- sample content (used ONLY for template thumbnails) ---------- */
export const SAMPLE_RESUME = (() => {
  const r = createResume({ name: 'Sample' });
  r.id = 'sample';
  r.data.personal = {
    fullName: 'Alex Morgan',
    title: 'Software Developer',
    email: 'alex.morgan@example.com',
    phone: '+00 00000 00000',
    location: 'City, Country',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    portfolio: '',
    summary: 'Developer who enjoys building clean, reliable web applications. Comfortable with React, Python and REST APIs, and focused on writing maintainable code.',
    image: '',
  };
  r.data.education = [{ id: 'e1', degree: 'B.Tech in Computer Science', school: 'Example Institute of Technology', location: 'City', start: '2023-07', end: '2027-06', current: false, grade: 'CGPA: 8.0', description: '' }];
  r.data.skills = [
    { id: 's1', category: 'Languages', items: ['Python', 'JavaScript', 'SQL'] },
    { id: 's2', category: 'Frameworks', items: ['React', 'Node.js', 'Tailwind CSS'] },
  ];
  r.data.experience = [{ id: 'x1', title: 'Software Intern', company: 'Example Company', location: 'Remote', start: '2025-05', end: '2025-08', current: false, responsibilities: 'Built reusable UI components for an internal dashboard\nWrote unit tests for API endpoints', achievements: 'Reduced page load time by improving data fetching' }];
  r.data.projects = [{ id: 'p1', name: 'Task Tracker', description: 'Web app to plan and track daily tasks with filters and local persistence.', tech: 'React, Tailwind CSS', url: '', github: 'github.com/alexmorgan/task-tracker' }];
  r.data.certifications = [{ id: 'c1', name: 'Web Development Certificate', org: 'Example Academy', date: '2025-03', url: '' }];
  r.data.achievements = [{ id: 'a1', type: 'Leadership', text: 'Led a team of 4 in a college hackathon' }];
  return r;
})();
