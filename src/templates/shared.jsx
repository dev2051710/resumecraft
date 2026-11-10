import { Children, Fragment } from 'react';
import { bullets, displayUrl, normalizeUrl } from '../utils/resumeHelpers';

/** Heading + first entry are wrapped together so a heading is never left alone at the bottom of a page. */
export function Section({ title, children, className = '', headingClass = '', headingStyle }) {
  const items = Children.toArray(children);
  if (!items.length) return null;
  const [first, ...rest] = items;
  return (
    <section className={className}>
      <div className="avoid-break">
        <h2 className={headingClass} style={headingStyle}>
          {title}
        </h2>
        {first}
      </div>
      {rest}
    </section>
  );
}

export function Link({ href, children, className = '', style }) {
  if (!href) return <span className={className} style={style}>{children}</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} style={{ color: 'inherit', textDecoration: 'none', ...style }}>
      {children}
    </a>
  );
}

export function Bullets({ text, className = '', gap = 'mt-0.5' }) {
  const list = bullets(text);
  if (!list.length) return null;
  return (
    <ul className={className}>
      {list.map((b, i) => (
        <li key={i} className={`flex gap-2 ${gap}`}>
          <span aria-hidden="true">•</span>
          <span className="flex-1">{b}</span>
        </li>
      ))}
    </ul>
  );
}

/** One line -> paragraph, several lines -> bullets */
export function Para({ text, className = '' }) {
  const list = bullets(text);
  if (!list.length) return null;
  if (list.length === 1) return <p className={`mt-0.5 ${className}`}>{list[0]}</p>;
  return <Bullets text={text} className={className} />;
}

export function contactItems(p) {
  const items = [
    { key: 'email', label: p.email, href: p.email ? `mailto:${p.email.trim()}` : '' },
    { key: 'phone', label: p.phone, href: p.phone ? `tel:${p.phone.replace(/\s+/g, '')}` : '' },
    { key: 'location', label: p.location, href: '' },
    { key: 'linkedin', label: displayUrl(p.linkedin), href: normalizeUrl(p.linkedin) },
    { key: 'github', label: displayUrl(p.github), href: normalizeUrl(p.github) },
    { key: 'portfolio', label: displayUrl(p.portfolio), href: normalizeUrl(p.portfolio) },
  ];
  return items.filter((i) => i.label && i.label.trim());
}

export function renderSections(view, renderers) {
  return view.order.map((key) => {
    const items = view.sections[key];
    if (!items || !items.length || !renderers[key]) return null;
    return <Fragment key={key}>{renderers[key](items)}</Fragment>;
  });
}

export const NAME_PLACEHOLDER = 'Your Name';
