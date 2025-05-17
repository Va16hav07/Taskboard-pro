import { forwardRef } from 'react';

/**
 * A reusable button component with enhanced styles
 */
const Button = forwardRef(({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props 
}, ref) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium border rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-transparent focus:ring-blue-500 shadow-sm hover:shadow",
    secondary: "bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border-gray-300 focus:ring-blue-500 shadow-sm hover:shadow dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600",
    danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-transparent focus:ring-red-500 shadow-sm hover:shadow",
    success: "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-transparent focus:ring-green-500 shadow-sm hover:shadow",
    ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 border-transparent focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-800",
    link: "bg-transparent text-blue-600 hover:text-blue-700 border-transparent underline-offset-4 hover:underline p-0 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
  };
  
  const sizeClasses = {
    xs: "text-xs px-2 py-1 gap-1",
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-3",
    xl: "text-lg px-8 py-4 gap-3",
  };
  
  const disabledClasses = (disabled || isLoading) ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer";
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Loading spinner element
  const spinnerElement = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && spinnerElement}
      {!isLoading && iconPosition === 'left' && icon && <span className="btn-icon">{icon}</span>}
      {isLoading ? loadingText : children}
      {!isLoading && iconPosition === 'right' && icon && <span className="btn-icon">{icon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
