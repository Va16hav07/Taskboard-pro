import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/layout/Header';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import UserProfile from './pages/UserProfile';
import NotificationPopup from './components/notifications/NotificationPopup';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  const { ConnectionStatus } = useSocket();
  
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/projects/:projectId" element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <ConnectionStatus />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <AppContent />
          <NotificationPopup />
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
