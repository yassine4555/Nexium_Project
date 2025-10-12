import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../controllers/authController';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState(''); // 👈 New state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Pass the secretKey to signUp for validation
    const user = await signUp(name, email, password, secretKey);

    if (user) navigate('/');
    else setError('Sign up failed. Please check your information or secret key.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Sign Up Form */}
      <main className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="bg-purple-700/90 p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Create Your Nexium Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-200 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>

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

            {/* 🟣 New Secret Key Field */}
            <div>
              <label className="block text-gray-200 mb-2">Company Secret Key</label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your company key"
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/signin" className="text-purple-200 hover:text-white transition">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
