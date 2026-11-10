import ModernTemplate from './ModernTemplate';
import AtsTemplate from './AtsTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';

export const TEMPLATES = [
  { id: 'modern', name: 'Modern Professional', description: 'Clean layout with accent headings, skill chips and balanced spacing.', features: ['Optional photo', 'Colored accents', 'Skill chips'], Component: ModernTemplate },
  { id: 'ats', name: 'ATS Friendly', description: 'Single column, simple headings, no graphics. Easiest for applicant tracking systems to read.', features: ['Plain text layout', 'No photo or graphics', 'Standard headings'], Component: AtsTemplate },
  { id: 'minimal', name: 'Minimal', description: 'Airy, minimalist design with a quiet date column and elegant light typography.', features: ['Lots of white space', 'Date column', 'Light typography'], Component: MinimalTemplate },
  { id: 'executive', name: 'Executive', description: 'Serif typography with strong section hierarchy for a premium, formal look.', features: ['Serif typography', 'Bold rules', 'Formal hierarchy'], Component: ExecutiveTemplate },
];

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
