import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './pages/DashboardOverview';
import StudentManagement from './pages/StudentManagement';
import FacultyManagement from './pages/FacultyManagement';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [user, setUser] = useState(null); // Simulated session state
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('overview');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'System Overview';
      case 'students':
        return 'Student Directory';
      case 'faculty':
        return 'Faculty Directory';
      case 'settings':
        return 'System Settings';
      default:
        return 'Admas University Management';
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'students':
        return <StudentManagement searchTerm={searchTerm} />;
      case 'faculty':
        return <FacultyManagement searchTerm={searchTerm} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  // If not logged in, render the login page experience
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render Admin Dashboard layout
  return (
    <div 
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'hsl(var(--bg-obsidian))',
        position: 'relative',
        gap: '24px',
        paddingRight: '32px'
      }}
    >
      {/* Dynamic glow nodes */}
      <div className="glow-bg">
        <div className="glow-circle glow-1" style={{ opacity: 0.1 }}></div>
        <div className="glow-circle glow-2" style={{ opacity: 0.1 }}></div>
        <div className="glow-circle glow-3"></div>
      </div>

      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user} 
      />

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, minWidth: 0, paddingBottom: '32px' }}>
        {/* Header toolbar */}
        <Header 
          title={getPageTitle()} 
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* View Content Workspace */}
        <main style={{ flex: 1 }}>
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default App;
