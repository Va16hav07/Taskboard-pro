import { useState, useEffect } from 'react';
import { getProjectTasks, updateTaskStatus } from '../../services/taskService';
import TaskCard from './TaskCard';
import { SpinnerIcon } from '../common/Icons';
import './Tasks.css';

function KanbanBoard({ project, onTaskSelected, onTasksUpdated }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDragTask, setActiveDragTask] = useState(null);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getProjectTasks(project._id);
      // Add animation order to tasks
      const enhancedTasks = data.map((task, index) => ({
        ...task,
        animationOrder: index
      }));
      setTasks(enhancedTasks);
      setError(null);
      if (onTasksUpdated) onTasksUpdated(enhancedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [project._id]);
  
  const handleDragStart = (e, taskId) => {
    setActiveDragTask(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Add dragging class to the element for styling
    e.target.classList.add('dragging');
    
    // Create a drag image
    const dragImage = e.target.cloneNode(true);
    dragImage.style.opacity = '0.7';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    
    // Remove the drag image after it's been used
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };
  
  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Add visual indication for the drop target
    e.currentTarget.classList.add('drag-over');
  };
  
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };
  
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setActiveDragTask(null);
    // Clean up any remaining drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
  };
  
  const handleDrop = async (e, status) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    const taskToUpdate = tasks.find(task => task._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === status) return;
    
    try {
      // Optimistically update the UI
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status } : task
        )
      );
      
      // Make API call to update status
      await updateTaskStatus(taskId, status);
      fetchTasks(); // Refresh to get any other changes
    } catch (err) {
      console.error('Error moving task:', err);
      // Revert the optimistic update on failure
      fetchTasks();
    }
  };
  
  // Group tasks by status
  const tasksByStatus = {};
  project.statuses.forEach(status => {
    tasksByStatus[status] = tasks.filter(task => task.status === status);
  });
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <SpinnerIcon className="w-8 h-8" />
        <span>Loading tasks...</span>
      </div>
    );
  }
  
  return (
    <div className="kanban-board">
      {project.statuses.map((status, columnIndex) => (
        <div 
          key={status}
          className="kanban-column"
          style={{ '--animation-order': columnIndex }}
          onDragOver={(e) => handleDragOver(e, status)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="column-header">
            <h3>{status}</h3>
            <span className="task-count">{tasksByStatus[status]?.length || 0}</span>
          </div>
          
          <div className="task-list">
            {tasksByStatus[status] && tasksByStatus[status].length > 0 ? (
              tasksByStatus[status].map((task, taskIndex) => (
                <TaskCard 
                  key={task._id} 
                  task={task}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onClick={() => onTaskSelected(task)}
                  animationOrder={taskIndex}
                  isDragging={activeDragTask === task._id}
                />
              ))
            ) : (
              <div className="empty-column">
                Drop tasks here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
