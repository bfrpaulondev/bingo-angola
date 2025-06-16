// components/Input.jsx
import clsx from 'clsx';

export default function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className={clsx(
          'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none',
          error ? 'border-red-500' : 'border-slate-300'
        )}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
