import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './views/Header';
import Footer from './views/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import './App.css'

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = ['/signin', '/signup', '/dashboard'].some(path => location.pathname.startsWith(path));

  return (
    <div className="h-screen bg-black text-white">
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
