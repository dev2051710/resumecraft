import { getVisible, dateRange, displayUrl, normalizeUrl } from '../utils/resumeHelpers';
import { Section, Link, Bullets, Para, contactItems, renderSections, NAME_PLACEHOLDER } from './shared';

const ACCENT = '#4338CA';
const heading = 'mt-4 mb-1.5 border-b pb-0.5 text-[9.5pt] font-bold uppercase tracking-[0.14em]';
const hStyle = { color: ACCENT, borderColor: '#C7D2FE' };

export default function ModernTemplate({ resume }) {
  const v = getVisible(resume);
  const p = v.personal;
  const contacts = contactItems(p);

  const R = {
    education: (list) => (
      <Section title="Education" headingClass={heading} headingStyle={hStyle}>
        {list.map((e) => (
          <div key={e.id} className="avoid-break mt-1.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{e.degree}</div>
                <div className="text-neutral-700">{[e.school, e.location].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="whitespace-nowrap text-right text-[9pt] text-neutral-600">
                <div>{dateRange(e.start, e.end, e.current)}</div>
                {e.grade && <div className="font-medium text-neutral-800">{e.grade}</div>}
              </div>
            </div>
            <Para text={e.description} className="text-neutral-800" />
          </div>
        ))}
      </Section>
    ),
    skills: (list) => (
      <Section title="Skills" headingClass={heading} headingStyle={hStyle}>
        {list.map((g) => (
          <div key={g.id} className="avoid-break mt-1.5 flex gap-3">
            {g.category && <div className="w-[32mm] shrink-0 text-[9.5pt] font-semibold">{g.category}</div>}
            <div className="flex flex-1 flex-wrap gap-1">
              {g.items.map((s, i) => (
                <span key={i} className="rounded px-1.5 py-px text-[9pt]" style={{ background: '#EEF2FF', color: '#312E81' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Section>
    ),
    experience: (list) => (
      <Section title="Work Experience" headingClass={heading} headingStyle={hStyle}>
        {list.map((e) => (
          <div key={e.id} className="avoid-break mt-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-semibold">{e.title}</span>
                {e.company && <span className="text-neutral-700"> — {e.company}</span>}
                {e.location && <span className="text-neutral-500"> · {e.location}</span>}
              </div>
              <div className="whitespace-nowrap text-[9pt] text-neutral-600">{dateRange(e.start, e.end, e.current)}</div>
            </div>
            <Bullets text={e.responsibilities} />
            <Bullets text={e.achievements} />
          </div>
        ))}
      </Section>
    ),
    projects: (list) => (
      <Section title="Projects" headingClass={heading} headingStyle={hStyle}>
        {list.map((x) => (
          <div key={x.id} className="avoid-break mt-2">
            <div className="flex items-start justify-between gap-4">
              <span className="font-semibold">{x.name}</span>
              <span className="whitespace-nowrap text-[9pt] text-neutral-600">
                {x.url && <Link href={normalizeUrl(x.url)}>{displayUrl(x.url)}</Link>}
                {x.url && x.github && ' | '}
                {x.github && <Link href={normalizeUrl(x.github)}>{displayUrl(x.github)}</Link>}
              </span>
            </div>
            {x.tech && <div className="text-[9pt] italic text-neutral-600">{x.tech}</div>}
            <Para text={x.description} />
          </div>
        ))}
      </Section>
    ),
    certifications: (list) => (
      <Section title="Certifications" headingClass={heading} headingStyle={hStyle}>
        {list.map((c) => (
          <div key={c.id} className="avoid-break mt-1 flex justify-between gap-4">
            <div>
              <span className="font-semibold">{c.name}</span>
              {c.org && <span className="text-neutral-700"> — {c.org}</span>}
              {c.url && (
                <span className="text-[9pt] text-neutral-500"> · <Link href={normalizeUrl(c.url)}>{displayUrl(c.url)}</Link></span>
              )}
            </div>
            <div className="whitespace-nowrap text-[9pt] text-neutral-600">{c.date && dateRange(c.date, '', false)}</div>
          </div>
        ))}
      </Section>
    ),
    achievements: (list) => (
      <Section title="Achievements & Activities" headingClass={heading} headingStyle={hStyle}>
        {list.map((a) => (
          <div key={a.id} className="avoid-break mt-1 flex gap-2">
            <span aria-hidden="true">•</span>
            <span className="flex-1">
              <span className="font-semibold">{a.type}: </span>
              {a.text}
            </span>
          </div>
        ))}
      </Section>
    ),
  };

  return (
    <div className="bg-white px-[14mm] text-black" style={{ fontFamily: "Inter, 'Segoe UI', Arial, sans-serif", fontSize: '10pt', lineHeight: 1.4 }}>
      <header className="avoid-break flex items-center justify-between gap-5 border-b-2 pb-3" style={{ borderColor: ACCENT }}>
        <div className="min-w-0 flex-1">
          <h1 className="text-[24pt] font-bold leading-tight tracking-tight" style={{ color: p.fullName ? '#111' : '#9CA3AF' }}>
            {p.fullName || NAME_PLACEHOLDER}
          </h1>
          {p.title && (
            <div className="text-[12pt] font-medium" style={{ color: ACCENT }}>
              {p.title}
            </div>
          )}
          {contacts.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[9pt] text-neutral-700">
              {contacts.map((c) => (
                <Link key={c.key} href={c.href}>
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {v.showPhoto && <img src={p.image} alt="" className="h-[26mm] w-[26mm] shrink-0 rounded-full object-cover" />}
      </header>

      {v.summary && (
        <Section title="Profile" headingClass={heading} headingStyle={hStyle}>
          <p className="mt-1">{v.summary}</p>
        </Section>
      )}
      {renderSections(v, R)}
    </div>
  );
}
