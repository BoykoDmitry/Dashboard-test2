import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ProcessDetails from './pages/ProcessDetails';
import Header from './components/Header';
import './styles/accessibility.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ProtectedRoute>
          <Header />
          <Container fluid className="dashboard-container" id="main-content" tabIndex={-1} role="main" aria-label="Main content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/process/:id" element={<ProcessDetails />} />
            </Routes>
          </Container>
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;