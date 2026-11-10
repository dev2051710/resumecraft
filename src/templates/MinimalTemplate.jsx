import { getVisible, dateRange, displayUrl, normalizeUrl } from '../utils/resumeHelpers';
import { Section, Link, Bullets, Para, contactItems, renderSections, NAME_PLACEHOLDER } from './shared';

const heading = 'mt-5 mb-2 text-[8.5pt] font-semibold uppercase tracking-[0.28em] text-neutral-500';
const row = 'avoid-break mt-2 grid grid-cols-[30mm_1fr] gap-4';
const dateCls = 'pt-0.5 text-[8.5pt] leading-snug text-neutral-500';

export default function MinimalTemplate({ resume }) {
  const v = getVisible(resume);
  const p = v.personal;
  const contacts = contactItems(p);

  const R = {
    education: (list) => (
      <Section title="Education" headingClass={heading}>
        {list.map((e) => (
          <div key={e.id} className={row}>
            <div className={dateCls}>{dateRange(e.start, e.end, e.current)}</div>
            <div>
              <div className="font-medium">{e.degree}</div>
              <div className="text-neutral-600">{[e.school, e.location].filter(Boolean).join(', ')}</div>
              {e.grade && <div className="text-[9pt] text-neutral-500">{e.grade}</div>}
              <Para text={e.description} className="text-neutral-700" />
            </div>
          </div>
        ))}
      </Section>
    ),
    skills: (list) => (
      <Section title="Skills" headingClass={heading}>
        {list.map((g) => (
          <div key={g.id} className={row}>
            <div className={dateCls}>{g.category}</div>
            <div className="text-neutral-800">{g.items.join('  ·  ')}</div>
          </div>
        ))}
      </Section>
    ),
    experience: (list) => (
      <Section title="Experience" headingClass={heading}>
        {list.map((e) => (
          <div key={e.id} className={row}>
            <div className={dateCls}>{dateRange(e.start, e.end, e.current)}</div>
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-neutral-600">{[e.company, e.location].filter(Boolean).join(', ')}</div>
              <Bullets text={e.responsibilities} className="text-neutral-800" />
              <Bullets text={e.achievements} className="text-neutral-800" />
            </div>
          </div>
        ))}
      </Section>
    ),
    projects: (list) => (
      <Section title="Projects" headingClass={heading}>
        {list.map((x) => (
          <div key={x.id} className={row}>
            <div className={dateCls}>{x.tech}</div>
            <div>
              <div className="font-medium">{x.name}</div>
              <Para text={x.description} className="text-neutral-700" />
              {(x.url || x.github) && (
                <div className="mt-0.5 text-[9pt] text-neutral-500">
                  {x.url && <Link href={normalizeUrl(x.url)}>{displayUrl(x.url)}</Link>}
                  {x.url && x.github && '  ·  '}
                  {x.github && <Link href={normalizeUrl(x.github)}>{displayUrl(x.github)}</Link>}
                </div>
              )}
            </div>
          </div>
        ))}
      </Section>
    ),
    certifications: (list) => (
      <Section title="Certifications" headingClass={heading}>
        {list.map((c) => (
          <div key={c.id} className={row}>
            <div className={dateCls}>{c.date && dateRange(c.date, '', false)}</div>
            <div>
              <span className="font-medium">{c.name}</span>
              {c.org && <span className="text-neutral-600">, {c.org}</span>}
              {c.url && <span className="text-[9pt] text-neutral-500"> · <Link href={normalizeUrl(c.url)}>{displayUrl(c.url)}</Link></span>}
            </div>
          </div>
        ))}
      </Section>
    ),
    achievements: (list) => (
      <Section title="Achievements & Activities" headingClass={heading}>
        {list.map((a) => (
          <div key={a.id} className={row}>
            <div className={dateCls}>{a.type}</div>
            <div className="text-neutral-800">{a.text}</div>
          </div>
        ))}
      </Section>
    ),
  };

  return (
    <div className="bg-white px-[16mm] text-neutral-900" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: '9.8pt', lineHeight: 1.45, fontWeight: 300 }}>
      <header className="avoid-break flex items-center gap-5">
        {v.showPhoto && <img src={p.image} alt="" className="h-[22mm] w-[22mm] shrink-0 rounded-full object-cover" />}
        <div className="min-w-0 flex-1">
          <h1 className="text-[26pt] font-light leading-tight tracking-tight" style={{ color: p.fullName ? '#111' : '#9CA3AF' }}>
            {p.fullName || NAME_PLACEHOLDER}
          </h1>
          {p.title && <div className="text-[10.5pt] uppercase tracking-[0.2em] text-neutral-500">{p.title}</div>}
        </div>
      </header>
      {contacts.length > 0 && (
        <div className="avoid-break mt-3 flex flex-wrap gap-x-4 gap-y-0.5 border-y border-neutral-200 py-1.5 text-[9pt] text-neutral-600">
          {contacts.map((c) => (
            <Link key={c.key} href={c.href}>
              {c.label}
            </Link>
          ))}
        </div>
      )}
      {v.summary && (
        <Section title="About" headingClass={heading}>
          <p className="text-neutral-800">{v.summary}</p>
        </Section>
      )}
      {renderSections(v, R)}
    </div>
  );
}
