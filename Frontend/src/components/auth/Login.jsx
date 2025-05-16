import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

function Login() {
  const { signInWithGoogle, currentUser, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
        <div>
          <div className="flex justify-center">
            <svg className="h-16 w-16 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h14v14H5V5z" />
              <path d="M10 8a1 1 0 000 2h4a1 1 0 000-2h-4z" />
              <path d="M8 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
              <path d="M14 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to TaskBoard Pro
          </h2>
          <p className="mt-2 text-center text-sm text-blue-600 dark:text-blue-400">
            Collaborative project management platform
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md text-red-800 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <button 
            onClick={handleGoogleSignIn} 
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <span className="flex items-center">
              <FcGoogle className="w-5 h-5 mr-3" />
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
