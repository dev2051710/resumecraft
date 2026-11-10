import { useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { Input, Textarea, Toggle } from '../components/Field';
import { isValidEmail, isValidUrl, resizeImage } from '../utils/resumeHelpers';

export default function PersonalInfo({ data, onChange, visibility, onVisibility }) {
  const [imgError, setImgError] = useState('');
  const set = (k, v) => onChange({ ...data, [k]: v });
  const urlErr = (k) => (data[k] && !isValidUrl(data[k]) ? 'Enter a valid URL (e.g. github.com/username)' : '');

  const onImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      set('image', await resizeImage(file));
      setImgError('');
    } catch (err) {
      setImgError(err.message);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-field text-zinc-600">
          {data.image ? <img src={data.image} alt="Profile" className="h-full w-full object-cover" /> : <Camera size={22} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <label className="btn-ghost cursor-pointer !py-1.5 text-xs">
              {data.image ? 'Change photo' : 'Add photo (optional)'}
              <input type="file" accept="image/*" className="hidden" onChange={onImage} />
            </label>
            {data.image && (
              <button type="button" className="btn-ghost !py-1.5 text-xs" onClick={() => set('image', '')}>
                <Trash2 size={13} /> Remove
              </button>
            )}
          </div>
          {imgError ? <p className="mt-1 text-xs text-red-400">{imgError}</p> : <p className="mt-1 text-xs text-zinc-500">Stays in your browser. Not used by the ATS template.</p>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Full name" value={data.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your full name" autoComplete="name" />
        <Input label="Professional title" value={data.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Software Developer" />
        <Input label="Email" type="email" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" error={data.email && !isValidEmail(data.email) ? 'Enter a valid email address' : ''} />
        <Input label="Phone number" type="tel" value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+00 00000 00000" />
        <Input label="Location" value={data.location} onChange={(e) => set('location', e.target.value)} placeholder="City, State, Country" />
        <Input label="LinkedIn URL" value={data.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/username" error={urlErr('linkedin')} />
        <Input label="GitHub URL" value={data.github} onChange={(e) => set('github', e.target.value)} placeholder="github.com/username" error={urlErr('github')} />
        <Input label="Portfolio URL" value={data.portfolio} onChange={(e) => set('portfolio', e.target.value)} placeholder="yourname.dev" error={urlErr('portfolio')} />
      </div>

      <Textarea
        label="Professional summary"
        rows={4}
        value={data.summary}
        onChange={(e) => set('summary', e.target.value)}
        placeholder="2–3 sentences about who you are, your strongest skills and what you are looking for."
        hint={`${data.summary.length} characters · 300–500 is a good length`}
      />

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Toggle label="Show summary on resume" checked={visibility.summary} onChange={(v) => onVisibility('summary', v)} />
        <Toggle label="Show photo on resume" checked={visibility.photo} onChange={(v) => onVisibility('photo', v)} />
      </div>
    </>
  );
}
