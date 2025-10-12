import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './views/Header';
import Footer from './views/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './App.css'

function AppContent() {
  const location = useLocation();
  const hideHeader = ['/signin', '/signup'].includes(location.pathname);
  const showFooter = location.pathname !== '/signin' && location.pathname !== '/signup';

  return (
    <div className="h-screen bg-black text-white">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      {showFooter && <Footer />}
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
