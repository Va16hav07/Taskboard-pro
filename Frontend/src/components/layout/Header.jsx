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
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h14v14H5V5z" />
                <path d="M10 8a1 1 0 000 2h4a1 1 0 000-2h-4z" />
                <path d="M8 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
                <path d="M14 12a1 1 0 012 0v4a1 1 0 01-2 0v-4z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">TaskBoard Pro</span>
            </Link>
            
            {/* Desktop Navigation */}
            {currentUser && (
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <Link 
                  to="/dashboard" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'border-primary-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <FiHome className="mr-1" />
                  Dashboard
                </Link>
                <Link 
                  to="/projects" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/projects') || location.pathname.startsWith('/projects/')
                      ? 'border-primary-500 text-gray-900 dark:text-white'
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
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
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
                    className="flex text-sm bg-primary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    id="user-menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-105">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                {isMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50 divide-y divide-gray-100 dark:divide-gray-700"
                    role="menu"
                  >
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                      <p className="font-medium truncate">{currentUser.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Member</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="mr-2 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                        Your Profile
                      </Link>
                      <button
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        <FiLogOut className="mr-2 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 sm:ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && currentUser && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`${
                isActive('/dashboard')
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 text-primary-700 dark:text-primary-300'
                  : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:text-gray-300'
              } block pl-3 pr-4 py-2 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiHome className="mr-2" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/projects"
              className={`${
                isActive('/projects') || location.pathname.startsWith('/projects/')
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 text-primary-700 dark:text-primary-300'
                  : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:text-gray-300'
              } block pl-3 pr-4 py-2 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiClipboard className="mr-2" />
                Projects
              </div>
            </Link>
            <Link
              to="/profile"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 block pl-3 pr-4 py-2 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiUser className="mr-2" />
                Profile
              </div>
            </Link>
            <button
              className="group w-full text-left border-l-4 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100 dark:text-gray-300 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleSignOut();
              }}
            >
              <div className="flex items-center">
                <FiLogOut className="mr-2 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-100 transition-colors duration-200" />
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