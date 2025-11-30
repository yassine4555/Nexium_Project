import { useState } from 'react';
import { Gamepad2, Trophy, Users, Zap, Plus, Play, ChevronRight, TrendingUp, Award } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  participants: number;
  maxParticipants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  image: string;
  yourScore?: number;
  topScore?: number;
  status: 'active' | 'upcoming' | 'completed';
}

const TeamBuilding = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'leaderboard'>('active');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Quick Draw Challenge',
      description: 'Race against time to draw and guess what your teammates are sketching.',
      category: 'Creative',
      participants: 24,
      maxParticipants: 50,
      difficulty: 'easy',
      duration: 15,
      image: 'bg-gradient-to-br from-pink-500 to-pink-600',
      yourScore: 8500,
      topScore: 10200,
      status: 'active',
    },
    {
      id: '2',
      title: 'Trivia Marathon',
      description: 'Test your knowledge across various categories and compete with colleagues.',
      category: 'Knowledge',
      participants: 42,
      maxParticipants: 100,
      difficulty: 'medium',
      duration: 30,
      image: 'bg-gradient-to-br from-purple-500 to-purple-600',
      yourScore: 7200,
      topScore: 9800,
      status: 'active',
    },
    {
      id: '3',
      title: 'Escape Room Puzzle',
      description: 'Solve cryptic puzzles and work together to escape the virtual room.',
      category: 'Strategy',
      participants: 18,
      maxParticipants: 30,
      difficulty: 'hard',
      duration: 45,
      image: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      status: 'upcoming',
    },
    {
      id: '4',
      title: 'Battle Royale Tournament',
      description: 'Compete in a team-based battle royale game for ultimate bragging rights.',
      category: 'Competitive',
      participants: 64,
      maxParticipants: 128,
      difficulty: 'hard',
      duration: 60,
      image: 'bg-gradient-to-br from-red-500 to-red-600',
      status: 'upcoming',
    },
    {
      id: '5',
      title: 'Karaoke Night',
      description: 'Sing your heart out in this fun virtual karaoke competition.',
      category: 'Entertainment',
      participants: 35,
      maxParticipants: 80,
      difficulty: 'easy',
      duration: 120,
      image: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      yourScore: 8800,
      topScore: 9500,
      status: 'active',
    },
  ];

  const leaderboardData = [
    { rank: 1, name: 'Alex Martinez', points: 45200, level: 'Gold' },
    { rank: 2, name: 'Sarah Johnson', points: 42800, level: 'Gold' },
    { rank: 3, name: 'Mike Chen', points: 39500, level: 'Silver' },
    { rank: 4, name: 'You', points: 24500, level: 'Bronze' },
    { rank: 5, name: 'Emily Davis', points: 23100, level: 'Bronze' },
    { rank: 6, name: 'David Wilson', points: 19800, level: 'Silver' },
  ];

  const displayActivities = activities.filter((a) => {
    if (activeTab === 'leaderboard') return false;
    return a.status === activeTab;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'hard':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Gold':
        return 'text-yellow-400';
      case 'Silver':
        return 'text-slate-300';
      case 'Bronze':
        return 'text-amber-600';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            Team Building
          </h1>
          <p className="text-slate-400 mt-2">Engage in fun activities and build stronger teams</p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
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
          Active Now ({activities.filter((a) => a.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'upcoming'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          Upcoming ({activities.filter((a) => a.status === 'upcoming').length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {/* Activities Grid or Leaderboard */}
      {activeTab === 'leaderboard' ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-yellow-400" size={28} />
              Global Leaderboard
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Rank</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Name</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Points</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Level</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.rank} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {entry.rank === 1 && <span className="text-2xl">🥇</span>}
                        {entry.rank === 2 && <span className="text-2xl">🥈</span>}
                        {entry.rank === 3 && <span className="text-2xl">🥉</span>}
                        {entry.rank > 3 && (
                          <span className="text-lg font-bold text-slate-400 w-6">#{entry.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-semibold ${entry.name === 'You' ? 'text-cyan-400' : 'text-white'}`}>
                        {entry.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{entry.points.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${getLevelColor(entry.level)}`}>{entry.level}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity)}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
            >
              {/* Image */}
              <div className={`h-40 ${activity.image} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <Gamepad2 className="w-12 h-12 text-white/80" />
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
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {activity.category}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
                  </span>
                </div>

                {/* Stats */}
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-cyan-400" />
                    <span>
                      {activity.participants} / {activity.maxParticipants} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-cyan-400" />
                    <span>{activity.duration} minutes</span>
                  </div>
                </div>

                {/* Your Score */}
                {activity.yourScore && (
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Your Score</p>
                    <p className="text-lg font-bold text-cyan-400">
                      {activity.yourScore.toLocaleString()} / {activity.topScore?.toLocaleString()}
                    </p>
                  </div>
                )}

                <button className="w-full text-cyan-400 hover:text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  {activity.status === 'active' ? (
                    <>
                      <Play size={16} />
                      Join Now
                    </>
                  ) : (
                    <>
                      View Details
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamBuilding;
