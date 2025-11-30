import { useState } from 'react';
import { BarChart3, Users, Calendar, BookOpen, Gamepad2, LogOut, Menu, X } from 'lucide-react';
import Meetings from '../components/Dashboard/Meetings';
import Employees from '../components/Dashboard/Employees';
import Events from '../components/Dashboard/Events';
import Learning from '../components/Dashboard/Learning';
import TeamBuilding from '../components/Dashboard/TeamBuilding';

type TabType = 'meetings' | 'employees' | 'events' | 'learning' | 'teambuilding';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('meetings');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'meetings', label: 'Meetings', icon: BarChart3 },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'events', label: 'Company Events', icon: Calendar },
    { id: 'learning', label: 'Learning Platform', icon: BookOpen },
    { id: 'teambuilding', label: 'Team Building', icon: Gamepad2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'meetings':
        return <Meetings />;
      case 'employees':
        return <Employees />;
      case 'events':
        return <Events />;
      case 'learning':
        return <Learning />;
      case 'teambuilding':
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

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-all duration-200">
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
              JD
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-slate-400">Employee</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
