import { useId } from 'react';

/**
 * A reusable toggle switch component
 * 
 * @param {Object} props
 * @param {boolean} props.checked - Whether the toggle is checked
 * @param {Function} props.onChange - Function to call when the toggle changes
 * @param {string} props.label - Label for the toggle
 * @param {boolean} props.disabled - Whether the toggle is disabled
 * @param {string} props.id - Optional ID for the input element
 */
function Toggle({ checked, onChange, label, disabled = false, id: propId }) {
  // Generate a unique ID if not provided
  const generatedId = useId();
  const id = propId || `toggle-${generatedId}`;
  
  return (
    <label htmlFor={id} className="toggle-label">
      <div className="toggle-text">{label}</div>
      <div className="toggle-switch">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <span className="toggle-slider"></span>
      </div>
    </label>
  );
}

export default Toggle;
