import { getVisible, dateRange, displayUrl, normalizeUrl } from '../utils/resumeHelpers';
import { Section, Link, Bullets, Para, contactItems, renderSections, NAME_PLACEHOLDER } from './shared';

const NAVY = '#1B2A41';
const heading = 'mt-4 mb-1.5 border-b-[1.5px] pb-0.5 text-[11pt] font-bold uppercase tracking-[0.12em]';
const hStyle = { color: NAVY, borderColor: NAVY };

export default function ExecutiveTemplate({ resume }) {
  const v = getVisible(resume);
  const p = v.personal;
  const contacts = contactItems(p);

  const R = {
    experience: (list) => (
      <Section title="Professional Experience" headingClass={heading} headingStyle={hStyle}>
        {list.map((e) => (
          <div key={e.id} className="avoid-break mt-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[11pt] font-bold">{e.company || e.title}</span>
              <span className="whitespace-nowrap text-[9.5pt] font-semibold" style={{ color: NAVY }}>{dateRange(e.start, e.end, e.current)}</span>
            </div>
            <div className="flex justify-between gap-4 italic text-neutral-700">
              <span>{e.company ? e.title : ''}</span>
              <span>{e.location}</span>
            </div>
            <Bullets text={e.responsibilities} />
            <Bullets text={e.achievements} />
          </div>
        ))}
      </Section>
    ),
    education: (list) => (
      <Section title="Education" headingClass={heading} headingStyle={hStyle}>
        {list.map((e) => (
          <div key={e.id} className="avoid-break mt-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[11pt] font-bold">{e.school || e.degree}</span>
              <span className="whitespace-nowrap text-[9.5pt] font-semibold" style={{ color: NAVY }}>{dateRange(e.start, e.end, e.current)}</span>
            </div>
            <div className="flex justify-between gap-4 italic text-neutral-700">
              <span>{e.school ? e.degree : ''}</span>
              <span>{[e.location, e.grade].filter(Boolean).join(' · ')}</span>
            </div>
            <Para text={e.description} />
          </div>
        ))}
      </Section>
    ),
    skills: (list) => (
      <Section title="Core Competencies" headingClass={heading} headingStyle={hStyle}>
        {list.map((g) => (
          <div key={g.id} className="avoid-break mt-1 flex gap-3">
            {g.category && <span className="w-[34mm] shrink-0 font-bold">{g.category}</span>}
            <span className="flex-1">{g.items.join('  |  ')}</span>
          </div>
        ))}
      </Section>
    ),
    projects: (list) => (
      <Section title="Key Projects" headingClass={heading} headingStyle={hStyle}>
        {list.map((x) => (
          <div key={x.id} className="avoid-break mt-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[10.5pt] font-bold">{x.name}</span>
              <span className="whitespace-nowrap text-[9pt] text-neutral-600">
                {x.url && <Link href={normalizeUrl(x.url)}>{displayUrl(x.url)}</Link>}
                {x.url && x.github && ' | '}
                {x.github && <Link href={normalizeUrl(x.github)}>{displayUrl(x.github)}</Link>}
              </span>
            </div>
            {x.tech && <div className="italic text-neutral-700">{x.tech}</div>}
            <Para text={x.description} />
          </div>
        ))}
      </Section>
    ),
    certifications: (list) => (
      <Section title="Certifications" headingClass={heading} headingStyle={hStyle}>
        {list.map((c) => (
          <div key={c.id} className="avoid-break mt-1 flex justify-between gap-4">
            <span>
              <span className="font-bold">{c.name}</span>
              {c.org && <span className="italic">, {c.org}</span>}
              {c.url && <span className="text-[9pt] text-neutral-600"> · <Link href={normalizeUrl(c.url)}>{displayUrl(c.url)}</Link></span>}
            </span>
            <span className="whitespace-nowrap text-[9.5pt]">{c.date && dateRange(c.date, '', false)}</span>
          </div>
        ))}
      </Section>
    ),
    achievements: (list) => (
      <Section title="Achievements & Leadership" headingClass={heading} headingStyle={hStyle}>
        {list.map((a) => (
          <div key={a.id} className="avoid-break mt-1 flex gap-2">
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
    <div className="bg-white px-[15mm] text-black" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '10.5pt', lineHeight: 1.4 }}>
      <header className="avoid-break border-y-[3px] py-3 text-center" style={{ borderColor: NAVY }}>
        <div className="flex items-center justify-center gap-5">
          {v.showPhoto && <img src={p.image} alt="" className="h-[26mm] w-[26mm] shrink-0 rounded object-cover" />}
          <div>
            <h1 className="text-[24pt] font-bold uppercase leading-tight tracking-[0.1em]" style={{ color: p.fullName ? NAVY : '#9CA3AF' }}>
              {p.fullName || NAME_PLACEHOLDER}
            </h1>
            {p.title && <div className="text-[12pt] italic text-neutral-700">{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div className="mt-2 text-[9.5pt] text-neutral-800">
            {contacts.map((c, i) => (
              <span key={c.key}>
                {i > 0 && <span style={{ color: NAVY }}>  ◆  </span>}
                <Link href={c.href}>{c.label}</Link>
              </span>
            ))}
          </div>
        )}
      </header>
      {v.summary && (
        <Section title="Executive Summary" headingClass={heading} headingStyle={hStyle}>
          <p className="mt-1 text-justify">{v.summary}</p>
        </Section>
      )}
      {renderSections(v, R)}
    </div>
  );
}
