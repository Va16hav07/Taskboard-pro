import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserTasks } from '../../services/taskService';
import { getRecentProjects } from '../../services/projectService';
import { formatDistanceToNow, isPast, isToday, isTomorrow, format } from 'date-fns';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  // Stats data
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    tasksInProgress: 0,
    overdueTasks: 0,
    projectsCount: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks assigned to the user
        const tasksData = await getUserTasks();
        setTasks(tasksData);
        
        // Fetch recent projects
        const projectsData = await getRecentProjects();
        setRecentProjects(projectsData);
        
        // Calculate stats
        const completed = tasksData.filter(task => task.status.toLowerCase() === 'done').length;
        const inProgress = tasksData.filter(task => task.status.toLowerCase() === 'in progress').length;
        const overdue = tasksData.filter(task => {
          if (!task.dueDate) return false;
          return isPast(new Date(task.dueDate)) && task.status.toLowerCase() !== 'done';
        }).length;
        
        setStats({
          tasksCompleted: completed,
          tasksInProgress: inProgress,
          overdueTasks: overdue,
          projectsCount: projectsData.length
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    if (filter === 'overdue') {
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        return isPast(new Date(task.dueDate)) && task.status.toLowerCase() !== 'done';
      });
    }
    if (filter === 'today') {
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        return isToday(new Date(task.dueDate));
      });
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.status.toLowerCase() === 'done');
    }
    return tasks;
  };
  
  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';
    
    const date = new Date(dueDate);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isPast(date)) {
      return `${formatDistanceToNow(date)} ago`;
    } else {
      return format(date, 'MMM d');
    }
  };
  
  const getDueDateClass = (dueDate) => {
    if (!dueDate) return '';
    
    const date = new Date(dueDate);
    
    if (isPast(date)) {
      return 'overdue';
    } else if (isToday(date) || isTomorrow(date)) {
      return 'upcoming';
    }
    return '';
  };
  
  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, '-');
  };
  
  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'to do') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      );
    } else if (statusLower === 'in progress') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
        </svg>
      );
    } else if (statusLower === 'done') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4m0 4h.01"></path>
        </svg>
      );
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Tasks Completed</div>
          <div className="stat-value">{stats.tasksCompleted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Tasks In Progress</div>
          <div className="stat-value">{stats.tasksInProgress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Overdue Tasks</div>
          <div className="stat-value">{stats.overdueTasks}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Active Projects</div>
          <div className="stat-value">{stats.projectsCount}</div>
        </div>
      </div>
      
      <div className="assigned-tasks">
        <div className="section-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            My Tasks
          </h2>
          <div className="section-actions">
            <select 
              className="filter-dropdown" 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due Today</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="tasks-loading">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading your tasks...
          </div>
        ) : error ? (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="tasks-table">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task._id}>
                    <td>
                      <Link 
                        to={`/projects/${task.projectId._id || task.projectId}?task=${task._id}`}
                        className="task-link"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        </svg>
                        {task.title}
                      </Link>
                      <span className="project-name">
                        {task.projectId.title || 'Unknown Project'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <span className={`due-date ${getDueDateClass(task.dueDate)}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDueDate(task.dueDate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-tasks">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <p>No tasks found</p>
            <span className="subtext">
              {filter !== 'all' ? 'Try changing your filter' : 'You don\'t have any tasks assigned to you yet'}
            </span>
          </div>
        )}
      </div>
      
      {recentProjects.length > 0 && (
        <div className="recent-projects">
          <div className="section-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Recent Projects
            </h2>
          </div>
          
          <div className="projects-grid">
            {recentProjects.map(project => (
              <Link 
                key={project._id} 
                to={`/projects/${project._id}`}
                className="recent-project-card"
              >
                <h3>{project.title}</h3>
                <div className="recent-project-meta">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    {project.members.length}
                  </span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
