// components/Button.jsx
export default function Button({ children, className='', ...props }) {
  return (
    <button
      {...props}
      className={
        'bg-accent text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition ' +
        className
      }>
      {children}
    </button>
  );
}