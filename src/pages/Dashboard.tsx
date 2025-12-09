import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Calendar, BookOpen, Gamepad2, LogOut, Menu, X } from 'lucide-react';
import Meetings from '../components/Dashboard/Meetings';
import TeamMembers from '../components/Dashboard/TeamMembers';
import Events from '../components/Dashboard/Events';
import Learning from '../components/Dashboard/Learning';
import TeamBuilding from '../components/Dashboard/TeamActivities';
import { clearAuthData } from '../lib/api';

type TabType = 'meetings' | 'employees' | 'events' | 'learning' | 'teamactivities';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('meetings');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('Employee');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const firstname = localStorage.getItem('user_firstname') || '';
    const lastname = localStorage.getItem('user_lastname') || '';
    const role = localStorage.getItem('user_role') || 'user';
    
    setUserName(`${firstname} ${lastname}`.trim() || 'User');
    setUserRole(role === 'EMPLOYER' ? 'Employee' : 'Manager');
  }, [navigate]);

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = () => {
    try {
      setSigningOut(true);
      clearAuthData();
      setShowSignOutConfirm(false);
      // Use replace to prevent going back to dashboard
      navigate('/', { replace: true });
      // Force reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Error during sign out:', error);
      setSigningOut(false);
    }
  };

  const cancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  const menuItems = [
    { id: 'meetings', label: 'Meetings', icon: BarChart3 },
    { id: 'employees', label: 'Team Members', icon: Users },
    { id: 'events', label: 'Company Events', icon: Calendar },
    { id: 'learning', label: 'Learning Platform', icon: BookOpen },
    { id: 'teamactivities', label: 'Team Activities', icon: Gamepad2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'meetings':
        return <Meetings />;
      case 'employees':
        return <TeamMembers />;
      case 'events':
        return <Events />;
      case 'learning':
        return <Learning />;
      case 'teamactivities':
        return <TeamBuilding />;
      default:
        return <Meetings />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-slate-900 to-slate-950 border-r border-cyan-500/30 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-slate-950">N</span>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              Nexium
            </h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <hr className="border-slate-700 my-6" />

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-cyan-400"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-slate-400">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-auto">
          {renderContent()}
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-slate-400">
                Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelSignOut}
                disabled={signingOut}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                disabled={signingOut}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {signingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing Out...
                  </>
                ) : (
                  'Sign Out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
