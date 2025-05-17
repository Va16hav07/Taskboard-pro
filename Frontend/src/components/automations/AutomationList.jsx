import { useState, useEffect } from 'react';
import { getProjectAutomations, deleteAutomation } from '../../services/automationService.js';
import AutomationForm from './AutomationForm';
import './Automations.css';

function AutomationList({ project, isOwner }) {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewAutomationForm, setShowNewAutomationForm] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const data = await getProjectAutomations(project._id);
      setAutomations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load automations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, [project._id]);

  const handleDeleteAutomation = async (automationId) => {
    try {
      await deleteAutomation(automationId);
      setShowDeleteConfirm(null);
      fetchAutomations();
    } catch (err) {
      setError('Failed to delete automation');
      console.error(err);
    }
  };

  const handleAutomationCreated = () => {
    setShowNewAutomationForm(false);
    fetchAutomations();
  };

  const handleAutomationUpdated = () => {
    setEditingAutomation(null);
    fetchAutomations();
  };

  const renderTriggerDetails = (trigger) => {
    switch (trigger.type) {
      case 'STATUS_CHANGE':
        return (
          <span>When task moves from <strong className="text-primary">{trigger.fromStatus}</strong> to <strong className="text-primary">{trigger.toStatus}</strong></span>
        );
      case 'ASSIGNMENT_CHANGE':
        return (
          <span>When task is assigned to <strong className="text-primary">{trigger.assigneeEmail}</strong></span>
        );
      case 'DUE_DATE_PASSED':
        return (
          <span>When task due date passes</span>
        );
      default:
        return <span>Unknown trigger type</span>;
    }
  };

  const renderActionDetails = (action) => {
    switch (action.type) {
      case 'ASSIGN_BADGE':
        return (
          <span>Assign badge: <strong className="text-primary">{action.badgeName}</strong></span>
        );
      case 'MOVE_TASK':
        return (
          <span>Move task to status: <strong className="text-primary">{action.targetStatus}</strong></span>
        );
      case 'SEND_NOTIFICATION':
        return (
          <span>Send notification to {renderNotificationRecipients(action)}</span>
        );
      default:
        return <span>Unknown action type</span>;
    }
  };
  
  const renderNotificationRecipients = (action) => {
    const recipients = [];
    if (action.notifyAssignee) recipients.push('task assignee');
    if (action.notifyCreator) recipients.push('task creator');
    if (action.notifyProjectOwners) recipients.push('project owners');
    
    if (recipients.length === 0) return 'no one';
    return recipients.join(', ');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
        Loading automations...
      </div>
    );
  }

  return (
    <div className="automations-container">
      <div className="automations-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
          Workflow Automations
        </h2>
        {isOwner && (
          <button 
            className="create-automation-btn"
            onClick={() => setShowNewAutomationForm(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Automation
          </button>
        )}
      </div>

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

      {automations.length === 0 ? (
        <div className="empty-automations">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <p>No automations set up yet.</p>
          {isOwner && (
            <button 
              className="create-automation-btn"
              onClick={() => setShowNewAutomationForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create your first automation
            </button>
          )}
        </div>
      ) : (
        <div className="automation-list">
          {automations.map((automation) => (
            <div 
              key={automation._id} 
              className={`automation-card ${!automation.isActive ? 'inactive' : ''}`}
            >
              <div className="automation-header">
                <h3>{automation.name}</h3>
                <div className="automation-status">
                  <span className={`status-indicator ${automation.isActive ? 'active' : 'inactive'}`}>
                    {automation.isActive ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                        Active
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6l-12 12"></path>
                          <path d="M6 6l12 12"></path>
                        </svg>
                        Inactive
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="automation-details">
                <div className="automation-section">
                  <div className="section-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Trigger:
                  </div>
                  <div className="section-content">
                    {renderTriggerDetails(automation.trigger)}
                  </div>
                </div>
                
                <div className="automation-section">
                  <div className="section-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Action:
                  </div>
                  <div className="section-content">
                    {renderActionDetails(automation.action)}
                  </div>
                </div>
              </div>
              
              {isOwner && (
                <div className="automation-actions">
                  {showDeleteConfirm === automation._id ? (
                    <>
                      <span style={{marginRight: 'auto', fontSize: '0.875rem', color: 'var(--color-gray-600)'}}>
                        Confirm delete?
                      </span>
                      <button 
                        className="cancel-btn" 
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteAutomation(automation._id)}
                      >
                        Yes, Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="edit-btn" 
                        onClick={() => setEditingAutomation(automation)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => setShowDeleteConfirm(automation._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                        </svg>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOwner && showNewAutomationForm && (
        <AutomationForm
          project={project}
          onClose={() => setShowNewAutomationForm(false)}
          onAutomationCreated={handleAutomationCreated}
        />
      )}

      {isOwner && editingAutomation && (
        <AutomationForm
          project={project}
          automation={editingAutomation}
          isEditing={true}
          onClose={() => setEditingAutomation(null)}
          onAutomationUpdated={handleAutomationUpdated}
        />
      )}
    </div>
  );
}

export default AutomationList;
