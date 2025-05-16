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
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse flex flex-col items-center px-4 text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600/50 to-indigo-600/50 mb-5 animate-bounce"></div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
      {/* Header section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoLTJ2MkgxNnYyaDJ2MTRoLTJ2MmgydjJoMnYtMmgxNHYyaDJ2LTJoMnYtMmgtMnYtMTRoMnYtMmgtMnYyem0wIDJ2MTRIMjBWMjBoMTZ2MTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-[0.07]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Hello, <span className="inline-block">{currentUser?.displayName || 'User'}</span>
          </h1>
          <p className="text-purple-100 mt-2 opacity-90 text-sm sm:text-base">
            Welcome to your project dashboard
          </p>
        </div>
      </div>
      
      {/* Main content section - Removed negative margin and added proper spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Alert message with proper spacing */}
        <div className="mb-6">
          {authStatus && !authStatus.valid && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-3 sm:p-4 mb-6 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center flex-1">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">{authStatus.message}</p>
                  </div>
                </div>
                <div className="sm:ml-auto">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="w-full sm:w-auto px-3 py-1.5 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    Refresh session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card grid with proper spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Assigned Tasks</h2>
            </div>
            <div className="p-6">
              <AssignedTasks />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Your Projects</h2>
              <Link 
                to="/projects" 
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium flex items-center transition-colors duration-200"
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
                      className="block p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200 group cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 dark:from-purple-500/10 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">{project.title}</h3>
                          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex -space-x-2 mr-3">
                            {[...Array(Math.min(3, project.members.length))].map((_, i) => (
                              <div key={i} className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 border border-white dark:border-gray-800 shadow-sm">
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                            {project.members.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 border border-white dark:border-gray-800">
                                +{project.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">You don't have any projects yet.</p>
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-full shadow-sm hover:shadow transition-all duration-200"
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
