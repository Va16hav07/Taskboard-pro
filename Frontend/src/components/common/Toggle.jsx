import { useId } from 'react';

/**
 * A reusable toggle switch component with enhanced styling
 */
function Toggle({ 
  checked, 
  onChange, 
  label, 
  disabled = false, 
  id: propId, 
  labelPosition = 'right',
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = propId || `toggle-${generatedId}`;
  
  const sizeClasses = {
    sm: {
      container: "w-8 h-4",
      circle: "h-3 w-3",
      translate: "translate-x-4",
      textSize: "text-xs",
    },
    md: {
      container: "w-11 h-6",
      circle: "h-5 w-5",
      translate: "translate-x-5",
      textSize: "text-sm",
    },
    lg: {
      container: "w-14 h-7",
      circle: "h-6 w-6",
      translate: "translate-x-7",
      textSize: "text-base",
    }
  };
  
  const colorClasses = {
    primary: "peer-checked:bg-blue-600 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800",
    success: "peer-checked:bg-green-600 peer-focus:ring-green-300 dark:peer-focus:ring-green-800",
    warning: "peer-checked:bg-yellow-600 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800",
    danger: "peer-checked:bg-red-600 peer-focus:ring-red-300 dark:peer-focus:ring-red-800",
    purple: "peer-checked:bg-purple-600 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800",
  };
  
  return (
    <label 
      htmlFor={id} 
      className={`inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {labelPosition === 'left' && label && (
        <span className={`mr-3 ${sizeClasses[size].textSize} font-medium text-gray-700 dark:text-gray-300`}>
          {label}
        </span>
      )}
      
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={disabled ? undefined : onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div 
          className={`
            ${sizeClasses[size].container} 
            bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-opacity-30
            dark:bg-gray-700 rounded-full peer 
            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
            after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
            after:transition-all peer-disabled:after:bg-gray-200
            dark:border-gray-600 ${colorClasses[color]}
            ${sizeClasses[size].circle}
          `}
        ></div>
      </div>
      
      {labelPosition === 'right' && label && (
        <span className={`ml-3 ${sizeClasses[size].textSize} font-medium text-gray-700 dark:text-gray-300`}>
          {label}
        </span>
      )}
    </label>
  );
}

export default Toggle;
