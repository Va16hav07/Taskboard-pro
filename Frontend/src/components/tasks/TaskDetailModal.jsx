import { useState } from 'react';
import { format } from 'date-fns';
import { updateTask, deleteTask, updateTaskStatus } from '../../services/taskService';
import CommentList from '../comments/CommentList';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import Toggle from '../common/Toggle';
import ConfirmDialog from '../common/ConfirmDialog';
import './Tasks.css';

function TaskDetailModal({ task, onClose, onTaskUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignee?.email || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Additional settings with toggles
  const [isUrgent, setIsUrgent] = useState(task.isUrgent || false);
  
  const { currentUser } = useAuth();
  
  // Check if current user is project owner
  const isProjectOwner = () => {
    return task.project?.members?.some(
      member => member.userId === currentUser?.uid && member.role === 'owner'
    );
  };
  
  // Check if current user is task assignee
  const isTaskAssignee = () => {
    return task.assignee && task.assignee.userId === currentUser?.uid;
  };
  
  // Check if user can change task status
  const canChangeTaskStatus = () => {
    return isProjectOwner() || isTaskAssignee();
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Build update object with only changed fields
      const updates = {};
      if (title !== task.title) updates.title = title;
      if (description !== (task.description || '')) updates.description = description;
      if (status !== task.status) updates.status = status;
      if (assignee !== (task.assignee?.email || '')) updates.assignee = assignee || null;
      if (dueDate !== (task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '')) {
        updates.dueDate = dueDate || null;
      }
      if (isUrgent !== (task.isUrgent || false)) updates.isUrgent = isUrgent;
      
      await updateTask(task._id, updates);
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      setIsSubmitting(false);
    }
  };
  
  const handleStatusChange = async (e) => {
    try {
      setChangingStatus(true);
      await updateTaskStatus(task._id, e.target.value);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setChangingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  // View Mode Content
  const renderViewMode = () => (
    <>
      <div className="task-detail-content">
        <div className="task-meta-section">
          <div className="task-meta-item">
            <span className="meta-label">Status:</span>
            {isTaskAssignee() ? (
              <select
                value={task.status}
                onChange={handleStatusChange}
                disabled={changingStatus}
                className="status-select"
              >
                {task.project?.statuses?.map(statusOption => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>  
            ) : (
              <span className="meta-value status-badge">{task.status}</span>
            )}
          </div>
          
          <div className="task-meta-item">
            <span className="meta-label">Assignee:</span>
            <span className="meta-value">
              {task.assignee?.email || 'Unassigned'}
              {isProjectOwner() && (
                <button 
                  className="quick-assign-btn"
                  onClick={() => setIsEditing(true)}
                  title="Assign this task"
                  type="button"
                >
                  <span className="assign-icon">✎</span>
                </button>
              )}
            </span>
          </div>
          
          <div className="task-meta-item">
            <span className="meta-label">Due Date:</span>
            <span className="meta-value">{formatDate(task.dueDate)}</span>
          </div>
          
          <div className="task-meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{formatDate(task.createdAt)}</span>
          </div>

          {task.isUrgent && (
            <div className="task-meta-item">
              <span className="meta-label">Priority:</span>
              <span className="meta-value urgent-badge">Urgent</span>
            </div>
          )}
        </div>
        
        <div className="task-description-section">
          <h3>Description</h3>
          <p>{task.description || 'No description provided.'}</p>
        </div>
      </div>
      
      <div className="task-comments-section">
        <CommentList taskId={task._id} projectId={task.projectId} />
      </div>
    </>
  );
  
  // Edit Mode Content
  const renderEditMode = () => (
    <form id="edit-task-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={4}
        ></textarea>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {task.project?.statuses?.map(statusOption => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="assignee">Assignee (Email)</label>
        <select
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="">Unassigned</option>
          {task.project?.members?.map(member => (
            <option key={member.email} value={member.email}>
              {member.email}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group toggle-container">
        <Toggle 
          checked={isUrgent}
          onChange={(e) => setIsUrgent(e.target.checked)}
          label="Mark as urgent"
          id="task-urgent-toggle"
        />
      </div>
    </form>
  );
  
  // Modal footer based on mode
  const renderFooter = () => {
    if (isEditing) {
      return (
        <>
          <button 
            type="button" 
            className="modal-secondary-btn" 
            onClick={() => setIsEditing(false)}
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      );
    }
    
    return isProjectOwner() && (
      <>
        <button 
          type="button"
          className="modal-danger-btn" 
          onClick={() => setShowConfirmDelete(true)}
          disabled={isSubmitting}
        >
          Delete
        </button>
        <button 
          type="button"
          className="modal-primary-btn" 
          onClick={() => setIsEditing(true)}
          disabled={isSubmitting}
        >
          Edit
        </button>
      </>
    );
  };
  
  return (
    <>
      <Modal 
        isOpen={true}
        onClose={onClose}
        title={isEditing ? "Edit Task" : task.title}
        size="large"
        className="task-detail-modal"
        footer={renderFooter()}
      >
        {isEditing ? renderEditMode() : renderViewMode()}
      </Modal>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        confirmStyle="danger"
      />
    </>
  );
}

export default TaskDetailModal;
