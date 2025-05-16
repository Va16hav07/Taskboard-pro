import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationList from '../components/notifications/NotificationList';
import BadgeSummary from '../components/badges/BadgeSummary';
import BadgeList from '../components/badges/BadgeList';
import { FiBell, FiAward, FiClock } from 'react-icons/fi';
import './Pages.css';

function UserProfile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else if (currentUser?.email) {
      return currentUser.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 pb-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoLTJ2MkgxNnYyaDJ2MTRoLTJ2MmgydjJoMnYtMmgxNHYyaDJ2LTJoMnYtMmgtMnYtMTRoMnYtMmgtMnYyem0wIDJ2MTRIMjBWMjBoMTZ2MTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-[0.07]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Profile
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* User info card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-5">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
              />
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-medium border-4 border-white dark:border-gray-700 shadow-md">
                {getInitials()}
              </div>
            )}
            <div className="flex-1 mt-4 sm:mt-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {currentUser?.displayName || 'User'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 break-all sm:break-normal">
                {currentUser?.email}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                  Team Member
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Tab buttons - Made more mobile friendly */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex overflow-x-auto scrollbar-hide px-2 py-2">
              <button 
                className={`flex items-center px-4 py-2 mx-1 font-medium text-sm rounded-full transition-all duration-200 ${
                  activeTab === 'notifications' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm' 
                    : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <FiBell className={`${
                  activeTab === 'notifications' ? 'mr-2 h-4 w-4' : 'mr-2 h-4 w-4'
                }`} />
                Notifications
              </button>
              <button 
                className={`flex items-center px-4 py-2 mx-1 font-medium text-sm rounded-full transition-all duration-200 ${
                  activeTab === 'badges' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm' 
                    : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
                onClick={() => setActiveTab('badges')}
              >
                <FiAward className="mr-2 h-4 w-4" />
                Badges
              </button>
              <button 
                className={`flex items-center px-4 py-2 mx-1 font-medium text-sm rounded-full transition-all duration-200 ${
                  activeTab === 'badgeHistory' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm' 
                    : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
                onClick={() => setActiveTab('badgeHistory')}
              >
                <FiClock className="mr-2 h-4 w-4" />
                Badge History
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          {activeTab === 'notifications' && <NotificationList />}
          {activeTab === 'badges' && <BadgeSummary />}
          {activeTab === 'badgeHistory' && <BadgeList />}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
