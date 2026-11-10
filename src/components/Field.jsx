export function Field({ label, error, hint, className = '', children }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      {children}
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export function Input({ label, error, hint, className = '', value, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      <input className={`input ${error ? 'border-red-500/60' : ''}`} value={value ?? ''} {...props} />
    </Field>
  );
}

export function Textarea({ label, error, hint, className = '', value, rows = 3, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      <textarea className={`input resize-y leading-relaxed ${error ? 'border-red-500/60' : ''}`} rows={rows} value={value ?? ''} {...props} />
    </Field>
  );
}

export function Select({ label, options, className = '', value, ...props }) {
  return (
    <Field label={label} className={className}>
      <select className="input" value={value ?? ''} {...props}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-zinc-300">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-line bg-field accent-violet-500" />
      {label}
    </label>
  );
}
