import { useState } from 'react';
import { BookOpen, Award, TrendingUp, Play, Lock, CheckCircle, Star, Clock, Users, Plus, X, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: number;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  rating: number;
  students: number;
  image: string;
  certificate: boolean;
}

const Learning = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Advanced Leadership Skills',
      description: 'Master the art of leading teams and driving organizational change.',
      instructor: 'Dr. Sarah Williams',
      duration: 12,
      difficulty: 'intermediate',
      modules: 8,
      status: 'in-progress',
      progress: 65,
      rating: 4.8,
      students: 342,
      image: 'bg-gradient-to-br from-blue-500 to-blue-600',
      certificate: true,
    },
    {
      id: '2',
      title: 'Data Analytics Fundamentals',
      description: 'Learn to analyze and visualize data to drive business decisions.',
      instructor: 'Prof. John Mitchell',
      duration: 10,
      difficulty: 'beginner',
      modules: 6,
      status: 'completed',
      progress: 100,
      rating: 4.7,
      students: 521,
      image: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      certificate: true,
    },
    {
      id: '3',
      title: 'Digital Marketing Strategy',
      description: 'Create and execute effective digital marketing campaigns.',
      instructor: 'Emma Garcia',
      duration: 8,
      difficulty: 'intermediate',
      modules: 5,
      status: 'not-started',
      progress: 0,
      rating: 4.6,
      students: 289,
      image: 'bg-gradient-to-br from-rose-500 to-rose-600',
      certificate: true,
    },
    {
      id: '4',
      title: 'Cloud Architecture Essentials',
      description: 'Design and deploy scalable cloud solutions.',
      instructor: 'Mark Johnson',
      duration: 14,
      difficulty: 'advanced',
      modules: 10,
      status: 'not-started',
      progress: 0,
      rating: 4.9,
      students: 412,
      image: 'bg-gradient-to-br from-purple-500 to-purple-600',
      certificate: true,
    },
    {
      id: '5',
      title: 'Customer Success Management',
      description: 'Build lasting relationships and drive customer retention.',
      instructor: 'Lisa Chen',
      duration: 6,
      difficulty: 'beginner',
      modules: 4,
      status: 'in-progress',
      progress: 45,
      rating: 4.5,
      students: 198,
      image: 'bg-gradient-to-br from-amber-500 to-amber-600',
      certificate: true,
    },
  ];

  const filteredCourses = courses.filter((course) => {
    if (activeTab === 'all') return true;
    return course.status === activeTab;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusDisplay = (status: string, progress: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'in-progress':
        return (
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full border-2 border-slate-600" />
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
              style={{ animation: 'spin 2s linear infinite' }}
            />
          </div>
        );
      case 'not-started':
        return <Lock className="w-6 h-6 text-slate-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            Learning Platform
          </h1>
          <p className="text-slate-400 mt-2">Develop your skills and earn certificates</p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
          <Plus size={20} />
          Browse All Courses
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Courses Completed</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">3</p>
            </div>
            <Award className="w-12 h-12 text-cyan-400/30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Certificates Earned</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">3</p>
            </div>
            <Award className="w-12 h-12 text-emerald-400/30" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Learning Hours</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">156</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-400/30" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          All Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('in-progress')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'in-progress'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          In Progress ({courses.filter((c) => c.status === 'in-progress').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'completed'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          Completed ({courses.filter((c) => c.status === 'completed').length})
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
          >
            {/* Image */}
            <div className={`h-40 ${course.image} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-4 right-4">{getStatusDisplay(course.status, course.progress)}</div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-400">{course.instructor}</p>
              </div>

              {/* Difficulty */}
              <div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </span>
              </div>

              {/* Progress Bar */}
              {course.status !== 'not-started' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs font-semibold text-cyan-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-300 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-cyan-400" />
                  <span>{course.duration} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-cyan-400" />
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-cyan-400" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-cyan-400" />
                  <span>{course.rating} rating</span>
                </div>
              </div>

              <button className="w-full text-cyan-400 hover:text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                {course.status === 'not-started' ? 'Enroll Now' : course.status === 'in-progress' ? 'Continue' : 'View Certificate'}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header with Image */}
            <div className={`h-48 ${selectedCourse.image} flex items-center justify-center relative`}>
              <button
                onClick={() => setSelectedCourse(null)}
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
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedCourse.title}</h2>
                    <p className="text-slate-400 mb-3">{selectedCourse.description}</p>
                    <p className="text-sm text-cyan-400 font-semibold">Instructor: {selectedCourse.instructor}</p>
                  </div>
                  <span className={`text-xs font-semibold px-4 py-2 rounded-full ${getDifficultyColor(selectedCourse.difficulty)}`}>
                    {selectedCourse.difficulty.charAt(0).toUpperCase() + selectedCourse.difficulty.slice(1)}
                  </span>
                </div>
              </div>

              {/* Progress */}
              {selectedCourse.status !== 'not-started' && (
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Your Progress</h3>
                    <span className="text-2xl font-bold text-cyan-400">{selectedCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${selectedCourse.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Course Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Duration</p>
                      <p className="font-semibold">{selectedCourse.duration} weeks</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <BookOpen className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Modules</p>
                      <p className="font-semibold">{selectedCourse.modules}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Students</p>
                      <p className="font-semibold">{selectedCourse.students}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Star className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-xs text-slate-400">Rating</p>
                      <p className="font-semibold">{selectedCourse.rating}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-700">
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
                  <Play size={20} />
                  {selectedCourse.status === 'not-started'
                    ? 'Start Learning'
                    : selectedCourse.status === 'in-progress'
                      ? 'Continue Learning'
                      : 'View Certificate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
