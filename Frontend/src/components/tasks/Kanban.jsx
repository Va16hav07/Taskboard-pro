import { useState, useEffect, useCallback, useContext } from 'react';
import { getProjectTasks, updateTaskStatus } from '../../services/taskService';
import { useSocket } from '../../context/SocketContext';
import NewTaskModal from './NewTaskModal';
import TaskCard from './TaskCard';
import LoadingPage from '../common/LoadingPage';
import ErrorPage from '../common/ErrorPage';
import './Tasks.css';

function Kanban({ project, isOwner }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [movingTask, setMovingTask] = useState(null);
  
  const { socket } = useSocket();
  
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await getProjectTasks(project._id);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks for this project.');
    } finally {
      setLoading(false);
    }
  }, [project._id]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  // Set up real-time updates
  useEffect(() => {
    if (!socket) return;
    
    // Join project room to receive updates
    if (project && project._id) {
      socket.emit('join-project', project._id);
    }
    
    // Listen for task events
    const handleTaskCreated = (newTask) => {
      if (newTask.projectId === project._id) {
        setTasks(prev => [...prev, newTask]);
      }
    };
    
    const handleTaskUpdated = (updatedTask) => {
      if (updatedTask.projectId === project._id) {
        setTasks(prev => prev.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        ));
      }
    };
    
    const handleTaskDeleted = ({ taskId, projectId }) => {
      if (projectId === project._id) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
      }
    };
    
    socket.on('task-created', handleTaskCreated);
    socket.on('task-updated', handleTaskUpdated);
    socket.on('task-deleted', handleTaskDeleted);
    
    // Clean up listeners
    return () => {
      if (socket) {
        socket.off('task-created', handleTaskCreated);
        socket.off('task-updated', handleTaskUpdated);
        socket.off('task-deleted', handleTaskDeleted);
        
        // Leave the project room
        if (project && project._id) {
          socket.emit('leave-project', project._id);
        }
      }
    };
  }, [socket, project]);
  
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task._id);
    setMovingTask(task);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = async (e, status) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('taskId');
    
    if (!taskId || !movingTask) return;
    
    // Don't update if dropping in the same status
    if (movingTask.status === status) {
      return;
    }
    
    try {
      // Optimistic update
      setTasks(prevTasks => prevTasks.map(task => 
        task._id === taskId ? { ...task, status } : task
      ));
      
      // API call to update task status
      await updateTaskStatus(taskId, status);
      
      // Note: We don't need to refresh tasks here since we'll get a websocket update
      
    } catch (error) {
      // Revert optimistic update on failure
      console.error('Failed to update task status:', error);
      
      // Revert the change
      setTasks(prevTasks => [...prevTasks]);
      fetchTasks(); // Refresh the tasks to ensure consistency
    } finally {
      setMovingTask(null);
    }
  };
  
  const handleTaskAdded = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    setShowNewTaskModal(false);
  };
  
  if (loading) {
    return <LoadingPage message="Loading tasks..." size="small" />;
  }
  
  if (error) {
    return (
      <ErrorPage
        message="Could not load tasks"
        details={error}
        onRetry={fetchTasks}
      />
    );
  }
  
  return (
    <div className="kanban-container">
      <div className="kanban-header">
        {isOwner && (
          <button 
            className="new-task-btn"
            onClick={() => setShowNewTaskModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Task
          </button>
        )}
      </div>
      
      <div className="kanban-board">
        {project.statuses.map(status => (
          <div 
            key={status} 
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="kanban-column-header">
              <h3>{status}</h3>
              <span className="task-count">
                {tasks.filter(task => task.status === status).length}
              </span>
            </div>
            
            <div className="task-list">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDragStart={handleDragStart}
                    isOwner={isOwner}
                  />
                ))}
                
              {tasks.filter(task => task.status === status).length === 0 && (
                <div className="empty-column">
                  <p>No tasks yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showNewTaskModal && (
        <NewTaskModal
          project={project}
          onClose={() => setShowNewTaskModal(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
    </div>
  );
}

export default Kanban;
