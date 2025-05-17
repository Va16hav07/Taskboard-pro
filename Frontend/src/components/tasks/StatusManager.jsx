import { useState } from 'react';
import { updateProjectStatuses, deleteProjectStatus } from '../../services/taskService';
import { SpinnerIcon, PlusIcon } from '../common/Icons';
import './Tasks.css';

function StatusManager({ project, onStatusesUpdated, isOwner }) {
  const [statuses, setStatuses] = useState([...project.statuses]);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedStatus, setDraggedStatus] = useState(null);

  const handleAddStatus = () => {
    if (!newStatus.trim()) {
      setError('Status name cannot be empty');
      return;
    }

    if (statuses.includes(newStatus.trim())) {
      setError('This status already exists');
      return;
    }

    if (statuses.length >= 10) {
      setError('Maximum of 10 statuses allowed');
      return;
    }

    setStatuses([...statuses, newStatus.trim()]);
    setNewStatus('');
    setError(null);
  };

  const handleRemoveStatus = async (statusToRemove) => {
    if (statuses.length <= 1) {
      setError('Cannot remove the last status. Projects must have at least one status.');
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteProjectStatus(project._id, statusToRemove);
      onStatusesUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const newStatuses = [...statuses];
    [newStatuses[index - 1], newStatuses[index]] = [newStatuses[index], newStatuses[index - 1]];
    setStatuses(newStatuses);
  };

  const handleMoveDown = (index) => {
    if (index === statuses.length - 1) return;
    
    const newStatuses = [...statuses];
    [newStatuses[index], newStatuses[index + 1]] = [newStatuses[index + 1], newStatuses[index]];
    setStatuses(newStatuses);
  };

  const handleSaveChanges = async () => {
    if (statuses.length === 0) {
      setError('Projects must have at least one status');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProjectStatuses(project._id, statuses);
      onStatusesUpdated();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update statuses');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (e, status, index) => {
    setDraggedStatus({ status, index });
    e.dataTransfer.effectAllowed = 'move';
    // Needed for Firefox
    e.dataTransfer.setData('text/plain', status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (draggedStatus === null) return;
    
    const { index: sourceIndex } = draggedStatus;
    if (sourceIndex === targetIndex) return;
    
    const newStatuses = [...statuses];
    const [movedStatus] = newStatuses.splice(sourceIndex, 1);
    newStatuses.splice(targetIndex, 0, movedStatus);
    
    setStatuses(newStatuses);
    setDraggedStatus(null);
  };

  if (!isOwner) {
    return (
      <div className="no-access-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <p>Only project owners can manage statuses</p>
      </div>
    );
  }

  return (
    <div className="status-manager">
      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
      
      <p className="note">
        <strong>Note:</strong> Rearrange statuses by dragging them or using the arrow buttons. Changes to statuses will be reflected immediately in the task board.
      </p>
      
      <div className="status-list">
        {statuses.map((status, index) => (
          <div 
            key={`status-${index}`}
            className="status-item"
            draggable
            onDragStart={(e) => handleDragStart(e, status, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <span className="status-name">{status}</span>
            <div className="status-actions">
              <button 
                type="button"
                className="icon-btn"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0 || isSubmitting}
                title="Move up"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>
              <button 
                type="button"
                className="icon-btn"
                onClick={() => handleMoveDown(index)}
                disabled={index === statuses.length - 1 || isSubmitting}
                title="Move down"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
              <button 
                type="button"
                className="icon-btn remove"
                onClick={() => handleRemoveStatus(status)}
                disabled={statuses.length <= 1 || isSubmitting}
                title="Delete status"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="add-status-form">
        <input
          type="text"
          placeholder="New status name..."
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          disabled={isSubmitting || statuses.length >= 10}
        />
        <button 
          type="button" 
          className="add-status-btn"
          onClick={handleAddStatus}
          disabled={!newStatus.trim() || isSubmitting || statuses.length >= 10}
        >
          <PlusIcon className="w-4 h-4" />
          Add Status
        </button>
      </div>
      
      <div className="status-actions">
        <button 
          className="submit-btn"
          onClick={handleSaveChanges}
          disabled={isSubmitting || statuses.length === 0}
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="w-4 h-4" />
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default StatusManager;
