import MaterialIcon from "./MaterialIcon";

/**
 * QuantityInput Component
 * Reusable quantity input with increment/decrement buttons
 *
 * @param {number} value - Current quantity value
 * @param {function} onChange - Callback function when quantity changes (receives new value)
 * @param {number} min - Minimum quantity (default: 1)
 * @param {number} max - Maximum quantity (default: Infinity)
 * @param {boolean} disabled - Whether input is disabled
 * @param {string} className - Additional CSS classes
 */
const QuantityInput = ({
  value,
  onChange,
  min = 1,
  max = Infinity,
  disabled = false,
  className = ''
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    const inputValue = parseInt(e.target.value) || min;
    const newValue = Math.max(min, Math.min(max, inputValue));
    onChange(newValue);
  };

  return (
    <div className={`w-fit flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MaterialIcon icon="remove" size={24} />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-16 px-3 py-1 text-body2 text-center border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MaterialIcon icon="add" size={24} />
      </button>
    </div>
  );
};

export default QuantityInput;

