import Modal from './Modal';
import './Modal.css';

/**
 * A reusable confirmation dialog component
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
  confirmStyle = 'danger'
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  const getButtonClass = () => {
    switch (confirmStyle) {
      case 'danger':
        return 'modal-danger-btn';
      case 'primary':
        return 'modal-primary-btn';
      case 'success':
        return 'modal-success-btn';
      default:
        return 'modal-primary-btn';
    }
  };
  
  const footer = (
    <>
      <button 
        type="button" 
        className="modal-secondary-btn" 
        onClick={onClose}
      >
        {cancelLabel}
      </button>
      <button 
        type="button"
        onClick={handleConfirm}
        className={getButtonClass()}
      >
        {confirmLabel}
      </button>
    </>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={footer}
    >
      <p className="confirm-dialog-message">{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;
