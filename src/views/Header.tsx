import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-blue-900 p-4 shadow-lg border-b border-cyan-500/30">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Nexium</h1>
        <nav className="flex space-x-4">
          <a href="#features" className="text-slate-200 hover:text-cyan-400 transition">Features</a>
          <a href="#testimonials" className="text-slate-200 hover:text-cyan-400 transition">Testimonials</a>
          <Link to="/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Sign In</Link>
          <Link to="/signup" className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;