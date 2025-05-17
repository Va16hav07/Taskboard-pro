import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../../context/AuthContext';
import './Tasks.css';

function TaskCard({ task, onTaskUpdated, onDragStart, onClick }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { currentUser } = useAuth();
  
  // Check if current user can move this task (owner or assignee)
  const canMoveTask = () => {
    if (!currentUser) return false;
    
    // User is assigned this task
    if (task.assignee && task.assignee.userId === currentUser.uid) {
      return true;
    }
    
    // User is project owner
    if (task.project && task.project.members) {
      const isOwner = task.project.members.some(
        member => member.userId === currentUser.uid && member.role === 'owner'
      );
      
      if (isOwner) {
        return true;
      }
    }
    
    return false;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const handleTaskUpdated = () => {
    setShowDetailModal(false);
    if (onTaskUpdated) onTaskUpdated();
  };
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(task);
    } else {
      setShowDetailModal(true);
    }
  };
  
  const handleDragStart = (e) => {
    const canMove = canMoveTask();
    
    if (canMove) {
      // Add a visual indication of dragging
      e.currentTarget.classList.add('dragging');
      onDragStart(e, task._id);
    } else {
      e.preventDefault();
    }
  };
  
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };
  
  // Determine if task is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now && task.status !== 'Done';
  };

  // Generate avatar color based on name or email
  const getAvatarColor = (userIdentifier) => {
    if (!userIdentifier) return '#94a3b8';
    
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', 
      '#f97316', '#84cc16', '#06b6d4'
    ];
    
    let hash = 0;
    for (let i = 0; i < userIdentifier.length; i++) {
      hash = userIdentifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get display name from assignee
  const getDisplayName = (assignee) => {
    if (!assignee) return 'Unassigned';
    
    // If name is available, use it
    if (assignee.name) {
      return assignee.name;
    }
    
    // Otherwise use email without domain as fallback
    return assignee.email ? assignee.email.split('@')[0] : 'Unknown';
  };

  // Get priority class and label
  const getPriorityClass = () => {
    switch(task.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };
  
  const getPriorityLabel = () => {
    return task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Normal';
  };
  
  return (
    <>
      <div 
        className={`task-card ${canMoveTask() ? 'draggable' : ''} ${task.isUrgent ? 'urgent' : ''} ${getPriorityClass()}`}
        draggable={canMoveTask()}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
      >
        <h3 className="task-title">{task.title}</h3>
        
        {task.description && (
          <p className="task-description line-clamp-2">{task.description}</p>
        )}
        
        <div className="task-meta">
          {task.dueDate && (
            <span className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
              <svg className="due-date-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="due-date-text">
                {isOverdue() ? 'Overdue ' : ''}
                {formatDate(task.dueDate)}
              </span>
            </span>
          )}
          
          {task.assignee && (
            <div 
              className="assignee" 
              style={{ 
                backgroundColor: `${getAvatarColor(task.assignee.name || task.assignee.email)}15`, 
                color: getAvatarColor(task.assignee.name || task.assignee.email),
                borderLeft: `2px solid ${getAvatarColor(task.assignee.name || task.assignee.email)}`
              }}
            >
              {getDisplayName(task.assignee)}
              {task.assignee.userId === currentUser?.uid && (
                <span className="assigned-to-me" title="Assigned to me">✓</span>
              )}
            </div>
          )}
          
          {task.priority && (
            <div className={`priority-badge ${getPriorityClass()}`}>
              {getPriorityLabel()}
            </div>
          )}
        </div>
        
        {task.isUrgent && (
          <div className="urgent-badge">Urgent</div>
        )}
        
        {/* Quick action buttons that appear on hover */}
        <div className="task-actions">
          <button 
            className="edit-action"
            onClick={(e) => { 
              e.stopPropagation(); 
              onClick ? onClick(task) : setShowDetailModal(true); 
            }}
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {showDetailModal && !onClick && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowDetailModal(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </>
  );
}

export default TaskCard;
