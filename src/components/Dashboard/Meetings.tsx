import { useState } from 'react';
import { Calendar, Clock, Users, Play, ChevronRight, Plus } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  attendees: number;
  status: 'upcoming' | 'completed';
  organizer: string;
  summary?: string;
  thumbnail?: string;
}

const Meetings = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  const upcomingMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Q4 Strategy Planning',
      date: '2025-01-15',
      time: '10:00 AM',
      duration: 90,
      attendees: 12,
      status: 'upcoming',
      organizer: 'Sarah Johnson',
      thumbnail: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      id: '2',
      title: 'Team Sync - Engineering',
      date: '2025-01-16',
      time: '2:00 PM',
      duration: 60,
      attendees: 8,
      status: 'upcoming',
      organizer: 'Mike Chen',
      thumbnail: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    },
    {
      id: '3',
      title: 'Product Launch Review',
      date: '2025-01-17',
      time: '3:30 PM',
      duration: 45,
      attendees: 15,
      status: 'upcoming',
      organizer: 'Emily Davis',
      thumbnail: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
  ];

  const previousMeetings: Meeting[] = [
    {
      id: '4',
      title: 'Monthly All-Hands Meeting',
      date: '2025-01-08',
      time: '9:00 AM',
      duration: 60,
      attendees: 45,
      status: 'completed',
      organizer: 'CEO',
      summary:
        'Discussed company performance, upcoming initiatives, and Q1 roadmap. Key highlights: 15% revenue growth, new partnerships announced.',
    },
    {
      id: '5',
      title: 'Client Presentation - TechCorp',
      date: '2025-01-05',
      time: '11:00 AM',
      duration: 75,
      attendees: 6,
      status: 'completed',
      organizer: 'John Smith',
      summary: 'Successfully presented new features. Client signed contract for annual renewal. Next review in Q2.',
    },
  ];

  const displayMeetings = activeTab === 'upcoming' ? upcomingMeetings : previousMeetings;

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
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
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
        {displayMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
          >
            <div className="flex gap-6">
              {/* Thumbnail */}
              <div
                className={`w-32 h-32 rounded-lg ${
                  meeting.thumbnail || 'bg-gradient-to-br from-slate-700 to-slate-800'
                } flex-shrink-0 flex items-center justify-center shadow-lg`}
              >
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
                <p className="text-slate-400 text-sm mt-1">{meeting.organizer}</p>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-cyan-400" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-cyan-400" />
                    <span>
                      {meeting.time} • {meeting.duration} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-cyan-400" />
                    <span>{meeting.attendees} attendees</span>
                  </div>
                </div>

                {meeting.summary && (
                  <div className="mt-4 p-4 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-slate-300 text-sm">
                      <span className="font-semibold text-cyan-400">Summary:</span> {meeting.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center">
                {activeTab === 'upcoming' ? (
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg">
                    Join Now
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button className="border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all">
                    View Summary
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meetings;
