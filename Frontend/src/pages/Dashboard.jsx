import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // This will be implemented later to fetch user's projects
    // For now just simulate loading
    setTimeout(() => {
      setLoading(false);
      // Placeholder data
      setProjects([]);
    }, 500);
  }, [currentUser]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Hello, {currentUser?.displayName || 'User'}</h1>
        <p>Welcome to your project dashboard</p>
      </div>

      <div className="dashboard-content">
        <div className="section">
          <div className="section-header">
            <h2>Your Projects</h2>
            <button className="create-btn">+ New Project</button>
          </div>
          
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span>{project.tasksCount} tasks</span>
                    <span>{project.membersCount} members</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You don't have any projects yet.</p>
                <button className="create-btn">Create your first project</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
