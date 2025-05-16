import { useState } from 'react';
import { updateProjectStatuses, deleteProjectStatus } from '../../services/taskService';
import '../projects/Projects.css';

function StatusManager({ project, onStatusesUpdated, isOwner }) {
  const [statuses, setStatuses] = useState(project.statuses || []);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddStatus = () => {
    if (!newStatus.trim()) {
      setError('Status name cannot be empty');
      return;
    }
    
    if (statuses.includes(newStatus.trim())) {
      setError('Status already exists');
      return;
    }
    
    if (statuses.length >= 4) {
      setError('Maximum of 4 statuses are allowed');
      return;
    }
    
    setStatuses([...statuses, newStatus.trim()]);
    setNewStatus('');
    setError('');
  };
  
  const handleDeleteStatus = async (statusToDelete) => {
    if (statuses.length <= 1) {
      setError('Cannot delete the last status. Projects must have at least one status.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the status "${statusToDelete}"? All tasks with this status will be moved to another status.`)) {
      try {
        setIsSubmitting(true);
        await deleteProjectStatus(project._id, statusToDelete);
        
        // Update local state
        setStatuses(statuses.filter(status => status !== statusToDelete));
        onStatusesUpdated();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete status');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleSaveStatuses = async () => {
    if (statuses.length === 0) {
      setError('At least one status is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateProjectStatuses(project._id, statuses);
      setError('');
      onStatusesUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update statuses');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOwner) {
    return null;
  }
  
  return (
    <div className="status-manager">
      <h3>Manage Statuses</h3>
      
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
      
      <div className="status-list">
        {statuses.map((status, index) => (
          <div key={index} className="status-item">
            <span className="status-name">{status}</span>
            <button 
              type="button" 
              className="delete-status-btn" 
              onClick={() => handleDeleteStatus(status)}
              disabled={isSubmitting || statuses.length <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className="add-status-form">
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="New status name"
          disabled={isSubmitting || statuses.length >= 4}
        />
        <button 
          type="button" 
          className="add-status-btn"
          onClick={handleAddStatus}
          disabled={isSubmitting || statuses.length >= 4}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Status
        </button>
      </div>
      
      {statuses.length >= 4 && (
        <div className="status-limit-warning">
          You've reached the maximum of 4 statuses.
        </div>
      )}
      
      <div className="status-actions">
        <button 
          type="button" 
          className="save-btn"
          onClick={handleSaveStatuses}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>Save Changes</>
          )}
        </button>
      </div>
    </div>
  );
}

export default StatusManager;
