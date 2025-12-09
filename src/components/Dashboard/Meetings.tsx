import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Play, ChevronRight, Plus, Lock, X, Trash2 } from 'lucide-react';
import { getMyMeetings, createMeeting, joinMeetingWithPassword, deleteMeeting, type Meeting as MeetingType } from '../../controllers/meetingsController';

const Meetings = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');
  const [meetings, setMeetings] = useState<MeetingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingObject, setNewMeetingObject] = useState('');
  const [newMeetingDescription, setNewMeetingDescription] = useState('');
  const [newMeetingPassword, setNewMeetingPassword] = useState('');
  const [invitedEmails, setInvitedEmails] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingType | null>(null);
  const [meetingPassword, setMeetingPassword] = useState('');
  const [joiningMeeting, setJoiningMeeting] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      console.log('=== COMPONENT: Fetching meetings ===');
      const response = await getMyMeetings({ filter: 'all' });
      console.log('=== COMPONENT: Response received ===', response);
      
      if (!response || !response.data) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }
      
      setMeetings(response.data);
      console.log('=== COMPONENT: Meetings set successfully ===', response.data.length, 'meetings');
      console.log('=== COMPONENT: Statistics ===', response.statistics);
      setError(null);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load meetings';
      setError(errorMessage);
      console.error('=== COMPONENT: Error fetching meetings ===');
      console.error('Error object:', err);
      console.error('Error message:', errorMessage);
      console.error('Error stack:', err?.stack);
      setMeetings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    if (!newMeetingTitle.trim()) return;

    try {
      const invitedList = invitedEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      await createMeeting({
        title: newMeetingTitle,
        object: newMeetingObject,
        description: newMeetingDescription,
        invitedEmployeesList: invitedList,
        password: newMeetingPassword,
      });
      setNewMeetingTitle('');
      setNewMeetingObject('');
      setNewMeetingDescription('');
      setNewMeetingPassword('');
      setInvitedEmails('');
      setShowCreateModal(false);
      fetchMeetings();
    } catch (err) {
      console.error('Error creating meeting:', err);
      alert('Failed to create meeting');
    }
  };

  const handleJoinMeeting = (meeting: MeetingType) => {
    setSelectedMeeting(meeting);
    setShowPasswordModal(true);
    setMeetingPassword('');
  };

  const handleJoinWithPassword = async () => {
    if (!selectedMeeting) return;

    try {
      setJoiningMeeting(true);
      console.log('=== JOIN MEETING DEBUG ===');
      console.log('Meeting ID:', selectedMeeting.meeting_id);
      console.log('Password length:', meetingPassword.length);
      console.log('Sending request to join meeting...');
      
      const response = await joinMeetingWithPassword(selectedMeeting.meeting_id, meetingPassword);
      
      console.log('Response received:', response);
      console.log('Response type:', typeof response);
      console.log('Response.success:', response.success);
      console.log('Response.redirectUrl:', response.redirectUrl);
      
      if (response.success && response.redirectUrl) {
        console.log('Opening URL:', response.redirectUrl);
        
        // Close the modal first
        setShowPasswordModal(false);
        setMeetingPassword('');
        setSelectedMeeting(null);
        
        // Small delay to ensure modal closes before opening new window
        setTimeout(() => {
          try {
            // Try to open in a new tab
            const newWindow = window.open(response.redirectUrl, '_blank', 'noopener,noreferrer');
            
            // Check if popup was blocked
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
              console.warn('Popup blocked, opening in current tab');
              // Popup was blocked, redirect in same tab
              window.location.href = response.redirectUrl;
            } else {
              console.log('Meeting opened successfully in new tab');
            }
          } catch (openError) {
            console.error('Error opening window:', openError);
            // Fallback to current tab
            window.location.href = response.redirectUrl;
          }
        }, 100);
      } else {
        console.error('Invalid response - success:', response.success, 'redirectUrl:', response.redirectUrl);
        alert('Failed to join meeting. Invalid response from server.');
      }
    } catch (err: any) {
      console.error('=== JOIN MEETING ERROR ===');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      alert(err.message || 'Failed to join meeting. Please check your password.');
    } finally {
      setJoiningMeeting(false);
      console.log('=== JOIN MEETING END ===');
    }
  };

  const handleDeleteMeeting = async (meetingId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    
    if (!confirm('Are you sure you want to delete this meeting?')) {
      return;
    }

    try {
      await deleteMeeting(meetingId);
      // Refresh meetings list
      fetchMeetings();
    } catch (err: any) {
      console.error('Error deleting meeting:', err);
      alert(err.message || 'Failed to delete meeting. You may not have permission to delete this meeting.');
    }
  };

  const upcomingMeetings = meetings.filter(m => m.is_active);
  const previousMeetings = meetings.filter(m => !m.is_active);
  const displayMeetings = activeTab === 'upcoming' ? upcomingMeetings : previousMeetings;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={fetchMeetings}
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
            Meetings
          </h1>
          <p className="text-slate-400 mt-2">Manage and join your team meetings</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30"
        >
          <Plus size={20} />
          Schedule Meeting
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          Upcoming ({upcomingMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('previous')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'previous'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          Previous ({previousMeetings.length})
        </button>
      </div>

      {/* Meetings List */}
      <div className="grid gap-4">
        {displayMeetings.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No {activeTab} meetings</p>
          </div>
        ) : (
          displayMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
            >
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex-shrink-0 flex items-center justify-center shadow-lg">
                  {activeTab === 'upcoming' ? (
                    <Calendar className="w-12 h-12 text-cyan-300" />
                  ) : (
                    <Play className="w-12 h-12 text-cyan-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {meeting.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Created by: {meeting.created_by}</p>
                  {meeting.description && (
                    <p className="text-slate-300 text-sm mt-2">{meeting.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-cyan-400" />
                      <span>{new Date(meeting.created_at).toLocaleDateString()}</span>
                    </div>
                    {meeting.has_password && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-cyan-400" />
                        <span className="text-emerald-400">🔒 Password Protected</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-cyan-400" />
                      <span className={meeting.is_active ? 'text-emerald-400' : 'text-slate-400'}>
                        {meeting.is_active ? 'Active' : 'Ended'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center">
                  {activeTab === 'upcoming' && meeting.is_active ? (
                    <button 
                      onClick={() => handleJoinMeeting(meeting)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg"
                    >
                      Join Now
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button className="border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all">
                      View Details
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-4">
              Schedule New Meeting
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Title *</label>
                <input
                  type="text"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  placeholder="Meeting title"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Object</label>
                <input
                  type="text"
                  value={newMeetingObject}
                  onChange={(e) => setNewMeetingObject(e.target.value)}
                  placeholder="Meeting objective (optional)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Description</label>
                <textarea
                  value={newMeetingDescription}
                  onChange={(e) => setNewMeetingDescription(e.target.value)}
                  placeholder="Meeting description (optional)"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Password</label>
                <input
                  type="password"
                  value={newMeetingPassword}
                  onChange={(e) => setNewMeetingPassword(e.target.value)}
                  placeholder="Meeting password (optional)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Invited Employees</label>
                <input
                  type="text"
                  value={invitedEmails}
                  onChange={(e) => setInvitedEmails(e.target.value)}
                  placeholder="Comma-separated emails (optional)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMeeting}
                  disabled={!newMeetingTitle.trim()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg shadow-cyan-500/30"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Verification Modal */}
      {showPasswordModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Join Meeting
              </h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setMeetingPassword('');
                  setSelectedMeeting(null);
                }}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-300 mb-2">
                <span className="font-semibold text-white">{selectedMeeting.title}</span>
              </p>
              <p className="text-slate-400 text-sm">
                Created by: {selectedMeeting.created_by}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-slate-200 mb-2 font-medium text-sm">
                  <Lock size={16} className="text-cyan-400" />
                  Meeting Password
                </label>
                <input
                  type="password"
                  value={meetingPassword}
                  onChange={(e) => setMeetingPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && meetingPassword.trim()) {
                      handleJoinWithPassword();
                    }
                  }}
                  placeholder="Enter meeting password"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setMeetingPassword('');
                    setSelectedMeeting(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white transition-all"
                  disabled={joiningMeeting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinWithPassword}
                  disabled={!meetingPassword.trim() || joiningMeeting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg shadow-cyan-500/30"
                >
                  {joiningMeeting ? 'Joining...' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;
