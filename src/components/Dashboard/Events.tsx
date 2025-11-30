import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, X, Check, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: number;
  capacity: number;
  category: string;
  rsvpStatus: 'attending' | 'not-attending' | 'pending';
  image: string;
}

const Events = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Winter Holiday Party',
      description: 'Join us for a festive celebration with food, drinks, and entertainment!',
      date: '2025-02-15',
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      location: 'Grand Ballroom, Downtown',
      attendees: 87,
      capacity: 200,
      category: 'Social',
      rsvpStatus: 'attending',
      image: 'bg-gradient-to-br from-rose-500 to-rose-600',
    },
    {
      id: '2',
      title: 'Team Sports Day',
      description: 'Compete in fun sports activities and win amazing prizes!',
      date: '2025-02-22',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      location: 'Central Sports Complex',
      attendees: 65,
      capacity: 150,
      category: 'Team Building',
      rsvpStatus: 'pending',
      image: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    {
      id: '3',
      title: 'Innovation Hackathon',
      description: 'Build innovative solutions in 24 hours and showcase your ideas.',
      date: '2025-03-01',
      startTime: '8:00 AM',
      endTime: '8:00 AM',
      location: 'Tech Hub, 5th Floor',
      attendees: 42,
      capacity: 100,
      category: 'Learning',
      rsvpStatus: 'not-attending',
      image: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
  ];

  const pastEvents: Event[] = [
    {
      id: '4',
      title: 'Company Annual Gala',
      description: 'Celebrated our achievements with an elegant dinner event.',
      date: '2024-12-20',
      startTime: '7:00 PM',
      endTime: '11:00 PM',
      location: 'Crystal Palace Hotel',
      attendees: 156,
      capacity: 200,
      category: 'Social',
      rsvpStatus: 'attending',
      image: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    },
  ];

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const handleRsvp = (status: 'attending' | 'not-attending') => {
    if (selectedEvent) {
      setSelectedEvent({ ...selectedEvent, rsvpStatus: status });
    }
  };

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
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
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
        {displayEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
          >
            {/* Image */}
            <div
              className={`h-40 ${event.image} flex items-center justify-center relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
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
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-cyan-400" />
                  <span>{event.startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-cyan-400" />
                  <span>
                    {event.attendees} / {event.capacity} attending
                  </span>
                </div>
              </div>

              {/* Category Badge */}
              <div>
                <span className="inline-block bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                  {event.category}
                </span>
              </div>

              {/* RSVP Status */}
              <div className="pt-4 border-t border-slate-700">
                <div
                  className={`text-xs font-semibold px-3 py-2 rounded-lg text-center ${
                    event.rsvpStatus === 'attending'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : event.rsvpStatus === 'not-attending'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {event.rsvpStatus === 'attending'
                    ? '✓ Attending'
                    : event.rsvpStatus === 'not-attending'
                      ? '✗ Not Attending'
                      : '? Pending Response'}
                </div>
              </div>

              <button className="w-full text-cyan-400 hover:text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                View Details
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Header with Image */}
            <div className={`h-48 ${selectedEvent.image} flex items-center justify-center relative`}>
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
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-4 py-2 rounded-full">
                    {selectedEvent.category}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="font-semibold">{selectedEvent.date}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Time</p>
                      <p className="font-semibold">
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="font-semibold">{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Capacity</p>
                      <p className="font-semibold">
                        {selectedEvent.attendees} / {selectedEvent.capacity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RSVP Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <p className="text-sm font-semibold text-white">Your Response:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRsvp('attending')}
                    className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      selectedEvent.rsvpStatus === 'attending'
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Check size={20} />
                    Attending
                  </button>
                  <button
                    onClick={() => handleRsvp('not-attending')}
                    className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      selectedEvent.rsvpStatus === 'not-attending'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <X size={20} />
                    Not Attending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
