/**
 * Button Component
 * Reusable button component with variants
 *
 * @param {string} variant - Button variant: 'primary', 'secondary', 'danger', 'outline' (default: 'primary')
 * @param {string} size - Button size: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} fullWidth - Whether button should take full width (default: false)
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Button content
 * @param {object} props - Other button props (onClick, type, etc.)
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border border-black text-black hover:border-gray-700 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
    text: 'text-black hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed px-0'
  };

  const sizeStyles = {
    sm: 'p-button-padding-sm text-body2 gap-button-gap-sm',
    md: 'p-button-padding-md text-body1 gap-button-gap-md',
    lg: 'p-button-padding-lg text-body1 gap-button-gap-lg'
  };

  const baseStyles = 'flex items-center justify-center rounded-full transition-colors focus:outline-none';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

