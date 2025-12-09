import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, X, Check, ChevronRight } from 'lucide-react';
import { getActivities, joinActivity, leaveActivity, createActivity, type Activity } from '../../controllers/activitiesController';

const Events = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Activity | null>(null);
  const [events, setEvents] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventType, setNewEventType] = useState('training');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('user_email') || '';
    setUserEmail(email);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getActivities();
      // Filter only company events (those starting with event_)
      const companyEvents = data.activities.filter(activity => 
        activity.type?.startsWith('event_') || !activity.type?.startsWith('activity_')
      );
      setEvents(companyEvents);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (activityId: number) => {
    try {
      await joinActivity(activityId);
      fetchEvents();
    } catch (err) {
      console.error('Error joining event:', err);
      alert('Failed to join event');
    }
  };

  const handleLeaveEvent = async (activityId: number) => {
    try {
      await leaveActivity(activityId);
      fetchEvents();
    } catch (err) {
      console.error('Error leaving event:', err);
      alert('Failed to leave event');
    }
  };

  const handleCreateEvent = async () => {
    if (!newEventTitle.trim()) return;

    try {
      // Format date to ISO 8601 format if provided
      let formattedDate = newEventDate;
      if (newEventDate) {
        const dateObj = new Date(newEventDate);
        formattedDate = dateObj.toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss
      }

      const eventData: any = {
        title: newEventTitle,
        description: newEventDescription,
        type: `event_${newEventType}`,
        status: 'scheduled',
      };

      if (formattedDate) {
        eventData.date = formattedDate;
      }

      if (newEventLocation) {
        eventData.location = newEventLocation;
      }

      await createActivity(eventData);
      
      setNewEventTitle('');
      setNewEventDescription('');
      setNewEventType('training');
      setNewEventDate('');
      setNewEventLocation('');
      setShowCreateModal(false);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  const isUserJoined = (activity: Activity) => {
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

  const now = new Date();
  const upcomingEvents = events.filter(e => {
    const eventDate = e.date || e.scheduled_date;
    return eventDate ? new Date(eventDate) >= now : true;
  });
  const pastEvents = events.filter(e => {
    const eventDate = e.date || e.scheduled_date;
    return eventDate ? new Date(eventDate) < now : false;
  });

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={fetchEvents}
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
            Company Events
          </h1>
          <p className="text-slate-400 mt-2">Organize and participate in corporate events</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30"
        >
          <Plus size={20} />
          Create Event
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
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'past'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayEvents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No {activeTab} events</p>
          </div>
        ) : (
          displayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
            >
              {/* Header */}
              <div className="h-40 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <Calendar className="w-16 h-16 text-white relative z-10" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{event.description}</p>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-cyan-400" />
                    <span>
                      {(event.date || event.scheduled_date)
                        ? new Date((event.date || event.scheduled_date)!).toLocaleDateString()
                        : 'No date set'}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-cyan-400" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-cyan-400" />
                    <span>
                      {event.employees_joined?.length || event.participants?.length || 0}
                      {event.max_participants ? ` / ${event.max_participants}` : ''} participating
                    </span>
                  </div>
                </div>

                {/* Activity Type Badge */}
                {(event.type || event.activity_type) && (
                  <div>
                    <span className="inline-block bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                      {formatType(event.type || event.activity_type)}
                    </span>
                  </div>
                )}

                {/* Participation Status */}
                <div className="pt-4 border-t border-slate-700">
                  <div
                    className={`text-xs font-semibold px-3 py-2 rounded-lg text-center ${
                      isUserJoined(event)
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isUserJoined(event) ? '✓ Joined' : 'Not Joined'}
                  </div>
                </div>

                <button className="w-full text-cyan-400 hover:text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center relative">
              <Calendar className="w-20 h-20 text-white" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                    <p className="text-slate-400">{selectedEvent.description}</p>
                  </div>
                  {(selectedEvent.type || selectedEvent.activity_type) && (
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                      {formatType(selectedEvent.type || selectedEvent.activity_type)}
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="font-semibold">
                        {(selectedEvent.date || selectedEvent.scheduled_date)
                          ? new Date((selectedEvent.date || selectedEvent.scheduled_date)!).toLocaleDateString()
                          : 'No date set'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Created By</p>
                      <p className="font-semibold">{selectedEvent.creator}</p>
                    </div>
                  </div>
                </div>
                {selectedEvent.location && (
                  <div className="bg-slate-700/50 rounded-lg p-4 col-span-2">
                    <div className="flex items-center gap-3 text-slate-300">
                      <MapPin className="text-cyan-400" size={20} />
                      <div>
                        <p className="text-xs text-slate-400">Location</p>
                        <p className="font-semibold">{selectedEvent.location}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-slate-700/50 rounded-lg p-4 col-span-2">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Participants</p>
                      <p className="font-semibold">
                        {selectedEvent.employees_joined?.length || selectedEvent.participants?.length || 0}
                        {selectedEvent.max_participants ? ` / ${selectedEvent.max_participants}` : ''} joined
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Join/Leave Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <p className="text-sm font-semibold text-white">Participation:</p>
                <div className="flex gap-3">
                  {isUserJoined(selectedEvent) ? (
                    <button
                      onClick={() => handleLeaveEvent(selectedEvent.id)}
                      className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50 transition-all"
                    >
                      <X size={20} />
                      Leave Event
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinEvent(selectedEvent.id)}
                      className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/50 transition-all"
                    >
                      <Check size={20} />
                      Join Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-4">
              Create New Event
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Title *</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Event title"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Description</label>
                <textarea
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="Event description (optional)"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Event Type *</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white transition-all duration-200"
                >
                  <option value="training">Training</option>
                  <option value="meeting">Meeting</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="team_building">Team Building</option>
                  <option value="social">Social Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Date</label>
                <input
                  type="datetime-local"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Location</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="Event location (optional)"
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
                  onClick={handleCreateEvent}
                  disabled={!newEventTitle.trim()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg shadow-cyan-500/30"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
