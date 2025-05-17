import { useState, useEffect } from 'react';
import { getProjectTasks, updateTaskStatus } from '../../services/taskService';
import TaskCard from './TaskCard';
import NewTaskModal from './NewTaskModal';
import EditStatusesModal from './EditStatusesModal';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import './Tasks.css';

function Kanban({ project, isOwner }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditStatusesModal, setShowEditStatusesModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { currentUser } = useAuth();
  const { socket, joinProject, leaveProject } = useSocket();
  
  const isProjectOwner = () => {
    return project.members.some(
      member => member.userId === currentUser?.uid && member.role === 'owner'
    );
  };
  
  // Enhance tasks with project data
  const enhanceTasksWithProjectData = (tasks) => {
    return tasks.map(task => ({
      ...task,
      project: {
        _id: project._id,
        title: project.title,
        statuses: project.statuses,
        members: project.members
      }
    }));
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getProjectTasks(project._id);
      // Enhance tasks with project data
      const enhancedTasks = enhanceTasksWithProjectData(data);
      setTasks(enhancedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
    
    // Join the project socket room
    joinProject(project._id);
    
    // Set up socket event listeners for real-time updates
    if (socket) {
      socket.on('task-created', (newTask) => {
        if (newTask.projectId === project._id) {
          // Enhance the new task with project data
          const enhancedTask = {
            ...newTask,
            project: {
              _id: project._id,
              title: project.title,
              statuses: project.statuses,
              members: project.members
            }
          };
          setTasks(prevTasks => [...prevTasks, enhancedTask]);
        }
      });
      
      socket.on('task-updated', (updatedTask) => {
        if (updatedTask.projectId === project._id) {
          // Enhance the updated task with project data
          const enhancedTask = {
            ...updatedTask,
            project: {
              _id: project._id,
              title: project.title,
              statuses: project.statuses,
              members: project.members
            }
          };
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task._id === enhancedTask._id ? enhancedTask : task
            )
          );
        }
      });
      
      socket.on('task-deleted', ({ taskId, projectId }) => {
        if (projectId === project._id) {
          setTasks(prevTasks => 
            prevTasks.filter(task => task._id !== taskId)
          );
        }
      });
      
      socket.on('comment-added', ({ taskId, projectId }) => {
        if (projectId === project._id) {
          // Just trigger a refresh of the affected task
          fetchTasks();
        }
      });
    }
    
    // Clean up
    return () => {
      leaveProject(project._id);
      if (socket) {
        socket.off('task-created');
        socket.off('task-updated');
        socket.off('task-deleted');
        socket.off('comment-added');
      }
    };
  }, [project._id, socket, joinProject, leaveProject]);
  
  const handleDragStart = (e, taskId) => {
    // Add the task ID as data
    e.dataTransfer.setData('taskId', taskId);
    
    // Give visual feedback
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Add visual indication for the drop target
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    // Remove visual indication when dragging leaves
    e.currentTarget.classList.remove('drag-over');
  };
  
  const handleDrop = async (e, status) => {
    e.preventDefault();
    // Remove visual indication
    e.currentTarget.classList.remove('drag-over');
    
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    try {
      await updateTaskStatus(taskId, status);
      
      // Optimistically update the UI before the task update comes via socket
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error('Error moving task:', err);
      fetchTasks(); // Refresh on error to ensure UI is in sync
    }
  };
  
  const handleTaskCreated = () => {
    setShowNewTaskModal(false);
    fetchTasks();
  };
  
  const handleStatusesUpdated = () => {
    setShowEditStatusesModal(false);
    fetchTasks();
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };
  
  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };
  
  const handleTaskUpdated = () => {
    fetchTasks();
    setSelectedTask(null);
  };
  
  if (loading) {
    return (
      <div className="loading-spinner">
        Loading tasks...
      </div>
    );
  }
  
  // Group tasks by status
  const tasksByStatus = {};
  project.statuses.forEach(status => {
    tasksByStatus[status] = tasks.filter(task => task.status === status);
  });
  
  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <rect x="7" y="7" width="3" height="9"></rect>
            <rect x="14" y="7" width="3" height="5"></rect>
          </svg>
          Tasks Board
        </h2>
        <div className="kanban-actions">
          {isOwner && (
            <>
              <button 
                className="edit-statuses-btn"
                onClick={() => setShowEditStatusesModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Edit Statuses
              </button>
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
            </>
          )}
        </div>
      </div>
      
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
      
      <div className="kanban-board">
        {project.statuses.map((status, index) => (
          <div 
            key={status}
            className="kanban-column"
            style={{ '--animation-order': index }}
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
                    onTaskUpdated={fetchTasks}
                    onDragStart={handleDragStart}
                    onClick={handleTaskClick}
                    style={{ '--animation-order': taskIndex }}
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
      
      {isOwner && showNewTaskModal && (
        <NewTaskModal 
          project={project}
          onClose={() => setShowNewTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
      
      {isOwner && showEditStatusesModal && (
        <EditStatusesModal
          project={project}
          onClose={() => setShowEditStatusesModal(false)}
          onStatusesUpdated={handleStatusesUpdated}
        />
      )}
      
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={handleCloseTaskDetail}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}

export default Kanban;
