import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-10 dark:opacity-20"></div>
        </div>
        
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 sm:text-6xl md:text-7xl">
              TaskBoard Pro
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-xl text-gray-600 dark:text-gray-300">
              A collaborative project management platform that helps teams work efficiently
            </p>
            <div className="mt-10">
              {currentUser ? (
                <Link 
                  to="/dashboard" 
                  className="px-8 py-3 text-lg font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:shadow-lg hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="px-8 py-3 text-lg font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:shadow-lg hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Why Choose TaskBoard Pro?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500 dark:text-gray-400">
            Features designed to boost your team's productivity
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white rounded-xl dark:bg-gray-800 hover:shadow-xl group hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-purple-100 rounded-md dark:bg-purple-900/30">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project Management</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">Create and manage projects with flexible boards that adapt to your workflow</p>
            </div>
          </div>
          
          <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white rounded-xl dark:bg-gray-800 hover:shadow-xl group hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-md dark:bg-indigo-900/30">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Task Organization</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">Create, assign and track tasks across different statuses with ease</p>
            </div>
          </div>
          
          <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white rounded-xl dark:bg-gray-800 hover:shadow-xl group hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-md dark:bg-blue-900/30">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Collaboration</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">Work together with your team in real-time with seamless communication</p>
            </div>
          </div>
          
          <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white rounded-xl dark:bg-gray-800 hover:shadow-xl group hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-md dark:bg-green-900/30">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Workflow Automation</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">Set up rules to automate your workflow processes and save time</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials or additional section can go here */}
      <div className="bg-white dark:bg-gray-900">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Ready to boost your productivity?</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Join thousands of teams already using TaskBoard Pro</p>
          <div className="mt-8">
            <Link
              to={currentUser ? "/dashboard" : "/signup"}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 border border-transparent rounded-md shadow-sm hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {currentUser ? "Go to Dashboard" : "Sign up for free"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
