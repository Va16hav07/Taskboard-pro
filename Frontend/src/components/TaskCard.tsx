import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, UserIcon } from './common/Icons';

interface TaskAssignee {
  userId: string;
  email: string;
  name?: string; // Add name field
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  assignee?: TaskAssignee;
  isUrgent?: boolean;
  priority?: string; // Add priority field
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  currentUserId?: string;
  isDraggable?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  animationOrder?: number;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUserId,
  isDraggable = true,
  onClick,
  onDragStart,
  onDragEnd,
  animationOrder = 0,
  isDragging = false
}) => {
  const formatDate = (dateString?: string) => {
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
  const getAvatarColor = (assignee?: TaskAssignee) => {
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
  const getDisplayName = (assignee?: TaskAssignee) => {
    if (!assignee) return null;
    
    // If name is available, use it
    if (assignee.name) {
      return assignee.name;
    }
    
    // Otherwise use email without domain as fallback
    return assignee.email.split('@')[0];
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart && isDraggable) {
      onDragStart(e, task._id);
    }
  };
  
  return (
    <div 
      className={`task-card ${isDraggable ? 'draggable' : ''} ${task.isUrgent ? 'urgent' : ''} ${isDragging ? 'dragging' : ''} ${getPriorityClass()}`}
      style={{ '--animation-order': animationOrder } as React.CSSProperties}
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

export default TaskCard;