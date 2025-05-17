import { useState } from 'react';
import { createAutomation, updateAutomation } from '../../services/automationService.js';
import './Automations.css';

function AutomationForm({ project, automation = null, isEditing = false, onClose, onAutomationCreated, onAutomationUpdated }) {
  const [name, setName] = useState(automation?.name || '');
  const [triggerType, setTriggerType] = useState(automation?.trigger?.type || 'STATUS_CHANGE');
  const [fromStatus, setFromStatus] = useState(automation?.trigger?.fromStatus || project.statuses[0]);
  const [toStatus, setToStatus] = useState(automation?.trigger?.toStatus || project.statuses[0]);
  const [assigneeEmail, setAssigneeEmail] = useState(automation?.trigger?.assigneeEmail || '');
  const [actionType, setActionType] = useState(automation?.action?.type || 'MOVE_TASK');
  const [targetStatus, setTargetStatus] = useState(automation?.action?.targetStatus || project.statuses[0]);
  const [badgeName, setBadgeName] = useState(automation?.action?.badgeName || '');
  const [notificationText, setNotificationText] = useState(automation?.action?.notificationText || '');
  const [notifyAssignee, setNotifyAssignee] = useState(automation?.action?.notifyAssignee ?? true);
  const [notifyCreator, setNotifyCreator] = useState(automation?.action?.notifyCreator ?? false);
  const [notifyProjectOwners, setNotifyProjectOwners] = useState(automation?.action?.notifyProjectOwners ?? false);
  const [isActive, setIsActive] = useState(automation?.isActive ?? true);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Automation name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Build the automation object
      const automationData = {
        projectId: project._id,
        name,
        isActive,
        trigger: {
          type: triggerType,
        },
        action: {
          type: actionType,
        }
      };

      // Add trigger details based on type
      switch (triggerType) {
        case 'STATUS_CHANGE':
          automationData.trigger.fromStatus = fromStatus;
          automationData.trigger.toStatus = toStatus;
          break;
        case 'ASSIGNMENT_CHANGE':
          automationData.trigger.assigneeEmail = assigneeEmail;
          break;
      }

      // Add action details based on type
      switch (actionType) {
        case 'MOVE_TASK':
          automationData.action.targetStatus = targetStatus;
          break;
        case 'ASSIGN_BADGE':
          automationData.action.badgeName = badgeName;
          break;
        case 'SEND_NOTIFICATION':
          automationData.action.notificationText = notificationText;
          automationData.action.notifyAssignee = notifyAssignee;
          automationData.action.notifyCreator = notifyCreator;
          automationData.action.notifyProjectOwners = notifyProjectOwners;
          break;
      }

      if (isEditing) {
        await updateAutomation(automation._id, automationData);
        onAutomationUpdated();
      } else {
        await createAutomation(automationData);
        onAutomationCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save automation');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content automation-form-modal">
        <div className="modal-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            {isEditing ? 'Edit Automation' : 'Create New Automation'}
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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
            
            <div className="form-group">
              <label htmlFor="automationName">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '6px'}}>
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
                Automation Name *
              </label>
              <input
                type="text"
                id="automationName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a descriptive name"
                required
                autoFocus
              />
            </div>
            
            <div className="form-section">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Trigger
              </h3>
              <div className="form-group">
                <label htmlFor="triggerType">When should this automation run?</label>
                <select
                  id="triggerType"
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value)}
                >
                  <option value="STATUS_CHANGE">When task status changes</option>
                  <option value="ASSIGNMENT_CHANGE">When task is assigned</option>
                  <option value="DUE_DATE_PASSED">When task due date passes</option>
                </select>
              </div>
              
              {/* Conditional trigger fields */}
              {triggerType === 'STATUS_CHANGE' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fromStatus">From Status</label>
                      <select
                        id="fromStatus"
                        value={fromStatus}
                        onChange={(e) => setFromStatus(e.target.value)}
                      >
                        {project.statuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="toStatus">To Status</label>
                      <select
                        id="toStatus"
                        value={toStatus}
                        onChange={(e) => setToStatus(e.target.value)}
                      >
                        {project.statuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              {triggerType === 'ASSIGNMENT_CHANGE' && (
                <div className="form-group">
                  <label htmlFor="assigneeEmail">Assigned To</label>
                  <select
                    id="assigneeEmail"
                    value={assigneeEmail}
                    onChange={(e) => setAssigneeEmail(e.target.value)}
                  >
                    <option value="">Select a member</option>
                    {project.members.map(member => (
                      <option key={member.email} value={member.email}>
                        {member.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Action
              </h3>
              <div className="form-group">
                <label htmlFor="actionType">What should happen?</label>
                <select
                  id="actionType"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                >
                  <option value="MOVE_TASK">Move task to a status</option>
                  <option value="ASSIGN_BADGE">Assign a badge</option>
                  <option value="SEND_NOTIFICATION">Send a notification</option>
                </select>
              </div>
              
              {/* Conditional action fields */}
              {actionType === 'MOVE_TASK' && (
                <div className="form-group">
                  <label htmlFor="targetStatus">Move To Status</label>
                  <select
                    id="targetStatus"
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                  >
                    {project.statuses.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {actionType === 'ASSIGN_BADGE' && (
                <div className="form-group">
                  <label htmlFor="badgeName">Badge Name</label>
                  <input
                    type="text"
                    id="badgeName"
                    value={badgeName}
                    onChange={(e) => setBadgeName(e.target.value)}
                    placeholder="e.g., Task Master, Problem Solver"
                  />
                </div>
              )}
              
              {actionType === 'SEND_NOTIFICATION' && (
                <>
                  <div className="form-group">
                    <label htmlFor="notificationText">Notification Message</label>
                    <textarea
                      id="notificationText"
                      value={notificationText}
                      onChange={(e) => setNotificationText(e.target.value)}
                      placeholder="Enter notification message"
                      rows={3}
                    />
                  </div>
                  
                  <div className="checkbox-group">
                    <label>Who should be notified?</label>
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="notifyAssignee"
                        checked={notifyAssignee}
                        onChange={(e) => setNotifyAssignee(e.target.checked)}
                      />
                      <label htmlFor="notifyAssignee">Task assignee</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="notifyCreator"
                        checked={notifyCreator}
                        onChange={(e) => setNotifyCreator(e.target.checked)}
                      />
                      <label htmlFor="notifyCreator">Task creator</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="notifyProjectOwners"
                        checked={notifyProjectOwners}
                        onChange={(e) => setNotifyProjectOwners(e.target.checked)}
                      />
                      <label htmlFor="notifyProjectOwners">Project owners</label>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="status-toggle">
              <label htmlFor="isActive">
                <span style={{fontWeight: 500}}>Automation Status</span>
                <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--color-gray-500)'}}>
                  {isActive ? 'Automation is active and will run automatically' : 'Automation is inactive and will not run'}
                </span>
              </label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <label htmlFor="isActive" className="toggle-label">
                  <span className="toggle-text">{isActive ? 'Active' : 'Inactive'}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditing ? 'Update Automation' : 'Create Automation'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AutomationForm;
