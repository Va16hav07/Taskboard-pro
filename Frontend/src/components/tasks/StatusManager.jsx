import { useState, useEffect } from 'react';
import { updateProjectStatuses, deleteProjectStatus } from '../../services/taskService';
import { useNotification } from '../../context/NotificationContext';
import LoadingPage from '../common/LoadingPage';
import ErrorPage from '../common/ErrorPage';
import './Tasks.css';

function StatusManager({ project, onStatusesUpdated, isOwner }) {
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { showSuccess, showError } = useNotification();
  
  useEffect(() => {
    if (project && project.statuses) {
      setStatuses([...project.statuses]);
    }
  }, [project]);
  
  const handleAddStatus = async () => {
    if (!newStatus.trim()) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const updatedStatuses = [...statuses, newStatus.trim()];
      await updateProjectStatuses(project._id, updatedStatuses);
      
      setStatuses(updatedStatuses);
      setNewStatus('');
      showSuccess('Status added successfully');
      
      if (onStatusesUpdated) {
        onStatusesUpdated();
      }
    } catch (err) {
      setError('Failed to add status');
      showError('Failed to add status: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteStatus = async (statusToDelete) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteProjectStatus(project._id, statusToDelete);
      
      // Filter out the deleted status
      const updatedStatuses = statuses.filter(status => status !== statusToDelete);
      setStatuses(updatedStatuses);
      showSuccess('Status deleted successfully');
      
      if (onStatusesUpdated) {
        onStatusesUpdated();
      }
    } catch (err) {
      setError('Failed to delete status');
      showError('Failed to delete status: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingPage message="Updating statuses..." size="small" />;
  }
  
  if (error && !isSubmitting) {
    return (
      <ErrorPage
        message="Status Manager Error"
        details={error}
        onRetry={() => setError(null)}
      />
    );
  }
  
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
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="8" y2="21"></line>
          <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
        Manage Workflow Statuses
      </h3>
      
      {/* Add status form */}
      <div className="add-status-form">
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="Enter a new status name"
          disabled={isSubmitting || statuses.length >= 10}
        />
        <button
          className="add-status-btn"
          onClick={handleAddStatus}
          disabled={isSubmitting || !newStatus.trim() || statuses.length >= 10}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            <>Add Status</>
          )}
        </button>
      </div>
      
      {statuses.length >= 10 && (
        <div className="status-limit-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline', marginRight: '8px', verticalAlign: 'middle'}}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Maximum of 10 statuses allowed per project.
        </div>
      )}
      
      {/* Status list */}
      <div className="status-list">
        {statuses.map((status, index) => (
          <div className="status-item" key={index}>
            <span className="status-name">{status}</span>
            <button
              className="delete-status-btn"
              onClick={() => handleDeleteStatus(status)}
              disabled={statuses.length <= 1 || loading}
              title={statuses.length <= 1 ? "You need at least one status" : "Delete this status"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusManager;
