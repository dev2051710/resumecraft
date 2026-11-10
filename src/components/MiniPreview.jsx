import { useEffect, useRef, useState } from 'react';
import { getTemplate } from '../templates';

const PAGE_W = 794; // 210mm @ 96dpi

/** Small, non-interactive, auto-scaled first-page thumbnail of a resume. */
export default function MiniPreview({ resume }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth > 0) setScale(el.clientWidth / PAGE_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { Component } = getTemplate(resume.template);
  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-md bg-white" style={{ aspectRatio: '210 / 297' }} aria-hidden="true">
      <div style={{ width: PAGE_W, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none', paddingTop: '12mm' }}>
        <Component resume={resume} />
      </div>
    </div>
  );
}
