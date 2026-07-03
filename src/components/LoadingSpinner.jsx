
export default function LoadingSpinner({ size = 'md', color = 'primary' }) {
  // Size mapping
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  // Color mapping (Adjust colors to match your theme)
  const colorClasses = {
    primary: 'border-t-[#10B981] border-r-transparent border-b-transparent border-l-transparent', // Green matching your theme
    slate: 'border-t-slate-500 border-r-transparent border-b-transparent border-l-transparent',
    white: 'border-t-white border-r-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`
          animate-spin 
          rounded-full 
          border-slate-800
          ${sizeClasses[size] || sizeClasses.md} 
          ${colorClasses[color] || colorClasses.primary}
        `}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}