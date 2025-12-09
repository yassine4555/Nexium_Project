import { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Users, Zap, Plus, Play, Award, X, Calendar, MapPin } from 'lucide-react';
import { getMyActivities, joinActivity, leaveActivity, createActivity, addParticipants, type Activity as ActivityType } from '../../controllers/activitiesController';

const TeamBuilding = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'leaderboard'>('active');
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');
  const [newActivityType, setNewActivityType] = useState('team_building');
  const [newActivityDate, setNewActivityDate] = useState('');
  const [newActivityLocation, setNewActivityLocation] = useState('');
  const [participantEmails, setParticipantEmails] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('user_email') || '';
    setUserEmail(email);
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getMyActivities();
      // Filter only team activities (those starting with activity_)
      const teamActivities = data.filter(activity => {
        const activityType = activity.type || activity.activity_type || '';
        return activityType.startsWith('activity_');
      });
      setActivities(teamActivities);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinActivity = async (activityId: number) => {
    try {
      await joinActivity(activityId);
      fetchActivities();
    } catch (err) {
      console.error('Error joining activity:', err);
      alert('Failed to join activity');
    }
  };

  const handleLeaveActivity = async (activityId: number) => {
    try {
      await leaveActivity(activityId);
      fetchActivities();
    } catch (err) {
      console.error('Error leaving activity:', err);
      alert('Failed to leave activity');
    }
  };

  const handleCreateActivity = async () => {
    if (!newActivityTitle.trim()) return;

    try {
      // Format date to ISO 8601 format if provided
      let formattedDate = newActivityDate;
      if (newActivityDate) {
        const dateObj = new Date(newActivityDate);
        formattedDate = dateObj.toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss
      }

      const activityData: any = {
        title: newActivityTitle,
        description: newActivityDescription,
        type: `activity_${newActivityType}`,
        status: 'scheduled',
      };

      if (formattedDate) {
        activityData.date = formattedDate;
      }

      if (newActivityLocation) {
        activityData.location = newActivityLocation;
      }

      console.log('Creating team activity:', activityData);

      const createdActivity = await createActivity(activityData);
      console.log('Activity created successfully:', createdActivity);

      // If there are invited participants, add them after creation
      if (participantEmails.trim()) {
        const emailsArray = participantEmails
          .split(',')
          .map(email => email.trim())
          .filter(email => email.length > 0);
        
        if (emailsArray.length > 0 && createdActivity.id) {
          try {
            await addParticipants(createdActivity.id, emailsArray);
            console.log('Participants added successfully');
          } catch (err) {
            console.error('Error adding participants:', err);
            // Don't fail the whole operation if adding participants fails
          }
        }
      }
      
      // Reset form
      setNewActivityTitle('');
      setNewActivityDescription('');
      setNewActivityType('team_building');
      setNewActivityDate('');
      setNewActivityLocation('');
      setParticipantEmails('');
      setShowCreateModal(false);
      
      // Refresh activities
      fetchActivities();
    } catch (err) {
      console.error('Error creating activity:', err);
      alert(`Failed to create activity: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const isUserJoined = (activity: ActivityType) => {
    // Creator is automatically considered as joined
    if (activity.creator === userEmail) {
      return true;
    }
    return activity.employees_joined?.includes(userEmail) || activity.participants?.includes(userEmail) || false;
  };

  const formatType = (type?: string) => {
    if (!type) return '';
    // Remove event_ or activity_ prefix and capitalize
    const cleanType = type.replace(/^(event_|activity_)/, '');
    return cleanType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const displayActivities = activeTab === 'leaderboard' ? [] : activities;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={fetchActivities}
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
            Team Activities
          </h1>
          <p className="text-slate-400 mt-2">Engage in fun activities and build stronger teams</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30"
        >
          <Plus size={20} />
          Organize Activity
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Your Points</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">24,500</p>
            </div>
            <Zap className="w-12 h-12 text-cyan-400/30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Current Rank</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">#4</p>
            </div>
            <Trophy className="w-12 h-12 text-amber-400/30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Activities Completed</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">12</p>
            </div>
            <Award className="w-12 h-12 text-emerald-400/30" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'active'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          My Activities ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          Leaderboard (Coming Soon)
        </button>
      </div>

      {/* Activities Grid or Leaderboard */}
      {activeTab === 'leaderboard' ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-12 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">Leaderboard Coming Soon</h2>
          <p className="text-slate-400">
            Track your progress and compete with teammates. This feature will be available soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayActivities.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No activities joined yet</p>
            </div>
          ) : (
            displayActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
              >
                {/* Header */}
                <div className="h-40 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <Gamepad2 className="w-12 h-12 text-white/80 relative z-10" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{activity.description}</p>
                  </div>

                  {/* Tags */}
                  {(activity.type || activity.activity_type) && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                        {formatType(activity.type || activity.activity_type)}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-cyan-400" />
                      <span>
                        {activity.employees_joined?.length || activity.participants?.length || 0} participants
                      </span>
                    </div>
                    {(activity.date || activity.scheduled_date) && (
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-cyan-400" />
                        <span>{new Date((activity.date || activity.scheduled_date)!).toLocaleDateString()}</span>
                      </div>
                    )}
                    {activity.location && (
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-cyan-400" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <div
                      className={`text-xs font-semibold px-3 py-2 rounded-lg text-center ${
                        isUserJoined(activity)
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isUserJoined(activity) ? '✓ Joined' : 'Not Joined'}
                    </div>
                  </div>

                  {isUserJoined(activity) ? (
                    <button
                      onClick={() => handleLeaveActivity(activity.id)}
                      className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      Leave Activity
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinActivity(activity.id)}
                      className="w-full text-cyan-400 hover:text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play size={16} />
                      Join Activity
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Activity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-gradient-to-br from-slate-800 to-slate-900 z-10">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Organize New Activity
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Activity Title *
                </label>
                <input
                  type="text"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  placeholder="e.g., Python Training Workshop"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newActivityDescription}
                  onChange={(e) => setNewActivityDescription(e.target.value)}
                  placeholder="Describe the activity..."
                  rows={3}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Activity Type *
                </label>
                <select
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="team_building">Team Building</option>
                  <option value="training">Training</option>
                  <option value="workshop">Workshop</option>
                  <option value="sports">Sports</option>
                  <option value="social">Social</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="gaming">Gaming</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={newActivityDate}
                  onChange={(e) => setNewActivityDate(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={newActivityLocation}
                  onChange={(e) => setNewActivityLocation(e.target.value)}
                  placeholder="e.g., Meeting Room A, Virtual, etc."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Invited Participants */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Invite Participants (comma-separated emails)
                </label>
                <textarea
                  value={participantEmails}
                  onChange={(e) => setParticipantEmails(e.target.value)}
                  placeholder="e.g., alice@company.com, bob@company.com"
                  rows={2}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  These employees will be automatically added to the activity
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateActivity}
                  disabled={!newActivityTitle.trim() || !newActivityDate}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/30"
                >
                  Create Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBuilding;
