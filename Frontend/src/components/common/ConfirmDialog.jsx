import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { ExclamationCircleIcon } from './Icons';

/**
 * A reusable confirmation dialog component with enhanced styling
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when the dialog should close
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmLabel - Label for the confirm button
 * @param {string} props.cancelLabel - Label for the cancel button
 * @param {Function} props.onConfirm - Function to call when the user confirms
 * @param {string} props.confirmStyle - Style for the confirm button (primary, danger, success)
 */
function ConfirmDialog({
  isOpen,
  onClose,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmStyle = 'danger',
  isLoading = false
}) {
  const [confirming, setConfirming] = useState(false);
  
  // Reset confirming state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setConfirming(false);
    }
  }, [isOpen]);
  
  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
      onClose();
    }
  };
  
  const footer = (
    <>
      <Button 
        variant="secondary"
        onClick={onClose}
        disabled={confirming}
        size="md"
      >
        {cancelLabel}
      </Button>
      <Button 
        variant={confirmStyle}
        onClick={handleConfirm}
        isLoading={confirming}
        loadingText={`${confirmLabel}ing...`}
        size="md"
      >
        {confirmLabel}
      </Button>
    </>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={confirming ? undefined : onClose}
      title={title}
      size="small"
      footer={footer}
    >
      <div className="confirm-dialog-content">
        <div className="confirm-dialog-icon">
          {confirmStyle === 'danger' ? (
            <ExclamationCircleIcon className="w-10 h-10 text-red-500" />
          ) : confirmStyle === 'success' ? (
            <svg className="w-10 h-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          )}
        </div>
        <div className="confirm-dialog-message">
          {message}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;

// Add these styles to Modal.css
// .confirm-dialog-content {
//   display: flex;
//   align-items: flex-start;
//   gap: 16px;
//   padding: 8px 0;
// }
// 
// .confirm-dialog-message {
//   flex: 1;
//   font-size: 1rem;
//   line-height: 1.5;
//   color: var(--color-text);
// }
// 
// .confirm-dialog-icon {
//   flex-shrink: 0;
// }
