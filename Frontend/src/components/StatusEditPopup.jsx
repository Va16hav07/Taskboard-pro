import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, XMarkIcon, CheckIcon } from './common/Icons';

// Remove TypeScript interface and use PropTypes instead
const StatusEditPopup = ({ 
  statuses, 
  onStatusesChanged, 
  onClose 
}) => {
  const [currentStatuses, setCurrentStatuses] = useState([...statuses]);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  
  const popupRef = useRef(null);
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  
  // Focus input when editing starts
  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleAddStatus = () => {
    if (!newStatus.trim()) return;
    
    if (currentStatuses.includes(newStatus.trim())) {
      setError('This status already exists');
      return;
    }
    
    if (currentStatuses.length >= 10) {
      setError('Maximum of 10 statuses allowed');
      return;
    }
    
    setCurrentStatuses([...currentStatuses, newStatus.trim()]);
    setNewStatus('');
    setError(null);
    
    // Focus back on input after adding
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleRemoveStatus = (index) => {
    if (currentStatuses.length <= 1) {
      setError('Cannot remove the last status');
      return;
    }
    
    const updatedStatuses = [...currentStatuses];
    updatedStatuses.splice(index, 1);
    setCurrentStatuses(updatedStatuses);
    setError(null);
  };
  
  const handleMoveStatus = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === currentStatuses.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...currentStatuses];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setCurrentStatuses(updated);
  };
  
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(currentStatuses[index]);
  };
  
  const saveEditing = () => {
    if (!editText.trim()) {
      setError('Status name cannot be empty');
      return;
    }
    
    if (editingIndex === null) return;
    
    const isDuplicate = currentStatuses.some(
      (status, idx) => idx !== editingIndex && status === editText.trim()
    );
    
    if (isDuplicate) {
      setError('This status already exists');
      return;
    }
    
    const updated = [...currentStatuses];
    updated[editingIndex] = editText.trim();
    setCurrentStatuses(updated);
    setEditingIndex(null);
    setError(null);
  };
  
  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'add') {
        handleAddStatus();
      } else {
        saveEditing();
      }
    } else if (e.key === 'Escape') {
      if (type === 'edit') {
        setEditingIndex(null);
      }
    }
  };
  
  const handleSave = () => {
    if (currentStatuses.length === 0) {
      setError('At least one status is required');
      return;
    }
    
    onStatusesChanged(currentStatuses);
    onClose();
  };
  
  return (
    <div className="status-edit-popup-overlay">
      <div className="status-edit-popup" ref={popupRef}>
        <div className="status-popup-header">
          <h3>Edit Workflow Statuses</h3>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="status-popup-error">
            {error}
          </div>
        )}
        
        <div className="status-list-container">
          {currentStatuses.map((status, index) => (
            <div key={`${status}-${index}`} className="status-item">
              {editingIndex === index ? (
                <div className="status-edit-form">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'edit')}
                    className="status-edit-input"
                  />
                  <div className="status-edit-actions">
                    <button 
                      onClick={() => setEditingIndex(null)}
                      className="status-cancel-btn"
                      title="Cancel"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={saveEditing}
                      className="status-save-btn"
                      title="Save"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span 
                    className="status-name"
                    onClick={() => startEditing(index)}
                  >
                    {status}
                  </span>
                  <div className="status-actions">
                    <button 
                      onClick={() => handleMoveStatus(index, 'up')}
                      disabled={index === 0}
                      className="status-move-btn"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveStatus(index, 'down')}
                      disabled={index === currentStatuses.length - 1}
                      className="status-move-btn"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => handleRemoveStatus(index)}
                      disabled={currentStatuses.length <= 1}
                      className="status-delete-btn"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="status-add-form">
          <input
            ref={inputRef}
            type="text"
            placeholder="New status..."
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            className="status-input"
            disabled={currentStatuses.length >= 10}
          />
          <button 
            onClick={handleAddStatus}
            className="status-add-btn"
            disabled={!newStatus.trim() || currentStatuses.length >= 10}
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>
        
        <div className="status-popup-footer">
          <button 
            onClick={onClose}
            className="status-cancel-button"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="status-save-button"
            disabled={currentStatuses.length === 0}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes for type checking
import PropTypes from 'prop-types';

StatusEditPopup.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  onStatusesChanged: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default StatusEditPopup;
