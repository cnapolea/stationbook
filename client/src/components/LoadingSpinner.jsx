const LoadingSpinner = ({
  size = 'md',
  color = 'text-blue-600',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const selectSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role='status'
      aria-label='loading'
    >
      <div
        className={`animate-spin rounded-full border-solid border-gray-200 broder-t-current ${selectSize} ${color}`}
      />
    </div>
  );
};

export default LoadingSpinner;
