import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiClipboard } from 'react-icons/fi';

function Header() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200/80 dark:border-gray-800/80 sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h14v14H5V5z" />
                  <path d="M10 8a1 1 0 000 2h4a1 1 0 000-2h-4z" />
                  <path d="M8 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
                  <path d="M14 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300">TaskBoard Pro</span>
            </Link>
            
            {/* Desktop Navigation */}
            {currentUser && (
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <Link 
                  to="/dashboard" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'border-purple-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <FiHome className="mr-1" />
                  Dashboard
                </Link>
                <Link 
                  to="/projects" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                    isActive('/projects') || location.pathname.startsWith('/projects/')
                      ? 'border-purple-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <FiClipboard className="mr-1" />
                  Projects
                </Link>
              </nav>
            )}
          </div>
          
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
            {currentUser ? (
              <div className="ml-3 relative" ref={dropdownRef}>
                <div>
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    id="user-menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-purple-500">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                {isMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 py-1 z-50 divide-y divide-gray-100 dark:divide-gray-700 transform opacity-100 scale-100 transition-all duration-200"
                    role="menu"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{currentUser.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Member</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors duration-200"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="mr-3 h-7 w-7 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors duration-200">
                          <FiUser className="h-4 w-4" />
                        </div>
                        Your Profile
                      </Link>
                      <button
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors duration-200"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        <div className="mr-3 h-7 w-7 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/40 transition-colors duration-200">
                          <FiLogOut className="h-4 w-4" />
                        </div>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 whitespace-nowrap inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                Sign in with Google
              </Link>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && currentUser && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fadeIn">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`${
                isActive('/dashboard')
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300'
                  : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:text-gray-300'
              } block pl-3 pr-4 py-2 text-base font-medium transition-all duration-200`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiHome className="mr-3" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/projects"
              className={`${
                isActive('/projects') || location.pathname.startsWith('/projects/')
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300'
                  : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:text-gray-300'
              } block pl-3 pr-4 py-2 text-base font-medium transition-all duration-200`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiClipboard className="mr-3" />
                Projects
              </div>
            </Link>
            <Link
              to="/profile"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 block pl-3 pr-4 py-2 text-base font-medium transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiUser className="mr-3" />
                Profile
              </div>
            </Link>
            <button
              className="group w-full text-left border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 dark:text-gray-300 block pl-3 pr-4 py-2 text-base font-medium transition-all duration-200"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleSignOut();
              }}
            >
              <div className="flex items-center">
                <FiLogOut className="mr-3 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-100 transition-all duration-200" />
                <span>Sign out</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;