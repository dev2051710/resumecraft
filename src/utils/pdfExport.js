import { pdfFileName } from './resumeHelpers';

/** Exports the off-screen, full-size resume (#resume-print) as an A4 PDF. */
export async function exportResumePdf(resume) {
  const el = document.getElementById('resume-print');
  if (!el) throw new Error('The resume preview is not ready yet.');

  const mod = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
  const html2pdf = mod.default || mod;
  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  await html2pdf()
    .set({
      margin: [12, 0, 12, 0], // top/right... (mm): [top, left, bottom, right]
      filename: pdfFileName(resume.data.personal.fullName),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['.avoid-break'] },
    })
    .from(el)
    .save();
}

export function printResume() {
  window.print();
}
