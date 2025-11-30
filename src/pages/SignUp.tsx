import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../controllers/authController';

const SignUp = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Pass the secretKey to signUp for validation
    const user = await signUp(firstname, lastname, email, password, dateOfBirth, address);

    if (user) navigate('/signin');
    else setError('Sign up failed. Please check your informations.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Sign Up Form */}
      <main className="relative flex-1 flex items-center justify-center py-24 px-4 z-10">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-4">
              <span className="text-4xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              Join Nexium
            </h2>
            <p className="text-slate-400 text-sm">Create your account and unlock productivity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">First Name</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Last Name</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-200 mb-2 font-medium text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-200 mb-2 font-medium text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                required
              />
            </div>

            {/* Date & Company Token Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-200 mb-2 font-medium text-sm">Company Token</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Token"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-600" />
            <span className="text-slate-400 text-sm">Already have an account?</span>
            <div className="flex-1 h-px bg-slate-600" />
          </div>

          {/* Sign In Link */}
          <p className="text-center">
            <Link to="/signin" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors text-lg">
              Sign In here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
