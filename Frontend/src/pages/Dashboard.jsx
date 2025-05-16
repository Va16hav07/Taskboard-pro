import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProjects } from '../services/projectService';
import { testAuthentication, checkToken } from '../utils/authUtils';
import AssignedTasks from '../components/dashboard/AssignedTasks';
import './Pages.css';

function Dashboard() {
  const { currentUser, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    // Check token validity
    const tokenStatus = checkToken();
    setAuthStatus(tokenStatus);
    
    async function fetchProjects() {
      try {
        // Test authentication first
        const authTest = await testAuthentication();
        console.log('Auth test result:', authTest);
        
        if (authTest.success) {
          const projectsData = await getUserProjects();
          setProjects(projectsData.slice(0, 4)); // Show only the first 4 projects
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser && token) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [currentUser, token]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hello, {currentUser?.displayName || 'User'}</h1>
          <p className="text-gray-600 mt-2">Welcome to your project dashboard</p>
        </div>
        
        {authStatus && !authStatus.valid && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{authStatus.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-3 py-1 bg-white border border-yellow-300 hover:bg-yellow-50 text-yellow-800 rounded text-sm font-medium transition-colors duration-200"
                >
                  Refresh session
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-lg text-gray-800">Assigned Tasks</h2>
            </div>
            <div className="p-6">
              <AssignedTasks />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800">Your Projects</h2>
              <Link 
                to="/projects" 
                className="text-[#0052CC] hover:text-[#0747A6] text-sm font-medium flex items-center transition-colors duration-200"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="p-6">
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map(project => (
                    <Link 
                      to={`/projects/${project._id}`} 
                      key={project._id}
                      className="block p-4 border border-gray-200 rounded-md hover:border-[#0052CC] hover:bg-blue-50 transition-all duration-200 group cursor-pointer"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2 group-hover:text-[#0052CC] transition-colors duration-200">{project.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                          </svg>
                          <span>{project.members.length} members</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-gray-600 mb-4">You don't have any projects yet.</p>
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center px-4 py-2 bg-[#0052CC] hover:bg-[#0747A6] text-white text-sm font-medium rounded transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create your first project
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
