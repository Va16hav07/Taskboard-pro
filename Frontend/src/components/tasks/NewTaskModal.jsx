import { useState } from 'react';
import { createTask } from '../../services/taskService';
import Modal from '../common/Modal';
import './Tasks.css';

function NewTaskModal({ project, onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(project.statuses[0]);
  const [assignee, setAssignee] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [priority, setPriority] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createTask({
        title,
        description,
        projectId: project._id,
        status,
        assignee,
        assigneeName,  // Include the assignee name 
        dueDate: dueDate || undefined,
        isUrgent,
        priority
      });
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      setIsSubmitting(false);
    }
  };

  // Handle assignee change - extract name from members
  const handleAssigneeChange = (e) => {
    const email = e.target.value;
    setAssignee(email);
    
    if (email) {
      // Find the member with this email to get their name
      const selectedMember = project.members.find(member => member.email === email);
      if (selectedMember && selectedMember.name) {
        setAssigneeName(selectedMember.name);
      } else {
        // If no name available, use the email local part
        setAssigneeName(email.split('@')[0]);
      }
    } else {
      setAssigneeName('');
    }
  };
  
  const modalFooter = (
    <>
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
        form="new-task-form" 
        className="submit-btn" 
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : 'Create Task'}
      </button>
    </>
  );
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Task
        </div>
      }
      size="medium"
      footer={modalFooter}
    >
      <form id="new-task-form" onSubmit={handleSubmit}>
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
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
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
            rows={4}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {project.statuses.map(statusOption => (
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
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="assignee">Assignee</label>
            <select
              id="assignee"
              value={assignee}
              onChange={handleAssigneeChange}
            >
              <option value="">Unassigned</option>
              {project.members.map(member => (
                <option key={member.email} value={member.email}>
                  {member.name || member.email.split('@')[0]} ({member.email})
                </option>
              ))}
            </select>
            <small className="text-muted">The assigned person will receive a notification</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">Normal</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default NewTaskModal;
