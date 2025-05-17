import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateTask, deleteTask, updateTaskStatus } from '../../services/taskService';
import Modal from '../common/Modal';
import CommentList from '../comments/CommentList';
import { formatDistanceToNow } from 'date-fns';
import { SpinnerIcon, CalendarIcon, TrashIcon, PencilIcon, ExclamationCircleIcon } from '../common/Icons';
import './Tasks.css';
import './TaskDetailModal.css';

function TaskDetailModal({ task, onClose, onTaskUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignee?.email || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [isUrgent, setIsUrgent] = useState(task.isUrgent || false);
  
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const { currentUser } = useAuth();
  
  // Reset form when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setAssignee(task.assignee?.email || '');
    setDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    );
    setIsUrgent(task.isUrgent || false);
    setIsEditing(false);
    setError(null);
  }, [task]);
  
  const isProjectOwner = () => {
    if (!task.project || !task.project.members) return false;
    
    return task.project.members.some(
      member => member.userId === currentUser?.uid && member.role === 'owner'
    );
  };
  
  const isAssignee = () => {
    return task.assignee && task.assignee.userId === currentUser?.uid;
  };

  const canChangeTaskStatus = () => {
    return isProjectOwner() || isAssignee();
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateTask(task._id, {
        title,
        description,
        status,
        assignee,
        dueDate: dueDate || undefined,
        isUrgent
      });
      
      setIsEditing(false);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteTask(task._id);
      onTaskUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      setIsSubmitting(true);
      await updateTaskStatus(task._id, e.target.value);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
      setIsSubmitting(false);
    }
  };
  
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'None';
    
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Is it overdue?
    const isOverdue = date < new Date() && task.status !== 'Done';
    
    return (
      <span className={isOverdue ? 'overdue-date' : ''}>
        {formatted}{' '}
        <span className="date-relative">
          ({formatDistanceToNow(date, { addSuffix: true })})
        </span>
        {isOverdue && <span className="overdue-badge">Overdue</span>}
      </span>
    );
  };

  // Generate avatar color based on email
  const getAvatarColor = (email) => {
    if (!email) return '#94a3b8';
    
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', 
      '#f97316', '#84cc16', '#06b6d4'
    ];
    
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const getDisplayName = (assignee) => {
    if (!assignee) return 'Unassigned';
    
    // If name is available, use it
    if (assignee.name) {
      return assignee.name;
    }
    
    // Otherwise use email without domain as fallback
    return assignee.email ? assignee.email.split('@')[0] : 'Unknown';
  };
  
  const modalFooter = isProjectOwner() ? (
    <div className="task-modal-actions">
      {showConfirmDelete ? (
        <div className="delete-confirmation">
          <span>Are you sure?</span>
          <button 
            onClick={() => setShowConfirmDelete(false)}
            className="modal-secondary-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="modal-danger-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      ) : (
        <>
          <button
            type="button" 
            onClick={() => setShowConfirmDelete(true)}
            className="modal-danger-btn"
            disabled={isEditing}
          >
            <TrashIcon className="w-4 h-4" />
            Delete Task
          </button>
          
          <div className="spacer"></div>
          
          {isEditing ? (
            <>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="modal-secondary-btn"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="edit-task-form"
                className="modal-primary-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon className="w-4 h-4" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="modal-primary-btn"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Task
            </button>
          )}
        </>
      )}
    </div>
  ) : null;
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        isEditing ? (
          <div className="editing-indicator">
            <PencilIcon className="w-5 h-5" />
            Edit Task
          </div>
        ) : (
          <div className="task-modal-title">
            <span>{task.title}</span>
            {task.isUrgent && <span className="task-urgent-flag">Urgent</span>}
          </div>
        )
      }
      size="large"
      footer={modalFooter}
    >
      <div className="task-detail-content">
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
        
        {isEditing ? (
          <form id="edit-task-form" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="title">Task Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                className="task-input"
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={5}
                className="task-input"
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="task-select"
                >
                  {task.project.statuses.map(statusOption => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="task-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="assignee">Assignee</label>
              <select
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="task-select"
              >
                <option value="">Unassigned</option>
                {task.project.members.map(member => (
                  <option key={member.email} value={member.email}>
                    {member.email}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="isUrgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <label htmlFor="isUrgent">Mark as urgent</label>
              </div>
            </div>
          </form>
        ) : (
          <>
            <div className="task-meta-section">
              <div className="task-meta-item">
                <span className="meta-label">Status</span>
                {isAssignee() ? (
                  <select
                    value={task.status}
                    onChange={handleStatusChange}
                    disabled={isSubmitting}
                    className="task-select"
                  >
                    {task.project?.statuses?.map(statusOption => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`meta-value status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {status}
                  </span>
                )}
              </div>
              
              <div className="task-meta-item">
                <span className="meta-label">Due Date</span>
                <span className="meta-value">
                  {task.dueDate ? (
                    <span className="due-date-value">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDateDisplay(task.dueDate)}
                    </span>
                  ) : (
                    <span className="no-date">No due date</span>
                  )}
                </span>
              </div>
              
              <div className="task-meta-item">
                <span className="meta-label">Assignee</span>
                <span className="meta-value">
                  {task.assignee ? (
                    <div className="assignee-info">
                      <div 
                        className="assignee-avatar"
                        style={{ backgroundColor: getAvatarColor(task.assignee.email) }}
                      >
                        {task.assignee.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="assignee-email">
                        {task.assignee.email}
                        {task.assignee.userId === currentUser?.uid && (
                          <span className="assigned-to-me-tag">You</span>
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="unassigned">Unassigned</span>
                  )}
                </span>
              </div>
              
              <div className="task-meta-item">
                <span className="meta-label">Created</span>
                <span className="meta-value">
                  {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </span>
              </div>

              {task.isUrgent && (
                <div className="task-meta-item">
                  <span className="meta-label">Priority</span>
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="w-4 h-4 mr-1 text-danger-500" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200">
                      Urgent
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="task-description-section">
              <h3>Description</h3>
              {task.description ? (
                <p className="task-description-text">{task.description}</p>
              ) : (
                <p className="no-description">No description provided</p>
              )}
            </div>
          </>
        )}
        
        <div className="task-comments-section">
          <CommentList taskId={task._id} projectId={task.projectId} />
        </div>
      </div>
    </Modal>
  );
}

export default TaskDetailModal;
