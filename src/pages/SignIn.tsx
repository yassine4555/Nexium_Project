import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../controllers/authController';
import { isAuthenticated } from '../lib/api';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await signIn(email, password);
      if (user) {
        // Use replace to prevent going back to sign in
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Signin error:', error);
      setError(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Sign In Form */}
      <main className="relative flex-1 flex items-center justify-center py-24 px-4 z-10">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-4">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Welcome Back</h2>
            <p className="text-slate-400">Sign in to access your Nexium dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-slate-200 mb-3 font-medium text-sm tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-slate-200 mb-3 font-medium text-sm tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:scale-[1.02] active:scale-[0.98] mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-slate-600" />
            <span className="text-slate-400 text-sm">New to Nexium?</span>
            <div className="flex-1 h-px bg-slate-600" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-300">
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors text-lg">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
