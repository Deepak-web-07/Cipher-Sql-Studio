import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignmentListPage from './pages/AssignmentListPage';
import AssignmentAttemptPage from './pages/AssignmentAttemptPage';

import './styles/main.scss'; // Import the main SCSS file

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* We can add a simple Header component here later */}
        <header className="header">
          <div className="header__logo">CipherSQLStudio</div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<AssignmentListPage />} />
            <Route path="/attempt/:assignmentId" element={<AssignmentAttemptPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
