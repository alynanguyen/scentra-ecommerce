/**
 * StatusBadge Component
 * Reusable status badge component for order statuses and other status indicators
 *
 * @param {string} status - The status value (e.g., 'processing', 'delivered', 'cancelled')
 * @param {string} size - Badge size: 'sm', 'md' (default: 'md')
 * @param {string} className - Additional CSS classes
 */
const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const statusColors = {
    processing: 'bg-processing-bg text-processing-text',
    confirmed: 'bg-confirmed-bg text-confirmed-text',
    shipped: 'bg-shipped-bg text-shipped-text',
    delivered: 'bg-delivered-bg text-delivered-text',
    cancelled: 'bg-cancelled-bg text-cancelled-text',
    // Default fallback
    default: 'bg-gray-100 text-gray-800'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-overline',
    md: 'px-3 py-1 text-overline',
    lg: 'px-4 py-1.5 text-body2'
  };

  const colorClass = statusColors[status] || statusColors.default;
  const formattedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : '';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeStyles[size]} ${className}`}>
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;

