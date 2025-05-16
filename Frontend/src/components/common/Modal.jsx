import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

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
  
  // Render the modal in a portal
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        ref={modalRef}
        className={`modal-content modal-${size} ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          {!hideCloseButton && (
            <button 
              className="modal-close-btn" 
              aria-label="Close"
              onClick={onClose}
              type="button"
            >
              &times;
            </button>
          )}
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
