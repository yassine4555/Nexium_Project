import { useState } from 'react';
import { Users, Search, MessageCircle, Phone, Mail, Plus, X } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  phone: string;
  status: 'online' | 'away' | 'offline';
}

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const employees: Employee[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Product Manager',
      department: 'Product',
      avatar: 'SJ',
      email: 'sarah.johnson@nexium.com',
      phone: '+1 (555) 123-4567',
      status: 'online',
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Senior Engineer',
      department: 'Engineering',
      avatar: 'MC',
      email: 'mike.chen@nexium.com',
      phone: '+1 (555) 234-5678',
      status: 'online',
    },
    {
      id: '3',
      name: 'Emily Davis',
      role: 'UX Designer',
      department: 'Design',
      avatar: 'ED',
      email: 'emily.davis@nexium.com',
      phone: '+1 (555) 345-6789',
      status: 'away',
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      role: 'Marketing Specialist',
      department: 'Marketing',
      avatar: 'AR',
      email: 'alex.rodriguez@nexium.com',
      phone: '+1 (555) 456-7890',
      status: 'online',
    },
    {
      id: '5',
      name: 'Jessica Lee',
      role: 'HR Manager',
      department: 'Human Resources',
      avatar: 'JL',
      email: 'jessica.lee@nexium.com',
      phone: '+1 (555) 567-8901',
      status: 'offline',
    },
    {
      id: '6',
      name: 'David Martinez',
      role: 'DevOps Engineer',
      department: 'Engineering',
      avatar: 'DM',
      email: 'david.martinez@nexium.com',
      phone: '+1 (555) 678-9012',
      status: 'online',
    },
  ];

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            Employees
          </h1>
          <p className="text-slate-400 mt-2">Connect with your team members</p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
          <Plus size={20} />
          Invite Member
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, role, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 focus:border-cyan-400 rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors"
        />
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            {/* Avatar & Status */}
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-slate-950">
                {employee.avatar}
              </div>
              <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(employee.status)} rounded-full border-2 border-slate-900`} />
            </div>

            {/* Info */}
            <h3 className="text-lg font-bold text-white">{employee.name}</h3>
            <p className="text-cyan-400 text-sm font-semibold">{employee.role}</p>
            <p className="text-slate-400 text-sm mt-1">{employee.department}</p>

            {/* Status */}
            <div className="mt-4 inline-block">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  employee.status === 'online'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : employee.status === 'away'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-slate-500/20 text-slate-300'
                }`}
              >
                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
              <button
                onClick={() => setSelectedEmployee(employee)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 py-2 rounded-lg transition-all text-sm font-semibold"
              >
                <MessageCircle size={16} />
                Chat
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 py-2 rounded-lg transition-all text-sm font-semibold">
                <Phone size={16} />
                Call
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 py-2 rounded-lg transition-all text-sm font-semibold">
                <Mail size={16} />
                Email
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-slate-950">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedEmployee.name}</p>
                  <p className="text-xs text-slate-400">{selectedEmployee.status}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-64 bg-slate-900/50 p-4 space-y-4 overflow-y-auto">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-950">
                  {selectedEmployee.avatar}
                </div>
                <div className="bg-slate-700 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-white">Hey! How are you doing?</p>
                  <p className="text-xs text-slate-400 mt-1">2:30 PM</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-white">Great! Just finished the project</p>
                  <p className="text-xs text-slate-200 mt-1">2:32 PM</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2 rounded-lg text-white font-semibold transition-all">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
