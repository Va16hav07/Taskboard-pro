import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../../services/projectService';
import { getTaskById } from '../../services/taskService';
import MembersList from './MembersList';
import InviteMemberModal from './InviteMemberModal';
import Kanban from '../tasks/Kanban';
import TaskDetailModal from '../tasks/TaskDetailModal';
import AutomationList from '../automations/AutomationList';
import { useAuth } from '../../context/AuthContext';
import { getTaskIdFromUrl } from '../../utils/urlUtils';
import StatusManager from '../tasks/StatusManager';
import './Projects.css';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // For direct task links
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);
  
  const { currentUser } = useAuth();
  
  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      setTitle(projectData.title);
      setDescription(projectData.description || '');
      setError(null);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProject();
    
    // Check if there's a task ID in the URL
    const taskId = getTaskIdFromUrl();
    if (taskId) {
      setTaskLoading(true);
      getTaskById(taskId)
        .then(task => {
          setSelectedTask(task);
        })
        .catch(err => {
          console.error('Error loading task:', err);
        })
        .finally(() => {
          setTaskLoading(false);
        });
    }
  }, [projectId]);
  
  const handleSaveChanges = async () => {
    try {
      await updateProject(projectId, { title, description });
      setIsEditing(false);
      fetchProject();
    } catch (err) {
      setError('Failed to update project');
      console.error(err);
    }
  };
  
  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
        console.error(err);
      }
    }
  };
  
  const isOwner = () => {
    if (!project) return false;
    return project.members.some(member => 
      member.userId === project.createdBy && member.role === 'owner'
    );
  };

  const isProjectOwner = () => {
    if (!project) return false;
    return project.members.some(member => 
      member.userId === currentUser?.uid && member.role === 'owner'
    );
  };
  
  const handleMemberInvited = () => {
    setShowInviteModal(false);
    fetchProject();
  };
  
  const handleTaskModalClosed = () => {
    setSelectedTask(null);
    // Remove the task parameter from URL
    navigate(`/projects/${projectId}`, { replace: true });
  };
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading project details...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {error}
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="not-found">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Project not found</h2>
        <p>The project you're looking for doesn't exist or you don't have access to it.</p>
        <button 
          className="back-button" 
          onClick={() => navigate('/projects')}
          style={{backgroundColor: '#f1f5f9', padding: '8px 16px', borderRadius: '6px'}}
        >
          Return to Projects
        </button>
      </div>
    );
  }
  
  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <div 
          className="back-button" 
          onClick={() => navigate('/projects')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Projects
        </div>
        
        {isEditing ? (
          <div className="project-edit-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="project-title-input"
              placeholder="Project Title"
              autoFocus
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="project-description-input"
              placeholder="Project Description"
              rows={3}
            ></textarea>
            <div className="edit-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setIsEditing(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSaveChanges}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="project-info">
            <h1>{project?.title}</h1>
            <p className="project-description">
              {project?.description || 
                <span style={{color: '#94a3b8', fontStyle: 'italic'}}>No description provided</span>
              }
            </p>
            {isProjectOwner() && (
              <div className="project-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => setIsEditing(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Project
                </button>
                <button 
                  className="delete-btn" 
                  onClick={handleDeleteProject}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Delete Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="project-members-section">
        <div className="section-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Project Members
          </h2>
          {isProjectOwner() && (
            <button 
              className="invite-btn" 
              onClick={() => setShowInviteModal(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Invite Member
            </button>
          )}
        </div>
        <MembersList 
          members={project?.members || []} 
          projectId={projectId} 
          onMemberRemoved={fetchProject} 
          isOwner={isProjectOwner()}
        />
      </div>
      
      {showInviteModal && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInviteModal(false)}
          onMemberInvited={handleMemberInvited}
        />
      )}

      {/* Add Kanban board below the members section */}
      {project && (
        <div className="project-tasks-section">
          <div className="section-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="15" y2="13"></line>
                <line x1="9" y1="17" x2="11" y2="17"></line>
              </svg>
              Tasks
            </h2>
          </div>
          <Kanban 
            project={project} 
            isOwner={isProjectOwner()}
          />
        </div>
      )}
      
      {project && isProjectOwner() && (
        <div className="project-automations-section">
          <div className="section-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Automations
            </h2>
          </div>
          <AutomationList 
            project={project} 
            isOwner={isProjectOwner()} 
          />
        </div>
      )}

      {project && isProjectOwner() && (
        <div className="project-status-section">
          <div className="section-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Status Management
            </h2>
          </div>
          <StatusManager 
            project={project} 
            onStatusesUpdated={fetchProject} 
            isOwner={isProjectOwner()} 
          />
        </div>
      )}
      
      {/* Task detail modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={handleTaskModalClosed}
          onTaskUpdated={fetchProject}
        />
      )}
    </div>
  );
}

export default ProjectDetail;
