import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-purple-600 p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Nexium</h1>
        <nav>
          <Link to="/signin" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mr-2">Sign In</Link>
          <Link to="/signup" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;