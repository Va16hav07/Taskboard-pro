import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, UserIcon } from './common/Icons';

// Remove TypeScript interfaces and use PropTypes instead
const TaskCard = ({
  task,
  currentUserId,
  isDraggable = true,
  onClick,
  onDragStart,
  onDragEnd,
  animationOrder = 0,
  isDragging = false
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'Done';
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
    return task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : '';
  };
  
  // Generate avatar color based on name or email
  const getAvatarColor = (assignee) => {
    if (!assignee) return '#94a3b8';
    
    // Use name if available, otherwise fall back to email
    const identifier = assignee.name || assignee.email;
    
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', 
      '#f97316', '#84cc16', '#06b6d4'
    ];
    
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get display name from assignee
  const getDisplayName = (assignee) => {
    if (!assignee) return null;
    
    // If name is available, use it
    if (assignee.name) {
      return assignee.name;
    }
    
    // Otherwise use email without domain as fallback
    return assignee.email.split('@')[0];
  };
  
  const handleDragStart = (e) => {
    if (onDragStart && isDraggable) {
      onDragStart(e, task._id);
    }
  };
  
  return (
    <div 
      className={`task-card ${isDraggable ? 'draggable' : ''} ${task.isUrgent ? 'urgent' : ''} ${isDragging ? 'dragging' : ''} ${getPriorityClass()}`}
      style={{ '--animation-order': animationOrder }}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <h3 className="task-title">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        {task.dueDate && (
          <div className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
            <CalendarIcon className="due-date-icon" />
            <span className="due-date-text">
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
        
        {task.assignee && (
          <div 
            className="assignee" 
            style={{ 
              backgroundColor: `${getAvatarColor(task.assignee)}15`, 
              color: getAvatarColor(task.assignee),
              borderLeft: `2px solid ${getAvatarColor(task.assignee)}`
            }}
          >
            {getDisplayName(task.assignee)}
            {task.assignee.userId === currentUserId && (
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
    </div>
  );
};

// Add PropTypes for type checking
import PropTypes from 'prop-types';

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    assignee: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string
    }),
    isUrgent: PropTypes.bool,
    priority: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  }).isRequired,
  currentUserId: PropTypes.string,
  isDraggable: PropTypes.bool,
  onClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  animationOrder: PropTypes.number,
  isDragging: PropTypes.bool
};

export default TaskCard;