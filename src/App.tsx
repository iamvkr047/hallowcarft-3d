import React, { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundry';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAppDataStore } from './zustand/store';
import { Craft } from './pages/Craft';

const App: React.FC = () => {
  const { checkAuth } = useAppDataStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/craft"
            element={
              <ProtectedRoute>
                <Craft />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;