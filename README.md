# ResumeCraft – Build Your Professional Resume

A fully frontend resume builder: React + Vite + Tailwind CSS. No backend, database, login or paid API. All data stays in your browser (localStorage).

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

## Features
- Split-screen editor with live A4 preview and page-break guides
- 4 templates: Modern Professional, ATS Friendly, Minimal, Executive (switch instantly, no data loss)
- Personal info (+ optional photo), Education, Skills (categories), Experience, Projects, Certifications, Achievements
- Add / edit / remove / reorder entries; reorder and hide whole sections
- Email and URL validation, confirmation before destructive actions
- Download PDF (A4, multi-page, named after you, e.g. Devesh_Kumar_Sahu_Resume.pdf) and browser Print
- Autosave + manual Save, multiple resumes, duplicate, delete, clear
- JSON import / export (single resume or full backup)
- Completion indicator, built-in writing tips (static, no AI)

## Test checklist
1. Create a resume, type a name: preview updates instantly.
2. Switch the four templates: content stays.
3. Add 3+ projects/experience entries to push past one page: preview shows "Page 2 starts", PDF has 2 pages and headings are not orphaned.
4. Download PDF, open it, check links are clickable and the file name matches your name.
5. Print: only the resume is shown.
6. Refresh the page: data is still there. Export JSON, delete the resume, import the JSON: it returns.
7. Open /templates, /settings and refresh on /editor/<id>: routes still work (SPA rewrite).

## Deploy
Push to GitHub, import the repo in Vercel (framework: Vite, build `npm run build`, output `dist`). `vercel.json` handles SPA routing. No environment variables needed.
