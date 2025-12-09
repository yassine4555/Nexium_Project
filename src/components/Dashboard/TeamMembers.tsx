import { useState, useEffect } from 'react';
import { Search, MessageCircle, Mail, X, Users, Copy, Check, AlertCircle } from 'lucide-react';
import { getMyEmployees, getTeammatesForDisplay, type Teammate } from '../../controllers/teamController';
import { generateManagerCode } from '../../controllers/managerController';

const TeamMembers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Teammate | null>(null);
  const [employees, setEmployees] = useState<Teammate[]>([]);
  const [manager, setManager] = useState<Teammate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [managerToken, setManagerToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenSuccess, setTokenSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const userRole = localStorage.getItem('user_role') || 'EMPLOYEE';
  const isManager = userRole === 'MANAGER' || userRole === 'ADMIN';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      if (isManager) {
        // Managers see their subordinates (employees they manage)
        const data = await getMyEmployees(true);
        setManager(null);
        setEmployees(data.employees);
      } else {
        // Employees see their teammates (peers) and manager
        const data = await getTeammatesForDisplay(true, true);
        setManager(data.manager);
        
        // Combine manager with teammates if manager exists
        if (data.manager) {
          const allMembers = [data.manager, ...data.teammates];
          setEmployees(allMembers);
        } else {
          setEmployees(data.teammates);
        }
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    setTokenLoading(true);
    setTokenError(null);
    setTokenSuccess(null);

    try {
      const data = await generateManagerCode();
      setManagerToken(data.code);
      setExpiresAt(data.expires_at);
      setTokenSuccess('Invitation token generated successfully!');
    } catch (err) {
      setTokenError(err instanceof Error ? err.message : 'Failed to generate token');
      console.error('Error generating token:', err);
    } finally {
      setTokenLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (managerToken) {
      navigator.clipboard.writeText(managerToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatExpirationDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (first_name: string, last_name: string) => {
    return `${first_name[0]}${last_name[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={fetchEmployees}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            Team Members {employees.length > 0 && `(${employees.length})`}
          </h1>
          <p className="text-slate-400 mt-2">
            {isManager 
              ? `Manage your team and generate invitation tokens` 
              : `Your team${manager ? ` - Manager: ${manager.first_name} ${manager.last_name}` : ''}`}
          </p>
        </div>
        {isManager && (
          <button 
            onClick={() => setShowTokenModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30"
          >
            <Users size={20} />
            Generate Invitation Token
          </button>
        )}
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
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No employees found</p>
          </div>
        ) : (
          filteredEmployees.map((employee) => (
            <div
              key={employee.email}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-slate-950">
                  {getInitials(employee.first_name, employee.last_name)}
                </div>
                {/* Manager Badge */}
                {employee.role === 'MANAGER' && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Manager
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-white">{employee.first_name} {employee.last_name}</h3>
              <p className="text-cyan-400 text-sm font-semibold">{employee.email}</p>
              {employee.department && employee.department !== 'None' && (
                <p className="text-slate-400 text-xs mt-1">{employee.department}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 py-2 rounded-lg transition-all text-sm font-semibold"
                >
                  <MessageCircle size={16} />
                  Chat
                </button>
                <a
                  href={`mailto:${employee.email}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 py-2 rounded-lg transition-all text-sm font-semibold"
                >
                  <Mail size={16} />
                  Email
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-slate-950">
                  {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                  <p className="text-xs text-slate-400">{selectedEmployee.email}</p>
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
                  {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
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

      {/* Token Generation Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Generate Invitation Token
              </h2>
              <button
                onClick={() => {
                  setShowTokenModal(false);
                  setManagerToken('');
                  setTokenError(null);
                  setTokenSuccess(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!managerToken ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-slate-400">
                    Create a unique token that employees can use during signup to join your team
                  </p>
                  <button
                    onClick={handleGenerateToken}
                    disabled={tokenLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 mx-auto"
                  >
                    {tokenLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Users size={20} />
                        Generate Token
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-slate-400">Your Invitation Token</span>
                      <button
                        onClick={handleCopyToken}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check size={16} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xl text-center text-cyan-300 tracking-wider break-all">
                      {managerToken}
                    </div>
                    {expiresAt && (
                      <div className="mt-4 text-center text-sm text-slate-400">
                        <span>Expires: {formatExpirationDate(expiresAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                      <strong>Note:</strong> Share this token with employees. They will use it during signup to join your team.
                      All employees using the same token will be part of your team.
                    </p>
                  </div>
                </div>
              )}

              {tokenError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-semibold">Error</p>
                    <p className="text-red-200 text-sm">{tokenError}</p>
                  </div>
                </div>
              )}

              {tokenSuccess && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-300 font-semibold">Success</p>
                    <p className="text-green-200 text-sm">{tokenSuccess}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
