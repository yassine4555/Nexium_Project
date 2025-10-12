import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../controllers/authController';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await signIn(email, password);
    if (user) navigate('/');
    else setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
     

      {/* Sign In Form */}
      <main className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="bg-purple-700/90 p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-8 text-center">Sign In to Nexium</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>
            {error && <p className="text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-200"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-gray-300">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-purple-200 hover:text-white transition">Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
