import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getTemplate } from '../templates';

const PAGE_W = 794; // 210mm @ 96dpi
const MM = 96 / 25.4;
const PAD = 12 * MM; // top/bottom page margin (matches the PDF)
const PAGE_CONTENT = (297 - 24) * MM; // usable height per page

export default function ResumePreview({ resume, showGuides = true }) {
  const { Component } = getTemplate(resume.template);
  const wrapRef = useRef(null);
  const docRef = useRef(null);
  const [scale, setScale] = useState(0.7);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const doc = docRef.current;
    if (!wrap || !doc) return undefined;
    const measure = () => {
      if (wrap.clientWidth > 0) setScale(Math.min(1.25, (wrap.clientWidth - 32) / PAGE_W));
      setHeight(doc.offsetHeight);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(doc);
    measure();
    return () => ro.disconnect();
  }, []);

  const contentH = Math.max(0, height - 2 * PAD);
  const pages = Math.max(1, Math.ceil(contentH / PAGE_CONTENT - 0.001));
  const sheetH = Math.max(height, 297 * MM);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-muted">
        <span>Live preview · A4</span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-ink">
          {pages} page{pages > 1 ? 's' : ''}
        </span>
      </div>

      <div ref={wrapRef} className="min-h-0 flex-1 overflow-auto bg-zinc-950/70 p-4">
        <div style={{ width: PAGE_W * scale, height: sheetH * scale, margin: '0 auto' }}>
          <div className="relative bg-white shadow-2xl shadow-black/60" style={{ width: PAGE_W, minHeight: 297 * MM, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <div ref={docRef} style={{ padding: '12mm 0', minHeight: `${297 * MM}px` }}>
              <Component resume={resume} />
            </div>
            {showGuides &&
              Array.from({ length: pages - 1 }).map((_, i) => (
                <div key={i} className="pointer-events-none absolute left-0 right-0" style={{ top: PAD + (i + 1) * PAGE_CONTENT }}>
                  <div className="border-t border-dashed border-violet-400/70" />
                  <span className="absolute right-2 -top-2.5 rounded bg-violet-500 px-1.5 py-0.5 text-[10px] text-white">Page {i + 2} starts</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Full-size off-screen copy: source for PDF export and browser printing */}
      {createPortal(
        <div id="print-root" aria-hidden="true">
          <div id="resume-print" style={{ width: '210mm', background: '#fff' }}>
            <Component resume={resume} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
