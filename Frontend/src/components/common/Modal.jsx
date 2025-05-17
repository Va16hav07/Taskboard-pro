import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import { XMarkIcon } from './Icons';
import FocusTrap from 'focus-trap-react';

/**
 * A reusable modal component that renders content in a portal
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  hideCloseButton = false,
  footer,
  className = '',
}) {
  const modalRef = useRef(null);
  
  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Close when clicking outside the modal
  const handleOverlayClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };
  
  // Don't render if the modal is not open
  if (!isOpen) return null;
  
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    auto: 'max-w-fit',
  };
  
  // Determine size class for the modal
  const sizeClass = `modal-${size}`;
  
  // Render the modal in a portal
  return ReactDOM.createPortal(
    <FocusTrap focusTrapOptions={{ initialFocus: false }}>
      <div 
        className="modal-overlay"
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div 
          ref={modalRef}
          className={`modal-content ${sizeClass} ${className}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="modal-header">
            {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
            {!hideCloseButton && (
              <button 
                className="modal-close-btn"
                aria-label="Close"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Modal Body */}
          <div className="modal-body">
            {children}
          </div>
          
          {/* Modal Footer */}
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </FocusTrap>,
    document.body
  );
}

export default Modal;
