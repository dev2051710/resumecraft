import { getVisible, dateRange, displayUrl, normalizeUrl } from '../utils/resumeHelpers';
import { Section, Link, Bullets, Para, contactItems, renderSections, NAME_PLACEHOLDER } from './shared';

// Single column, system fonts, no graphics, no photo, standard headings: friendly to applicant tracking systems.
const heading = 'mt-3.5 mb-1 border-b border-black pb-0.5 text-[10.5pt] font-bold uppercase';

export default function AtsTemplate({ resume }) {
  const v = getVisible(resume);
  const p = v.personal;
  const contacts = contactItems(p);

  const R = {
    education: (list) => (
      <Section title="Education" headingClass={heading}>
        {list.map((e) => (
          <div key={e.id} className="avoid-break mt-1.5">
            <div className="flex justify-between gap-4">
              <span className="font-bold">{[e.degree, e.school].filter(Boolean).join(', ')}</span>
              <span className="whitespace-nowrap">{dateRange(e.start, e.end, e.current)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>{e.location}</span>
              <span>{e.grade}</span>
            </div>
            <Para text={e.description} />
          </div>
        ))}
      </Section>
    ),
    skills: (list) => (
      <Section title="Skills" headingClass={heading}>
        {list.map((g) => (
          <p key={g.id} className="avoid-break mt-0.5">
            {g.category && <span className="font-bold">{g.category}: </span>}
            {g.items.join(', ')}
          </p>
        ))}
      </Section>
    ),
    experience: (list) => (
      <Section title="Work Experience" headingClass={heading}>
        {list.map((e) => (
          <div key={e.id} className="avoid-break mt-1.5">
            <div className="flex justify-between gap-4">
              <span className="font-bold">{[e.title, e.company].filter(Boolean).join(', ')}</span>
              <span className="whitespace-nowrap">{dateRange(e.start, e.end, e.current)}</span>
            </div>
            {e.location && <div>{e.location}</div>}
            <Bullets text={e.responsibilities} />
            <Bullets text={e.achievements} />
          </div>
        ))}
      </Section>
    ),
    projects: (list) => (
      <Section title="Projects" headingClass={heading}>
        {list.map((x) => (
          <div key={x.id} className="avoid-break mt-1.5">
            <div className="font-bold">{x.name}</div>
            {x.tech && <div>Technologies: {x.tech}</div>}
            <Para text={x.description} />
            {(x.url || x.github) && (
              <div>
                {x.url && <Link href={normalizeUrl(x.url)}>{displayUrl(x.url)}</Link>}
                {x.url && x.github && ' | '}
                {x.github && <Link href={normalizeUrl(x.github)}>{displayUrl(x.github)}</Link>}
              </div>
            )}
          </div>
        ))}
      </Section>
    ),
    certifications: (list) => (
      <Section title="Certifications" headingClass={heading}>
        {list.map((c) => (
          <div key={c.id} className="avoid-break mt-0.5 flex justify-between gap-4">
            <span>
              <span className="font-bold">{c.name}</span>
              {c.org && `, ${c.org}`}
              {c.url && <> (<Link href={normalizeUrl(c.url)}>{displayUrl(c.url)}</Link>)</>}
            </span>
            <span className="whitespace-nowrap">{c.date && dateRange(c.date, '', false)}</span>
          </div>
        ))}
      </Section>
    ),
    achievements: (list) => (
      <Section title="Achievements and Activities" headingClass={heading}>
        {list.map((a) => (
          <div key={a.id} className="avoid-break mt-0.5 flex gap-2">
            <span aria-hidden="true">•</span>
            <span className="flex-1">
              <span className="font-bold">{a.type}: </span>
              {a.text}
            </span>
          </div>
        ))}
      </Section>
    ),
  };

  return (
    <div className="bg-white px-[15mm] text-black" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10.5pt', lineHeight: 1.35 }}>
      <header className="avoid-break text-center">
        <h1 className="text-[20pt] font-bold leading-tight" style={{ color: p.fullName ? '#000' : '#9CA3AF' }}>
          {p.fullName || NAME_PLACEHOLDER}
        </h1>
        {p.title && <div className="text-[11.5pt]">{p.title}</div>}
        {contacts.length > 0 && (
          <div className="mt-1 text-[10pt]">
            {contacts.map((c, i) => (
              <span key={c.key}>
                {i > 0 && ' | '}
                <Link href={c.href}>{c.label}</Link>
              </span>
            ))}
          </div>
        )}
      </header>
      {v.summary && (
        <Section title="Professional Summary" headingClass={heading}>
          <p className="mt-1">{v.summary}</p>
        </Section>
      )}
      {renderSections(v, R)}
    </div>
  );
}
