/**
 * A reusable button component with Tailwind CSS
 */
function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center transition-colors";
  
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:ring-primary-500",
    danger: "bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500",
    success: "bg-success-600 hover:bg-success-700 text-white focus:ring-success-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-primary-500"
  };
  
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };
  
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
