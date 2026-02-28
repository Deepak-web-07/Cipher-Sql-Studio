import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AssignmentListPage from './pages/AssignmentListPage';
import AssignmentAttemptPage from './pages/AssignmentAttemptPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider, AuthContext } from './context/AuthContext';

import './styles/main.scss'; // Import the main SCSS file

const Header = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>CipherSQLStudio</Link>
      </div>
      {!loading && (
        <div className="header__auth">
          {user ? (
            <>
              <span className="header__greeting">Hello, <strong>{user.username}</strong></span>
              <button onClick={handleLogout} className="btn btn--secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--secondary btn--outline">Login</Link>
              <Link to="/register" className="btn btn--primary">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<AssignmentListPage />} />
              <Route path="/attempt/:assignmentId" element={<AssignmentAttemptPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
