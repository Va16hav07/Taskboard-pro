import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProjects } from '../../services/projectService';
import NewProjectModal from './NewProjectModal';
import LoadingPage from '../common/LoadingPage';
import ErrorPage from '../common/ErrorPage';
import './Projects.css';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await getUserProjects();
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load projects. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleProjectCreated = () => {
    fetchProjects();
    setShowNewProjectModal(false);
  };
  
  if (loading) {
    return <LoadingPage message="Loading your projects..." />;
  }
  
  if (error) {
    return (
      <ErrorPage
        message="Could not load projects"
        details={error}
        onRetry={fetchProjects}
        backTo={{ path: "/dashboard", label: "Return to Dashboard" }}
      />
    );
  }
  
  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Your Projects</h1>
        <button 
          className="create-project-btn"
          onClick={() => setShowNewProjectModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Project
        </button>
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
      
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map(project => (
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id}
              className="project-card"
            >
              <h3>{project.title}</h3>
              <p className="project-description">
                {project.description || "No description provided"}
              </p>
              <div className="project-meta">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline', marginRight: '4px'}}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {project.members.length}
                </span>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline', marginRight: '4px'}}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-projects">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
            <p>You don't have any projects yet</p>
            <button 
              className="create-project-btn"
              onClick={() => setShowNewProjectModal(true)}
            >
              Create your first project
            </button>
          </div>
        )}
      </div>
      
      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}

export default ProjectList;
