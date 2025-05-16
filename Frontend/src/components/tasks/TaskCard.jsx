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
  
  return (
    <>
      <div 
        className={`task-card 
          ${canMoveTask() ? 'draggable' : ''} 
          ${isOverdue() ? 'overdue' : ''} 
          ${task.isUrgent ? 'urgent' : ''}
        `}
        draggable={canMoveTask()}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
      >
        <h4 className="task-title">
          {task.isUrgent && <span className="priority-indicator" title="Urgent">⚠️ </span>}
          {task.title}
        </h4>
        
        {task.description && (
          <p className="task-description">{task.description.substring(0, 50)}
            {task.description.length > 50 && '...'}
          </p>
        )}
        
        <div className="task-meta">
          {task.dueDate && (
            <span className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
              <span className="due-date-icon">{isOverdue() ? '⚠️' : '🕒'}</span>
              <span className="due-date-text">
                {isOverdue() ? 'Overdue ' : 'Due '}
                {formatDate(task.dueDate)}
              </span>
            </span>
          )}
          
          {task.assignee?.email && (
            <span className="assignee">
              {task.assignee.email.split('@')[0]}
              {task.assignee.userId === currentUser?.uid && 
                <span className="assigned-to-me" title="Assigned to me">✓</span>
              }
            </span>
          )}
        </div>
        
        {/* Quick actions buttons that appear on hover */}
        <div className="task-actions">
          {canMoveTask() && (
            <>
              <button className="task-action-btn" title="Edit task">✏️</button>
              {task.assignee?.userId !== currentUser?.uid && (
                <button className="task-action-btn" title="Assign to me">👤</button>
              )}
            </>
          )}
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
