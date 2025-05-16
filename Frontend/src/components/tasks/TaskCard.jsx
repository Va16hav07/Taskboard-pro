import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';
import './Tasks.css';

function TaskCard({ task, onTaskUpdated, onDragStart, onClick }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const handleTaskUpdated = () => {
    setShowDetailModal(false);
    if (onTaskUpdated) onTaskUpdated();
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick(task);
    } else {
      setShowDetailModal(true);
    }
  };
  
  return (
    <>
      <div 
        className="task-card"
        draggable
        onDragStart={(e) => onDragStart(e, task._id)}
        onClick={handleClick}
      >
        <h4 className="task-title">{task.title}</h4>
        
        {task.description && (
          <p className="task-description">{task.description.substring(0, 50)}
            {task.description.length > 50 && '...'}
          </p>
        )}
        
        <div className="task-meta">
          {task.dueDate && (
            <span className="due-date">Due {formatDate(task.dueDate)}</span>
          )}
          
          {task.assignee?.email && (
            <span className="assignee">
              {task.assignee.email.split('@')[0]}
            </span>
          )}
        </div>
      </div>
      
      {showDetailModal && !onClick && (
        <TaskDetailModal
          task={task}
          project={task.project}
          onClose={() => setShowDetailModal(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </>
  );
}

export default TaskCard;
